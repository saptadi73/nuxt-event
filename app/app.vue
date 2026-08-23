<template>
  <div class="site-shell min-h-screen text-white">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <header class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div class="mx-auto flex w-full max-w-[1440px] items-center gap-2 px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="brand-block flex min-w-0 shrink-0 items-center gap-3">
          <span class="brand-mark flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-300/40 bg-white/10 p-1.5 shadow-lg shadow-cyan-950/20 sm:h-14 sm:w-14">
            <img v-if="!logoHasError" :src="logoSrc" alt="IWBIF 2026" width="56" height="56" class="h-full w-full object-contain" @error="logoHasError = true" />
            <span v-else class="brand-fallback text-sm font-black">IWBIF</span>
          </span>
          <span class="hidden sm:block">
            <span class="brand-kicker block whitespace-nowrap text-[10px] uppercase tracking-[0.35em] text-amber-200/75">IWAPI presents</span>
            <span class="brand-name block whitespace-nowrap text-base font-semibold tracking-[0.08em] text-white">IWBIF 2026</span>
          </span>
        </NuxtLink>

      <nav class="hidden items-center gap-1 text-sm text-slate-300 xl:ml-auto xl:flex">
        <NuxtLink v-for="item in primaryNav" :key="item.to" :to="item.to" :class="item.disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'hover:bg-white/5 hover:text-white'" class="nav-link inline-flex items-center whitespace-nowrap rounded-full px-3 py-2 uppercase tracking-[0.12em] text-[11px] leading-none" @click="item.disabled ? $event.preventDefault() : closeMenus()">
          {{ item.label }}
        </NuxtLink>
          <details ref="desktopMenuRef" class="group relative" :open="desktopMenuOpen" @toggle="desktopMenuOpen = ($event.target as HTMLDetailsElement).open">
            <summary class="nav-link inline-flex cursor-pointer list-none items-center whitespace-nowrap rounded-full px-3 py-2 uppercase tracking-[0.12em] text-[11px] leading-none text-slate-200 transition hover:bg-white/5 hover:text-white">More <span class="ml-1 text-[10px] text-amber-200/80">v</span></summary>
            <div class="nav-menu-panel absolute right-0 top-12 grid w-48 gap-1 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
              <NuxtLink v-for="item in secondaryNav" :key="item.to" :to="item.to" class="rounded-xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white" @click="closeMenus">{{ item.label }}</NuxtLink>
            </div>
          </details>
        </nav>

        <div class="header-actions ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 xl:ml-2">
          <div v-if="isAuthenticated" class="relative">
            <button
              type="button"
              class="inbox-trigger header-cta relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 p-0 text-amber-100"
              :title="`Inbox${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`"
              @click="showInbox = !showInbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 5.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5.5L12 12Z"></path>
                <path d="M22 5.5 12 12 2 5.5"></path>
                <path d="M6.5 10.5V11l.2.2L12 14l5.3-2.8V10.5"></path>
              </svg>
              <span v-if="unreadCount > 0" class="inbox-badge">
                {{ unreadBadgeText }}
              </span>
            </button>
            <div v-if="showInbox" ref="inboxPanelRef" class="inbox-panel absolute right-0 top-12 z-50 w-[min(22rem,85vw)]">
              <div class="rounded-2xl border border-white/15 bg-slate-950/95 p-4 text-sm shadow-2xl backdrop-blur-xl">
                <div class="mb-3 flex items-center justify-between gap-3">
                  <p class="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Inbox</p>
                  <div class="flex items-center gap-2">
                    <button class="rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-200 hover:bg-white/5" type="button" @click="handleRefreshInbox">
                      Refresh
                    </button>
                    <button v-if="inboxUnreadCount > 0" class="rounded-full border border-emerald-300/35 px-3 py-1 text-[11px] text-emerald-100 hover:bg-emerald-300/10" type="button" @click="handleMarkAllRead">
                      Tandai semua dibaca
                    </button>
                  </div>
                </div>
                <div class="mb-3 rounded-xl border border-amber-200/20 bg-amber-100/5 px-3 py-2 text-xs text-amber-100">
                  <p class="text-[10px] uppercase tracking-[0.12em] text-amber-200">Akun aktif</p>
                  <p class="mt-1 text-sm font-semibold text-white">{{ activeAccountName }}</p>
                  <p class="text-[11px] text-slate-300">{{ activeAccountEmail }}</p>
                </div>
                <p v-if="inboxError" class="mb-2 rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">{{ inboxError }}</p>
                <div v-if="inboxLoading" class="rounded-lg border border-white/10 px-3 py-4 text-slate-400">Memuat inbox...</div>
                <p v-else-if="!inboxNotifications.length" class="rounded-lg border border-white/10 px-3 py-4 text-slate-400">Tidak ada notifikasi.</p>
                <div v-else class="space-y-2">
                  <button
                    v-for="item in inboxNotifications"
                    :key="item.id"
                    type="button"
                    class="w-full rounded-xl border border-white/10 px-3 py-2 text-left transition hover:bg-white/5"
                    :class="item.is_read ? 'bg-white/5 text-slate-300' : 'bg-emerald-300/10 text-white'"
                    @click="handleNotificationAction(item)"
                  >
                    <div class="mb-1 flex items-center justify-between gap-2">
                      <p class="text-xs font-semibold text-amber-100">{{ item.title || 'Notification' }}</p>
                      <span
                        v-if="notificationBadge(item)"
                        class="inline-flex rounded-full bg-amber-400/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-100"
                      >
                        {{ notificationBadge(item) }}
                      </span>
                    </div>
                    <p v-if="item.entity_type || item.entity_id" class="text-[10px] uppercase tracking-[0.15em] text-amber-200/80">
                      {{ item.entity_type || 'entity' }} {{ item.entity_id ? `#${item.entity_id}` : '' }}
                    </p>
                    <p class="mt-1 text-xs text-slate-200">{{ item.message || item.body || '-' }}</p>
                    <p v-if="item.created_at" class="mt-2 text-[11px] text-slate-400">{{ formatDateTime(item.created_at) }}</p>
                    <span v-if="!item.is_read" class="mt-1 inline-flex rounded-full bg-emerald-300/25 px-2 py-1 text-[10px] font-bold text-emerald-100">
                      Unread
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <NuxtLink v-if="!isAuthenticated" to="/auth/register" class="header-cta hidden whitespace-nowrap rounded-full border border-amber-300/35 bg-gradient-to-r from-amber-300/15 via-amber-200/8 to-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100 shadow-[0_16px_40px_rgba(216,172,89,0.16)] transition hover:border-amber-200/70 hover:brightness-110 sm:inline-flex">
            Register Now!
          </NuxtLink>
          <NuxtLink v-if="!isAuthenticated" to="/auth/register" class="header-cta inline-flex whitespace-nowrap rounded-full bg-gradient-to-r from-amber-300 to-amber-200 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 sm:hidden">
            Register
          </NuxtLink>
          <NuxtLink v-if="isAuthenticated && !isRegistrationPaid" :to="paymentCtaTo" class="header-cta whitespace-nowrap rounded-full bg-gradient-to-r from-amber-300 to-amber-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 sm:px-5">
            {{ ctaLabel }}
          </NuxtLink>
          <span v-if="isAuthenticated && isRegistrationPaid" class="header-cta whitespace-nowrap rounded-full bg-gradient-to-r from-amber-300 to-amber-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-lg shadow-amber-500/20 opacity-90">
            {{ ctaLabel }}
          </span>
          <button v-if="isAuthenticated" type="button" class="header-cta whitespace-nowrap rounded-full bg-gradient-to-r from-amber-300 to-amber-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 sm:px-5" @click="handleLogout">
            Log Out
          </button>
          <NuxtLink v-else to="/auth/login" class="header-signin whitespace-nowrap rounded-full border border-cyan-300/30 bg-cyan-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_12px_30px_rgba(34,211,238,0.12)] transition hover:border-cyan-200/60 hover:bg-cyan-300/10 sm:px-5">
            Sign In
          </NuxtLink>
          <details ref="mobileMenuRef" class="relative xl:hidden" :open="mobileMenuOpen" @toggle="mobileMenuOpen = ($event.target as HTMLDetailsElement).open">
            <summary aria-label="Open navigation menu" class="menu-button flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold uppercase tracking-[0.12em] text-slate-100 shadow-lg shadow-slate-950/50 transition hover:border-cyan-300/40 hover:bg-white/10">Menu</summary>
            <nav class="nav-menu-panel absolute right-0 top-12 grid w-[min(80vw,18rem)] gap-1 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
              <NuxtLink v-for="item in allNav" :key="item.to" :to="item.to" :class="item.disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'hover:bg-white/5 hover:text-white'" class="rounded-xl px-4 py-3 text-sm text-slate-200 transition" @click="item.disabled ? $event.preventDefault() : closeMenus()">{{ item.label }}</NuxtLink>
            </nav>
          </details>
        </div>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="relative z-10 border-t border-white/10 bg-slate-950/60">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1fr_1.35fr] lg:px-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-amber-200">IWBIF 2026</p>
          <p class="mt-3 max-w-sm text-sm leading-7 text-slate-400">Connecting women-led businesses with global markets, finance, and trusted partnerships.</p>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm text-slate-300">
          <NuxtLink to="/about">About</NuxtLink><NuxtLink to="/program">Program</NuxtLink>
          <NuxtLink to="/speakers">Speakers</NuxtLink><NuxtLink to="/business-matching">Business Matching</NuxtLink>
          <NuxtLink to="/partners">Partners</NuxtLink><NuxtLink to="/faq">FAQ</NuxtLink>
        </div>
        <div class="text-sm text-slate-400 md:text-right">
          <p class="md:whitespace-nowrap">International Women Business &amp; Investment Forum</p>
          <p class="mt-1">14–17 October 2026 · Jakarta</p>
          <div class="mt-3 flex flex-wrap gap-4 md:justify-end"><NuxtLink to="/privacy">Privacy</NuxtLink><NuxtLink to="/terms">Terms</NuxtLink><NuxtLink to="/code-of-conduct">Code of Conduct</NuxtLink><NuxtLink to="/refund-policy">Refunds</NuxtLink></div>
        </div>
      </div>
      <p class="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500">© 2026 International Women Business &amp; Investment Forum. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import logoSrc from '~/assets/images/logo_iwbif2.png';
