export interface ApiMeta {
  page?: number;
  size?: number;
  total?: number;
  pages?: number;
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

export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  let refreshPromise: Promise<boolean> | null = null;

  const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');
  const apiBasePath = config.public.apiBasePath || '/api/v1';
  const apiBaseUrl = normalizeBaseUrl(config.public.backendOrigin || '');
  const requestBaseUrl = apiBaseUrl && !apiBaseUrl.endsWith('/api/v1')
    ? `${apiBaseUrl}${apiBasePath}`
    : apiBaseUrl;

  const buildAuthHeaders = (headers?: HeadersInit) => {
    const nextHeaders = new Headers(headers);
    if (authStore.accessToken) {
      nextHeaders.set('Authorization', `Bearer ${authStore.accessToken}`);
    }
    return nextHeaders;
  };

  const rawApi = $fetch.create({
    baseURL: requestBaseUrl,
    onRequest({ options }) {
      if (import.meta.client) authStore.syncTokensFromCookies();
      else authStore.hydrateUserFromToken();
      options.headers = buildAuthHeaders(options.headers as HeadersInit | undefined);
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
      await refreshAccessToken();
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
