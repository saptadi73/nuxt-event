export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
    refreshToken: '',
    user: null as { email: string; full_name: string; role?: string } | null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken)
  },
  actions: {
    setTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    },
    setUser(user: { email: string; full_name: string; role?: string } | null) {
      this.user = user;
    },
    clearToken() {
      this.accessToken = '';
      this.refreshToken = '';
      this.user = null;
    }
  }
});