import { useCommunication } from '~/composables/useCommunication';
const logoHasError = ref(false);

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const { logout } = useAuth();
const registrationFlow = useRegistrationFlow();
const { ctaLabel, ctaTo, isPaid: isRegistrationPaid } = registrationFlow;
const paymentCtaTo = ctaTo;
const route = useRoute();
const routeEventId = computed(() => {
  const queryEventId = route.query.event_id;
  if (typeof queryEventId === 'string') return queryEventId.trim();
  if (Array.isArray(queryEventId)) return queryEventId[0] ?? '';
  return '';
});
const activeEventIdForInbox = computed(() => {
  if (routeEventId.value) return routeEventId.value;

  const orders = Array.isArray(registrationFlow.state.value?.orders) ? registrationFlow.state.value?.orders : [];
  const activeOrder = orders.find((order) => {
    const eventId = (order as { event_id?: string })?.event_id;
    return typeof eventId === 'string' && eventId.trim().length > 0;
  });
  if (!activeOrder) return '';

  return (activeOrder as { event_id?: string }).event_id || '';
});

const desktopMenuRef = ref<HTMLElement | null>(null);
const mobileMenuRef = ref<HTMLElement | null>(null);
const communication = useCommunication();
const showInbox = ref(false);
const inboxPanelRef = ref<HTMLElement | null>(null);
const inboxLoading = ref(false);
const inboxError = ref<string>('');
type InboxNotification = {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  type?: string;
  entity_type?: string;
  entity_id?: string;
  is_read?: boolean;
  created_at?: string;
};

