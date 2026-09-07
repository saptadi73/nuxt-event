export default defineNuxtRouteMiddleware(async (to) => {
  // Offline registration is an explicit, separate organizer-assisted flow.
  if (to.query.payment === 'offline') return;
  const auth = useAuthStore();
  if (!auth.isAuthenticated || auth.isAdminOrOrganizer) return;
  const flow = useRegistrationFlow();
  try {
    await flow.loadFlow(true);
  } catch {
    return navigateTo('/dashboard/registration-status');
  }
  const type = to.path.endsWith('/exhibitor') ? 'exhibitor' : 'delegate';
  const status = flow.statusFor(type);
  if (status === 'payment_pending') return navigateTo(flow.ctaTo.value);
  if (status === 'selected') return navigateTo('/dashboard/cart');
  if (status === 'not_selected') return navigateTo(`/tickets?type=${type}`);
});
