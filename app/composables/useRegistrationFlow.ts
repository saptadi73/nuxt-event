import type { useApi, ApiResponse } from '~/composables/useApi';

export type PurchaseType = 'delegate' | 'exhibitor';
export type PurchaseStatus = 'not_selected' | 'selected' | 'payment_pending' | 'paid_profile_incomplete' | 'completed';

interface PurchaseTrackingItem {
  status?: string;
  products?: Array<Record<string, unknown>>;
  profile_required?: boolean;
}

interface PurchaseOrder extends Record<string, unknown> {
  id?: string;
  order_id?: string;
  status?: string;
  product_type?: string;
  items?: Array<Record<string, unknown>>;
  payment?: Record<string, unknown> | null;
  latest_payment?: Record<string, unknown> | null;
  payments?: Array<Record<string, unknown>>;
}

export interface RegistrationFlowState {
  registration_status?: string;
  delegate_status?: string;
  exhibitor_status?: string;
  selected_types?: string[];
  purchase_tracking?: Partial<Record<PurchaseType, PurchaseTrackingItem>>;
  orders?: PurchaseOrder[];
  [key: string]: unknown;
}

const normalizeStatus = (item?: PurchaseTrackingItem): PurchaseStatus => {
  const status = item?.status?.toLowerCase();
  if (status === 'selected') return 'selected';
  if (status === 'payment_pending') return 'payment_pending';
  if (status === 'paid_profile_incomplete') return 'paid_profile_incomplete';
  if (status === 'completed') return 'completed';
  if (status === 'paid') return item?.profile_required ? 'paid_profile_incomplete' : 'completed';
  return 'not_selected';
};

