type AuthUser = {
  email?: string;
  full_name?: string;
  name?: string;
  role?: string;
  roles?: string[];
};

const normalizeRole = (value?: string | string[] | null): string | undefined => {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  const first = list.find((item) => typeof item === 'string' && item.trim()) as string | undefined;
  return first ? first.trim().toLowerCase() : undefined;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: useCookie<string>('access_token', { default: () => '' }).value,
    refreshToken: useCookie<string>('refresh_token', { default: () => '' }).value,
    user: null as AuthUser | null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
    userRole: (state) => {
      const directRole = normalizeRole(state.user?.role);
      if (directRole) return directRole;
      const roleFromList = normalizeRole(state.user?.roles);
      if (roleFromList) return roleFromList;
      return '';
    },
    isAdminOrOrganizer: (state) => {
      const role = state.userRole;
      return role === 'admin' || role === 'organizer';
    }
  },
  actions: {
    decodeJwtPayload(token: string): Record<string, unknown> | null {
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
      const email = typeof payload.email === 'string' ? payload.email : undefined;
      const fullName = typeof payload.full_name === 'string' ? payload.full_name : typeof payload.name === 'string' ? payload.name : undefined;

      this.user = {
        ...(this.user ?? {}),
        ...(email ? { email } : {}),
        ...(fullName ? { full_name: fullName } : {}),
        ...(role ? { role } : {})
      };
    },
    setTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      useCookie<string>('access_token').value = accessToken;
      useCookie<string>('refresh_token').value = refreshToken;
      this.hydrateUserFromToken();
    },
    setUser(user: AuthUser | null) {
      this.user = user ? { ...user, role: user.role ?? normalizeRole(user.roles) } : null;
    },
    clearToken() {
      this.accessToken = '';
      this.refreshToken = '';
      this.user = null;
      useCookie<string | null>('access_token').value = null;
      useCookie<string | null>('refresh_token').value = null;
    }
  }
});