const inboxNotifications = ref<Array<InboxNotification>>([]);
const inboxUnreadCount = ref(0);
const inboxPoller = ref<ReturnType<typeof setInterval> | null>(null);
const unreadBadgeText = computed(() => (inboxUnreadCount.value > 9 ? '9+' : String(inboxUnreadCount.value)));
const unreadCount = computed(() => inboxUnreadCount.value);
const activeAccountName = computed(() => authStore.user?.full_name || authStore.user?.name || 'Unknown user');
const activeAccountEmail = computed(() => authStore.user?.email || 'Unknown email');

const formatDateTime = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsed);
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;

  const clickedInsideDesktop = desktopMenuRef.value && desktopMenuRef.value.contains(target);
  const clickedInsideMobile = mobileMenuRef.value && mobileMenuRef.value.contains(target);
  const clickedInsideInbox = inboxPanelRef.value && inboxPanelRef.value.contains(target);
  const clickedInboxTrigger = (target instanceof HTMLElement && target.closest('.inbox-trigger')) || false;

  if (!clickedInsideDesktop && !clickedInsideMobile && !clickedInsideInbox && !clickedInboxTrigger) {
    closeMenus();
    showInbox.value = false;
  }

  if (showInbox.value && !clickedInsideInbox && !clickedInboxTrigger) {
    showInbox.value = false;
  }
};

