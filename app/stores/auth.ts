export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: useCookie<string>('access_token', { default: () => '' }).value,
    refreshToken: useCookie<string>('refresh_token', { default: () => '' }).value,
    user: null as { email: string; full_name: string; role?: string } | null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken)
  },
  actions: {
    setTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      useCookie<string>('access_token').value = accessToken;
      useCookie<string>('refresh_token').value = refreshToken;
    },
    setUser(user: { email: string; full_name: string; role?: string } | null) {
      this.user = user;
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
