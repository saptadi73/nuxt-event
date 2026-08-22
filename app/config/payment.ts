export type PaymentProvider = 'doku' | 'midtrans';

export const DEFAULT_PAYMENT_PROVIDER: PaymentProvider = 'doku';

export const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  doku: 'DOKU',
  midtrans: 'MIDTRANS'
};

export const normalizePaymentProvider = (value?: string | null): PaymentProvider => {
  const normalized = (value ?? DEFAULT_PAYMENT_PROVIDER).toLowerCase();
  return normalized === 'midtrans' ? 'midtrans' : 'doku';
};

export const getPaymentProviderConfig = (providerOverride?: string | null) => {
  const config = useRuntimeConfig();
  const provider = normalizePaymentProvider(providerOverride ?? config.public.paymentProvider);

  return {
    provider,
    label: PAYMENT_PROVIDER_LABELS[provider],
    isDoku: provider === 'doku',
    isMidtrans: provider === 'midtrans',
    checkoutPath: provider === 'midtrans' ? '/payments/midtrans/checkout' : '/payments/doku/checkout'
  };
};