const loadInboxNotifications = async () => {
  if (!isAuthenticated.value) return;
  inboxLoading.value = true;
  inboxError.value = '';
  const isAdminInbox = authStore.isAdminOrOrganizer;
  const eventId = activeEventIdForInbox.value;
  try {
    const notificationsRequest = (isAdminInbox && eventId)
      ? communication.getAdminNotifications(eventId)
      : communication.getNotifications();
    const unreadRequest = communication.getInboxUnreadCount(eventId || undefined);
    const [notificationsResponse, unreadResponse] = await Promise.all([notificationsRequest, unreadRequest]);

    if (notificationsResponse.error) throw new Error(notificationsResponse.error);
    if (unreadResponse.error) throw new Error(unreadResponse.error);

    inboxNotifications.value = notificationsResponse.value?.data ?? [];
    inboxUnreadCount.value = unreadResponse.value?.data?.unread_count ?? 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load inbox';
    inboxError.value = message;
    inboxNotifications.value = [];
    inboxUnreadCount.value = 0;
  } finally {
    inboxLoading.value = false;
  }
};

const refreshUnreadOnly = async () => {
  if (!isAuthenticated.value) return;
  const eventId = activeEventIdForInbox.value;
  try {
    const unreadResponse = await communication.getInboxUnreadCount(eventId || undefined);
    if (unreadResponse.error) return;
    inboxUnreadCount.value = unreadResponse.value?.data?.unread_count ?? 0;
  } catch {
    // silent
  }
};

const handleRefreshInbox = async () => {
  await loadInboxNotifications();
};

const handleMarkRead = async (notification: InboxNotification) => {
  try {
    const isAdminInbox = authStore.isAdminOrOrganizer;
    const eventId = activeEventIdForInbox.value;
    const response = isAdminInbox && eventId
      ? await communication.markAdminNotificationRead(notification.id, eventId)
      : await communication.markNotificationRead(notification.id);
    if (response.error) throw new Error(response.error);
    await loadInboxNotifications();
  } catch {
    inboxError.value = 'Unable to mark notification as read';
  }
};

const resolveNotificationRoute = (notification: InboxNotification) => {
  const entityType = (notification.entity_type || '').toLowerCase();
  const id = notification.entity_id || '';
  if (!id) return '';

  switch (entityType) {
    case 'order':
      return `/dashboard/payment?order_id=${encodeURIComponent(id)}`;
    case 'payment':
      return `/dashboard/payment-status?payment_id=${encodeURIComponent(id)}`;
    case 'invoice':
      return `/dashboard/invoice?order_id=${encodeURIComponent(id)}`;
    case 'conversation':
    case 'message':
      return `/business-matching`;
    case 'conversation_id':
      return '/business-matching';
    case 'admin_order':
    case 'manual_payment':
    case 'manual_payment_confirmation':
      return `/admin/manual-payments?order_id=${encodeURIComponent(id)}`;
    case 'new_message':
    case 'meeting_request':
    case 'meeting_requested':
    case 'meeting_accepted':
    case 'meeting_declined':
    case 'meeting_confirmed':
    case 'meeting_reschedule':
    case 'meeting_cancelled':
    case 'meeting_reschedule_requested':
      return '/business-matching';
    case 'payment_status_update':
      return '/admin/reports';
    default:
      return '/dashboard';
  }
};