export function useRegistrationFlow() {
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;
  const { locale } = useI18n();
  const authStore = useAuthStore();
  const state = useState<RegistrationFlowState | null>('registration-flow-state', () => null);
  const loading = useState('registration-flow-loading', () => false);
  const loaded = useState('registration-flow-loaded', () => false);
  const error = useState('registration-flow-error', () => '');

  const primeFlow = (snapshot: RegistrationFlowState) => {
    state.value = snapshot;
    loaded.value = true;
    error.value = '';
    const snapshotUser = snapshot.user;
    if (snapshotUser && typeof snapshotUser === 'object') {
      authStore.setUser(snapshotUser as Parameters<typeof authStore.setUser>[0]);
      authStore.hydrateUserFromToken();
    }
  };

  const statusFor = (type: PurchaseType): PurchaseStatus => normalizeStatus(state.value?.purchase_tracking?.[type]);
  const delegateStatus = computed(() => statusFor('delegate'));
  const exhibitorStatus = computed(() => statusFor('exhibitor'));
  const selectedTypes = computed<PurchaseType[]>(() => {
    const explicit = (state.value?.selected_types || []).filter((type): type is PurchaseType => type === 'delegate' || type === 'exhibitor');
    const tracked = (['delegate', 'exhibitor'] as PurchaseType[]).filter(type => statusFor(type) !== 'not_selected');
    return [...new Set([...explicit, ...tracked])];
  });

  const primaryType = computed<PurchaseType | null>(() => {
    const priorities: PurchaseStatus[] = ['paid_profile_incomplete', 'payment_pending', 'selected', 'not_selected', 'completed'];
    for (const status of priorities) {
      const type = selectedTypes.value.find(candidate => statusFor(candidate) === status);
      if (type) return type;
    }
    return null;
  });

  const primaryStatus = computed<PurchaseStatus>(() => {
    if (!selectedTypes.value.length) return 'not_selected';
    if (selectedTypes.value.some(type => statusFor(type) === 'paid_profile_incomplete')) return 'paid_profile_incomplete';
    if (selectedTypes.value.some(type => statusFor(type) === 'payment_pending')) return 'payment_pending';
    if (selectedTypes.value.some(type => statusFor(type) === 'selected')) return 'selected';
    if (selectedTypes.value.every(type => statusFor(type) === 'completed')) return 'completed';

    const fallbackType = primaryType.value ?? selectedTypes.value[0];
    return fallbackType ? statusFor(fallbackType) : 'not_selected';
  });

  const profilePendingType = computed<PurchaseType | null>(() => selectedTypes.value.find(type => statusFor(type) === 'paid_profile_incomplete') || null);
  const isPaid = computed(() => selectedTypes.value.some(type => ['paid_profile_incomplete', 'completed'].includes(statusFor(type))));
  const canEnterBusinessMatching = computed(() => selectedTypes.value.length > 0 && selectedTypes.value.every(type => statusFor(type) === 'completed'));

  const orderMatchesType = (order: PurchaseOrder, type: PurchaseType | null) => {
    if (!type) return true;
    if (order.product_type === type) return true;
    const items = Array.isArray(order.items) ? order.items : [];
    if (!items.length) return true;
    return items.some(item => item.product_type === type || (item.product as Record<string, unknown> | undefined)?.product_type === type);
  };

  const activeOrder = computed(() => {
    const orders = Array.isArray(state.value?.orders) ? state.value.orders : [];
    const matching = orders.filter(order => orderMatchesType(order, primaryType.value));
    return matching.find(order => ['pending', 'partially_paid', 'draft', 'payment_pending'].includes(order.status?.toLowerCase() || '')) || matching[0] || null;
  });

  const activeOrderId = computed(() => activeOrder.value?.order_id || activeOrder.value?.id || '');
  const activePaymentId = computed(() => {
    const order = activeOrder.value;
    if (!order) return '';
    const payments = Array.isArray(order.payments) ? order.payments : [];
    const payment = order.latest_payment || order.payment || payments[payments.length - 1];
    return typeof payment?.id === 'string' ? payment.id : typeof payment?.payment_id === 'string' ? payment.payment_id : '';
  });

  const ctaLabel = computed(() => {
    if (!authStore.isAuthenticated) return locale.value === 'zh-CN' ? '立即注册' : 'Register Now!';
    if (authStore.isAdminOrOrganizer) return 'Organizer Dashboard';
    const zh = locale.value === 'zh-CN';
    if (primaryStatus.value === 'not_selected') return zh ? '立即预订席位' : 'Secure your Seat!';
    if (primaryStatus.value === 'selected') return zh ? '继续结账' : 'Continue to Checkout';
    if (primaryStatus.value === 'payment_pending') return zh ? '继续付款' : 'Continue Payment';
    if (primaryStatus.value === 'paid_profile_incomplete') {
      if (zh) return profilePendingType.value === 'exhibitor' ? '完善参展商资料' : '完善代表资料';
      return `Complete ${profilePendingType.value === 'exhibitor' ? 'Exhibitor' : 'Delegate'} Profile`;
    }
    return zh ? '注册已完成' : 'Registration Complete';
  });

  const ctaTo = computed(() => {
    if (!authStore.isAuthenticated) return '/auth/register';
    if (authStore.isAdminOrOrganizer) return '/dashboard';
    if (primaryStatus.value === 'not_selected') return '/register';
    if (primaryStatus.value === 'selected') return '/dashboard/cart';
    if (primaryStatus.value === 'paid_profile_incomplete') return `/register/${profilePendingType.value || 'delegate'}`;
    if (primaryStatus.value === 'completed') return '/dashboard';
    const orderQuery = activeOrderId.value ? `order_id=${encodeURIComponent(activeOrderId.value)}` : '';
    const paymentQuery = activePaymentId.value ? `payment_id=${encodeURIComponent(activePaymentId.value)}` : '';
    if (activePaymentId.value) return `/dashboard/payment-status?${[orderQuery, paymentQuery].filter(Boolean).join('&')}`;
    return activeOrderId.value ? `/dashboard/payment?${orderQuery}` : '/dashboard/cart';
  });

  const loadFlow = async (force = false) => {
    if (!authStore.isAuthenticated) {
      state.value = null;
      loaded.value = true;
      return null;
    }
    if (loaded.value && !force) return state.value;
    if (loading.value) return state.value;
    loading.value = true;
    error.value = '';
    try {
      const me = await api<ApiResponse<Record<string, unknown>>>('/auth/me');
      const meData = me.data as Record<string, unknown>;
      const user = (meData.user || meData) as Record<string, unknown>;
      authStore.setUser(user as Parameters<typeof authStore.setUser>[0]);
      authStore.hydrateUserFromToken();
      const userId = typeof user.id === 'string' ? user.id : '';
      if (!userId) throw new Error(locale.value === 'zh-CN' ? '后端未返回用户 ID。' : 'User ID was not returned by the backend.');
      const detail = await api<ApiResponse<RegistrationFlowState>>(`/auth/users/${encodeURIComponent(userId)}`);
      state.value = detail.data;
      const detailUser = detail.data.user;
      if (detailUser && typeof detailUser === 'object') {
        authStore.setUser(detailUser as Parameters<typeof authStore.setUser>[0]);
        authStore.hydrateUserFromToken();
      }
      loaded.value = true;
      return state.value;
    } catch (cause) {
      const value = cause as { data?: { message?: string } };
      error.value = value.data?.message || (cause instanceof Error
        ? cause.message
        : locale.value === 'zh-CN' ? '无法加载注册进度。' : 'Registration progress could not be loaded.');
      throw cause;
    } finally {
      loading.value = false;
    }
  };

  return { state, loading, loaded, error, primeFlow, loadFlow, statusFor, delegateStatus, exhibitorStatus, selectedTypes, primaryType, primaryStatus, activeOrderId, activePaymentId, isPaid, profilePendingType, canEnterBusinessMatching, ctaLabel, ctaTo };
}
