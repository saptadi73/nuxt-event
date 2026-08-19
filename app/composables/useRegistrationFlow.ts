import { useApi, type ApiResponse } from '~/composables/useApi';

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
  const authStore = useAuthStore();
  const state = useState<RegistrationFlowState | null>('registration-flow-state', () => null);
  const loading = useState('registration-flow-loading', () => false);
  const loaded = useState('registration-flow-loaded', () => false);
  const error = useState('registration-flow-error', () => '');

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
    return statusFor(primaryType.value || selectedTypes.value[0]);
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
    return matching.find(order => ['pending', 'draft', 'payment_pending'].includes(order.status?.toLowerCase() || '')) || matching[0] || null;
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
    if (!authStore.isAuthenticated) return 'Register Now!';
    if (primaryStatus.value === 'not_selected') return 'Secure your Seat!';
    if (primaryStatus.value === 'selected') return 'Continue to Checkout';
    if (primaryStatus.value === 'payment_pending') return 'Continue Payment';
    if (primaryStatus.value === 'paid_profile_incomplete') return `Complete ${profilePendingType.value === 'exhibitor' ? 'Exhibitor' : 'Delegate'} Profile`;
    return 'Registration Complete';
  });

  const ctaTo = computed(() => {
    if (!authStore.isAuthenticated) return '/auth/register';
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
      const userId = typeof user.id === 'string' ? user.id : '';
      if (!userId) throw new Error('User ID was not returned by the backend.');
      const detail = await api<ApiResponse<RegistrationFlowState>>(`/auth/users/${encodeURIComponent(userId)}`);
      state.value = detail.data;
      loaded.value = true;
      return state.value;
    } catch (cause) {
      const value = cause as { data?: { message?: string } };
      error.value = value.data?.message || (cause instanceof Error ? cause.message : 'Registration progress could not be loaded.');
      throw cause;
    } finally {
      loading.value = false;
    }
  };

  return { state, loading, loaded, error, loadFlow, statusFor, delegateStatus, exhibitorStatus, selectedTypes, primaryType, primaryStatus, activeOrderId, activePaymentId, isPaid, profilePendingType, canEnterBusinessMatching, ctaLabel, ctaTo };
}