const notificationBadge = (notification: InboxNotification) => {
  switch ((notification.type || '').toLowerCase()) {
    case 'payment_status_update':
      return 'Payment';
  }

  const entityType = (notification.entity_type || '').toLowerCase();
  switch (entityType) {
    case 'meeting_request':
    case 'meeting_requested':
    case 'meeting_accepted':
    case 'meeting_declined':
    case 'meeting_confirmed':
    case 'meeting_reschedule':
    case 'meeting_reschedule_requested':
    case 'meeting_cancelled':
    case 'new_message':
      return 'Meeting';
    case 'manual_payment':
    case 'manual_payment_confirmation':
    case 'admin_order':
      return 'Manual Payment';
    default:
      return '';
  }
};

const handleNotificationAction = async (notification: InboxNotification) => {
  const targetRoute = resolveNotificationRoute(notification);
  await handleMarkRead(notification);
  if (!targetRoute) return;

  showInbox.value = false;
  await navigateTo(targetRoute);
};

const handleMarkAllRead = async () => {
  try {
    const isAdminInbox = authStore.isAdminOrOrganizer;
    const eventId = activeEventIdForInbox.value;
    const response = isAdminInbox && eventId
      ? await communication.markAllAdminNotificationsRead(eventId)
      : await communication.markAllNotificationsRead();
    if (response.error) throw new Error(response.error);
    await loadInboxNotifications();
  } catch {
    inboxError.value = 'Unable to mark all notifications as read';
  }
};

const refreshRegistrationFlow = async () => {
  if (!isAuthenticated.value) return;
  try {
    await registrationFlow.loadFlow(true);
  } catch {
    // A temporary progress request failure must not break navigation or authentication.
  }
};

const handleWindowFocus = () => { void refreshRegistrationFlow(); };
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') void refreshRegistrationFlow();
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleWindowFocus);

  void refreshRegistrationFlow();
  if (isAuthenticated.value) {
    void loadInboxNotifications();
    inboxPoller.value = window.setInterval(() => {
      void refreshUnreadOnly();
    }, 60000);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('focus', handleWindowFocus);
  if (inboxPoller.value) clearInterval(inboxPoller.value);
});

watch(isAuthenticated, (value) => {
  if (!value) {
    showInbox.value = false;
    inboxNotifications.value = [];
    inboxUnreadCount.value = 0;
    if (inboxPoller.value) {
      clearInterval(inboxPoller.value);
      inboxPoller.value = null;
    }
    return;
  }
  void refreshRegistrationFlow();
  void loadInboxNotifications();
  if (inboxPoller.value) clearInterval(inboxPoller.value);
  inboxPoller.value = window.setInterval(() => {
    void refreshUnreadOnly();
  }, 60000);
});

watch(showInbox, (open) => {
  if (!open || !isAuthenticated.value) return;
  void loadInboxNotifications();
});

watch(activeEventIdForInbox, (eventId, previousEventId) => {
  if (!isAuthenticated.value) return;
  if (eventId && eventId !== previousEventId) {
    void loadInboxNotifications();
  }
});

const handleLogout = async () => {
  await logout();
  await navigateTo('/');
};

const desktopMenuOpen = ref(false);
const mobileMenuOpen = ref(false);

const closeMenus = () => {
  desktopMenuOpen.value = false;
  mobileMenuOpen.value = false;
};

const hasDelegatePackageSelected = computed(() => {
  if (!isAuthenticated.value) return false;
  return ['selected', 'payment_pending', 'paid_profile_incomplete', 'completed'].includes(registrationFlow.delegateStatus.value);
});

type NavItem = { to: string; label: string; disabled?: boolean };

