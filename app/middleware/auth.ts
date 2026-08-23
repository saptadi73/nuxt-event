export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  if (import.meta.client) auth.syncTokensFromCookies();
  else auth.hydrateUserFromToken();

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login');
  }
});
