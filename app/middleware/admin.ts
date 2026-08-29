export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();
  const { locale, setLocale } = useI18n();
  if (import.meta.client) auth.syncTokensFromCookies();
  else auth.hydrateUserFromToken();

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login');
  }

  if (!auth.isAdminOrOrganizer) {
    return navigateTo('/dashboard');
  }

  if (locale.value !== 'en') {
    await setLocale('en');
  }
});
