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

let refreshPromise: Promise<boolean> | null = null;

export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  return $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ options }) {
      if (authStore.accessToken) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${authStore.accessToken}`
        };
      }
    },
    async onResponseError({ request, response, options }) {
      if (response.status === 401 && authStore.refreshToken && request !== '/auth/refresh') {
        if (!refreshPromise) {
          refreshPromise = $fetch<ApiResponse<{ access_token: string; refresh_token: string }>>('/auth/refresh', {
            baseURL: config.public.apiBaseUrl,
            method: 'POST',
            body: {
              refresh_token: authStore.refreshToken
            }
          })
            .then((result) => {
              if (result.success) {
                authStore.setTokens({
                  accessToken: result.data.access_token,
                  refreshToken: result.data.refresh_token
                });
                return true;
              }
              authStore.clearToken();
              return false;
            })
            .catch(() => {
              authStore.clearToken();
              return false;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const refreshed = await refreshPromise;
        if (refreshed) {
          const retryHeaders = {
            ...(options.headers || {}),
            Authorization: `Bearer ${authStore.accessToken}`
          };

          return $fetch(request, {
            ...options,
            baseURL: config.public.apiBaseUrl,
            headers: retryHeaders
          });
        }
      }

      if (response.status === 401) {
        authStore.clearToken();
      }
    }
  });
}