const primaryNav = computed<NavItem[]>(() => [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/program', label: 'Program' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/tickets', label: 'Delegate Packages', disabled: hasDelegatePackageSelected.value }
]);
const secondaryNav = computed<NavItem[]>(() => {
  const items: NavItem[] = [
    { to: '/business-matching', label: 'Business Matching' },
    { to: '/exhibition', label: 'Exhibition' },
    { to: '/deal-room', label: 'Deal Room' },
    { to: '/participants', label: 'Participants' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
    { to: '/dashboard', label: 'Dashboard' }
  ];

  if (authStore.isAdminOrOrganizer) {
    items.push({ to: '/admin/packages', label: 'Manage Packages' });
    items.push({ to: '/admin/manual-payments', label: 'Manual Payments' });
    items.push({ to: '/admin/reports', label: 'Sales Report' });
    items.push({ to: '/admin/speakers', label: 'Manage Speakers' });
    items.push({ to: '/admin/program', label: 'Manage Program' });
    items.push({ to: '/admin/users', label: 'Manage Users' });
    items.push({ to: '/admin/announcements', label: 'Announcements' });
    items.push({ to: '/admin/certificates', label: 'Certificates' });
    items.push({ to: '/admin/email-notifications', label: 'Email Notifications' });
  }

  return items;
});
const allNav = computed(() => [...primaryNav.value, ...secondaryNav.value]);
</script>

<style scoped>
.brand-block {
  transition: transform 180ms ease;
}

.brand-mark img {
  transform: scale(1.04);
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.brand-mark {
  width: 3rem;
  height: 3rem;
}

@media (min-width: 640px) {
  .brand-mark {
    width: 3.5rem;
    height: 3.5rem;
  }
}

.brand-fallback {
  line-height: 1;
  color: #fef08a;
  font-size: 0.65rem;
  font-size: clamp(0.62rem, 1.8vw, 0.75rem);
}

.brand-block:hover {
  transform: translateY(-1px);
}

.brand-kicker,
.brand-name,
.nav-link,
.header-cta,
.header-signin,
.menu-button {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.brand-kicker {
  text-shadow: 0 0 18px rgba(216, 172, 89, 0.18);
}

.brand-name {
  letter-spacing: 0.08em;
}

.inbox-trigger {
  position: relative;
}

.inbox-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  display: inline-flex;
  min-width: 1.2rem;
  height: 1.2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding-inline: 0.32rem;
  font-size: 0.64rem;
  font-weight: 700;
  line-height: 1;
  color: #042f2e;
  background: #34d399;
  border: 1px solid rgba(4, 47, 46, 0.8);
}

.inbox-panel {
  position: absolute;
  z-index: 50;
  right: 0;
  width: min(22rem, calc(100vw - 1rem));
  max-width: 22rem;
}

.nav-link {
  letter-spacing: 0.12em;
  font-size: 11px;
  line-height: 1;
  transition: background 180ms ease, color 180ms ease, transform 180ms ease;
}

.nav-link:hover,
.header-cta:hover,
.header-signin:hover,
.menu-button:hover {
  transform: translateY(-1px);
}

summary.nav-link,
.nav-link {
  display: inline-flex;
  align-items: center;
}

.header-actions {
  min-width: 0;
  max-width: 100%;
}

.header-cta,
.header-signin,
.menu-button {
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, filter 180ms ease;
}

.nav-menu-panel {
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 24px 70px rgba(2, 10, 24, 0.55);
}

summary::-webkit-details-marker {
  display: none;
}

@media (max-width: 639px) {
  .brand-block .brand-mark {
    width: 2rem;
    height: 2rem;
  }

  .brand-kicker,
  .brand-name {
    display: none;
  }

  .header-actions {
    gap: 0.4rem;
    max-width: 100%;
    flex-shrink: 0;
  }

  .header-cta,
  .header-signin {
    padding-inline: 0.6rem;
    letter-spacing: 0.08em;
    font-size: 0.58rem;
  }

  .header-cta {
    max-width: 100%;
    white-space: nowrap;
  }

  .header-signin {
    padding-inline: 0.7rem;
  }

  .inbox-trigger {
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
  }

  .inbox-panel {
    right: -0.25rem;
    width: min(20rem, calc(100vw - 0.75rem));
  }

  .menu-button {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    font-size: 0.54rem;
  }
}
</style>
