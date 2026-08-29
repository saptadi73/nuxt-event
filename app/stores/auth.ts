type AuthUser = {
  id?: string;
  email?: string;
  full_name?: string;
  name?: string;
  role?: string;
  roles?: string[];
  preferred_locale?: 'en' | 'zh-CN';
};

const storageKeys = {
  accessToken: 'iwbif_access_token',
  refreshToken: 'iwbif_refresh_token',
  user: 'iwbif_auth_user'
};

const readClientCookie = (key: string): string => {
  if (import.meta.server || typeof document === 'undefined') return '';
  const prefix = `${encodeURIComponent(key)}=`;
  const cookie = document.cookie.split('; ').find((item) => item.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
};

const writeClientCookie = (key: string, value: string) => {
  if (import.meta.server || typeof document === 'undefined') return;
  const maxAge = value ? authCookieOptions.maxAge : 0;
  const secure = authCookieOptions.secure ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; Path=${authCookieOptions.path}; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

const readStorageToken = (key: string): string => {
  if (import.meta.server || typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
};

const writeStorageToken = (key: string, value: string) => {
  if (import.meta.server || typeof window === 'undefined') return;
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // Storage is optional; token state is still kept in memory/cookies.
  }
};

const readStoredUser = (): AuthUser | null => {
  if (import.meta.server || typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(storageKeys.user);
    if (!value) return null;
    const user = JSON.parse(value) as AuthUser;
    return user && typeof user === 'object' ? user : null;
  } catch {
    return null;
  }
};

const writeStoredUser = (user: AuthUser | null) => {
  if (import.meta.server || typeof window === 'undefined') return;
  try {
    if (user) window.localStorage.setItem(storageKeys.user, JSON.stringify(user));
    else window.localStorage.removeItem(storageKeys.user);
  } catch {
    // Storage is optional; token state is still kept in memory/cookies.
  }
};

const authCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30,
  secure: process.env.NODE_ENV === 'production'
};

const decodeJwtPayloadValue = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const binary = atob(padded);
    const json = decodeURIComponent(
      Array.from(binary).map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`).join('')
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const isJwtExpired = (token: string, clockSkewSeconds = 30): boolean => {
  if (!token) return true;
  const payload = decodeJwtPayloadValue(token);
  if (!payload) return true;
  if (typeof payload.exp !== 'number') return false;
  return payload.exp <= Math.floor(Date.now() / 1000) + clockSkewSeconds;
};

const normalizeRole = (value?: string | string[] | null): string | undefined => {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  const first = list.find((item) => typeof item === 'string' && item.trim()) as string | undefined;
  return first ? first.trim().toLowerCase() : undefined;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: useCookie<string>('access_token', { ...authCookieOptions, default: () => '' }).value || readStorageToken(storageKeys.accessToken),
    refreshToken: useCookie<string>('refresh_token', { ...authCookieOptions, default: () => '' }).value || readStorageToken(storageKeys.refreshToken),
    user: null as AuthUser | null
  }),
  getters: {
    isAccessTokenExpired: (state) => isJwtExpired(state.accessToken),
    isRefreshTokenExpired: (state) => isJwtExpired(state.refreshToken),
    isAuthenticated: (state) => !isJwtExpired(state.accessToken) || !isJwtExpired(state.refreshToken),
    userRole: (state) => {
      const directRole = normalizeRole(state.user?.role);
      if (directRole) return directRole;
      const roleFromList = normalizeRole(state.user?.roles);
      if (roleFromList) return roleFromList;
      return '';
    },
    isAdminOrOrganizer: (state) => {
      const role = normalizeRole(state.user?.role) ?? normalizeRole(state.user?.roles);
      return role === 'admin' || role === 'organizer';
    }
  },
  actions: {
    syncTokensFromCookies() {
      // Public prerender payloads contain an anonymous Pinia snapshot. Restore
      // the browser cookies after hydration before auth state is inspected.
      const persistedAccessToken = readClientCookie('access_token') || readStorageToken(storageKeys.accessToken);
      const persistedRefreshToken = readClientCookie('refresh_token') || readStorageToken(storageKeys.refreshToken);

      this.accessToken = persistedAccessToken;
      this.refreshToken = persistedRefreshToken;

      if (isJwtExpired(this.accessToken) && isJwtExpired(this.refreshToken)) {
        this.clearToken();
        return;
      }

      if (this.accessToken) writeStorageToken(storageKeys.accessToken, this.accessToken);
      if (this.refreshToken) writeStorageToken(storageKeys.refreshToken, this.refreshToken);

      this.hydrateUserFromToken();
      if (!this.userRole) {
        const storedUser = readStoredUser();
        const payload = this.decodeJwtPayload(this.accessToken);
        const tokenUserId = typeof payload?.sub === 'string' ? payload.sub : typeof payload?.id === 'string' ? payload.id : '';
        if (storedUser && (!tokenUserId || !storedUser.id || storedUser.id === tokenUserId)) {
          this.setUser(storedUser);
        }
      }
    },
    decodeJwtPayload(token: string): Record<string, unknown> | null {
      return decodeJwtPayloadValue(token);
    },
    resolveRoleFromPayload(payload: Record<string, unknown>): string | undefined {
      const fromRole = normalizeRole((payload.role as string | string[] | undefined) ?? undefined);
      if (fromRole) return fromRole;

      const nestedUser = payload.user as Record<string, unknown> | undefined;
      const nestedRole = normalizeRole((nestedUser?.role as string | string[] | undefined) ?? undefined);
      if (nestedRole) return nestedRole;

      const roles = payload.roles as string[] | undefined;
      const roleList = normalizeRole(roles);
      if (roleList) return roleList;

      if (payload.is_admin === true) return 'admin';
      if (payload.is_organizer === true) return 'organizer';

      const scopes = payload.scopes;
      if (Array.isArray(scopes)) {
        const scopeRole = normalizeRole(scopes);
        if (scopeRole) return scopeRole;
      }
      if (typeof scopes === 'string') {
        const scopeRole = normalizeRole(scopes);
        if (scopeRole) return scopeRole;
      }

      return undefined;
    },
    hydrateUserFromToken() {
      if (!this.accessToken) {
        if (this.user) this.user = null;
        return;
      }

      const payload = this.decodeJwtPayload(this.accessToken);
      if (!payload) return;

      const role = this.resolveRoleFromPayload(payload);
      const id = typeof payload.sub === 'string' ? payload.sub : typeof payload.id === 'string' ? payload.id : undefined;
      const email = typeof payload.email === 'string' ? payload.email : undefined;
      const fullName = typeof payload.full_name === 'string' ? payload.full_name : typeof payload.name === 'string' ? payload.name : undefined;

      this.user = {
        ...(this.user ?? {}),
        ...(id ? { id } : {}),
        ...(email ? { email } : {}),
        ...(fullName ? { full_name: fullName } : {}),
        ...(role ? { role } : {})
      };
    },
    setTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      if (import.meta.client) {
        writeClientCookie('access_token', accessToken);
        writeClientCookie('refresh_token', refreshToken);
      } else {
        useCookie<string>('access_token', authCookieOptions).value = accessToken;
        useCookie<string>('refresh_token', authCookieOptions).value = refreshToken;
      }
      writeStorageToken(storageKeys.accessToken, accessToken);
      writeStorageToken(storageKeys.refreshToken, refreshToken);
      this.hydrateUserFromToken();
    },
    setUser(user: AuthUser | null) {
      this.user = user ? { ...user, role: user.role ?? normalizeRole(user.roles) } : null;
      writeStoredUser(this.user);
    },
    clearToken() {
      this.accessToken = '';
      this.refreshToken = '';
      this.user = null;
      if (import.meta.client) {
        writeClientCookie('access_token', '');
        writeClientCookie('refresh_token', '');
      } else {
        useCookie<string | null>('access_token', authCookieOptions).value = null;
        useCookie<string | null>('refresh_token', authCookieOptions).value = null;
      }
      writeStorageToken(storageKeys.accessToken, '');
      writeStorageToken(storageKeys.refreshToken, '');
      writeStoredUser(null);
    }
  }
});
