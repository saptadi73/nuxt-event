export interface ApiMeta {
  page?: number;
  size?: number;
  total?: number;
  pages?: number;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: ApiMeta | null;
  request_id?: string;
  timestamp?: string;
  errors?: Array<{ field?: string; code: string; message: string }>;
}

export interface LocalizedContentMeta {
  content_locale?: 'en' | 'zh-CN' | 'source';
  translation_fallback?: boolean;
}

export function useApi() {
  const config = useRuntimeConfig();
  const route = useRoute();
  const authStore = useAuthStore();
  // @nuxtjs/i18n owns this cookie. Read it without a default so SSR does not
  // attempt to write a competing value while locale detection is running.
  const localeCookie = useCookie<'en' | 'zh-CN'>('iwbif_locale');
  let refreshPromise: Promise<boolean> | null = null;

  const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');
  const apiBasePath = config.public.apiBasePath || '/api/v1';
  const apiBaseUrl = normalizeBaseUrl(config.public.backendOrigin || '');
  const requestBaseUrl = import.meta.client && import.meta.dev
    ? apiBasePath
    : apiBaseUrl && !apiBaseUrl.endsWith('/api/v1')
      ? `${apiBaseUrl}${apiBasePath}`
      : apiBaseUrl;

  const buildAuthHeaders = (headers?: HeadersInit) => {
    const nextHeaders = new Headers(headers);
    if (!nextHeaders.has('Accept-Language')) {
      const locale = route.path.startsWith('/admin')
        ? 'en'
        : localeCookie.value === 'zh-CN' ? 'zh-CN' : 'en';
      nextHeaders.set('Accept-Language', locale === 'zh-CN' ? 'zh-CN,zh;q=0.9,en;q=0.8' : 'en');
    }
    if (authStore.accessToken) {
      nextHeaders.set('Authorization', `Bearer ${authStore.accessToken}`);
    }
    return nextHeaders;
  };

  const requestLocale = () => route.path.startsWith('/admin')
    ? 'en'
    : localeCookie.value === 'zh-CN' ? 'zh-CN' : 'en';

  const rawApi = $fetch.create({
    baseURL: requestBaseUrl,
    onRequest({ request, options }) {
      if (import.meta.client) authStore.syncTokensFromCookies();
      else authStore.hydrateUserFromToken();
      options.headers = buildAuthHeaders(options.headers as HeadersInit | undefined);
      const requestValue = typeof request === 'string' ? request : request instanceof Request ? request.url : String(request);
      const query = options.query;
      const hasLocaleInUrl = /[?&]locale=/.test(requestValue);
      const hasLocaleInOptions = query instanceof URLSearchParams
        ? query.has('locale')
        : Boolean(query && typeof query === 'object' && 'locale' in query);
      if (!hasLocaleInUrl && !hasLocaleInOptions) {
        options.query = query instanceof URLSearchParams
          ? new URLSearchParams([...query.entries(), ['locale', requestLocale()]])
          : { ...(query as Record<string, unknown> | undefined), locale: requestLocale() };
      }
    }
  });

  type ApiRequest = Parameters<typeof $fetch>[0];
  type ApiOptions = Parameters<typeof $fetch>[1];

  const errorStatus = (error: unknown) => {
    const fetchError = error as {
      status?: number;
      statusCode?: number;
      response?: { status?: number };
    };
    return fetchError.response?.status ?? fetchError.statusCode ?? fetchError.status;
  };

  const isPublicAuthRequest = (request: ApiRequest) => {
    const value = typeof request === 'string'
      ? request
      : request instanceof Request
        ? request.url
        : String(request);

    return [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-email'
    ].some((path) => value.includes(path));
  };

  const refreshAccessToken = async () => {
    if (refreshPromise) return refreshPromise;

    const refreshToken = authStore.refreshToken;
    if (!refreshToken || authStore.isRefreshTokenExpired) {
      authStore.clearToken();
      return false;
    }

    refreshPromise = $fetch<ApiResponse<{ access_token: string; refresh_token: string }>>('/auth/refresh', {
      baseURL: requestBaseUrl,
      method: 'POST',
      body: { refresh_token: refreshToken }
    })
      .then((result) => {
        if (!result.success || !result.data?.access_token || !result.data?.refresh_token) {
          authStore.clearToken();
          return false;
        }

        authStore.setTokens({
          accessToken: result.data.access_token,
          refreshToken: result.data.refresh_token
        });
        return true;
      })
      .catch((error: unknown) => {
        const status = errorStatus(error);
        if (status === 400 || status === 401 || status === 403) {
          authStore.clearToken();
        }
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise;
  };

  return async function api<T>(request: ApiRequest, options?: ApiOptions): Promise<T> {
    if (import.meta.client) authStore.syncTokensFromCookies();
    else authStore.hydrateUserFromToken();

    const canRefresh = !isPublicAuthRequest(request);
    let refreshAttempted = false;

    if (canRefresh && authStore.refreshToken && (!authStore.accessToken || authStore.isAccessTokenExpired)) {
      refreshAttempted = true;
      const refreshed = await refreshAccessToken();
      if (!refreshed && (!authStore.accessToken || authStore.isAccessTokenExpired)) {
        throw new Error(localeCookie.value === 'zh-CN' && !route.path.startsWith('/admin')
          ? '您的登录会话已过期。请重新登录后继续。'
          : 'Your session has expired. Please sign in again to continue.');
      }
    }

    const accessTokenAtRequest = authStore.accessToken;

    try {
      return await rawApi<T>(request, options);
    } catch (error) {
      if (errorStatus(error) !== 401 || !canRefresh) throw error;

      // Another request may already have refreshed the token while this request
      // was in flight. Retry directly with that newer access token.
      const tokenWasRefreshed = Boolean(
        authStore.accessToken
        && authStore.accessToken !== accessTokenAtRequest
        && !authStore.isAccessTokenExpired
      );
      const refreshed = tokenWasRefreshed || (!refreshAttempted && await refreshAccessToken());

      if (!refreshed) {
        if (!authStore.refreshToken || authStore.isRefreshTokenExpired) authStore.clearToken();
        throw error;
      }

      try {
        return await rawApi<T>(request, options);
      } catch (retryError) {
        if (errorStatus(retryError) === 401) authStore.clearToken();
        throw retryError;
      }
    }
  };
}
