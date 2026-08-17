export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  auth.hydrateUserFromToken();

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login');
  }
});
