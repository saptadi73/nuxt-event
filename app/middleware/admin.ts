export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();
  const i18n = useNuxtApp().$i18n as { locale: string | { value: string }; setLocale: (locale: string) => Promise<void> };
  if (import.meta.client) auth.syncTokensFromCookies();
  else auth.hydrateUserFromToken();

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login');
  }

  if (!auth.isAdminOrOrganizer) {
    return navigateTo('/dashboard');
  }

  const locale = typeof i18n.locale === 'string' ? i18n.locale : i18n.locale.value;
  if (locale !== 'en') {
    await i18n.setLocale('en');
  }
});
