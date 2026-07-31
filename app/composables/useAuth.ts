import { useApi, type ApiResponse } from '~/composables/useApi';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  full_name: string;
  password: string;
}

export function useAuth() {
  const authStore = useAuthStore();
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const login = async (payload: LoginPayload) => {
    const result = await api<ApiResponse<{ user: { email: string; full_name: string; role?: string }; access_token: string; refresh_token: string }>>(
      '/auth/login',
      { method: 'POST', body: payload }
    );

    if (result.success) {
      authStore.setTokens({
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token
      });
      authStore.setUser(result.data.user);
    }
    return result;
  };

  const register = async (payload: RegisterPayload) => {
    const result = await api<ApiResponse<{ user: { email: string; full_name: string; role?: string }; access_token: string; refresh_token: string }>>(
      '/auth/register',
      { method: 'POST', body: payload }
    );

    if (result.success) {
      authStore.setTokens({
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token
      });
      authStore.setUser(result.data.user);
    }
    return result;
  };

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } finally {
      authStore.clearToken();
    }
  };

  return { login, register, logout, authStore };
}
