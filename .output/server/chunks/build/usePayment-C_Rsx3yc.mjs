import { f as useNuxtApp, i as useRuntimeConfig } from '../virtual/entry.mjs';

var PAYMENT_PROVIDER_LABELS = {
	doku: "DOKU",
	midtrans: "MIDTRANS"
};
var normalizePaymentProvider = (value) => {
	return (value ?? "doku").toLowerCase() === "midtrans" ? "midtrans" : "doku";
};
var getPaymentProviderConfig = (providerOverride) => {
	const config = useRuntimeConfig();
	const provider = normalizePaymentProvider(config.public.paymentProvider);
	return {
		provider,
		label: PAYMENT_PROVIDER_LABELS[provider],
		isDoku: provider === "doku",
		isMidtrans: provider === "midtrans",
		checkoutPath: provider === "midtrans" ? "/payments/midtrans/checkout" : "/payments/doku/checkout"
	};
};
//#endregion
//#region app/composables/usePayment.ts
function usePayment() {
	const api = useNuxtApp().$api;
	const runtimeProvider = getPaymentProviderConfig();
	const getPaymentMethods = () => api("/payments/methods");
	const getDirectPaymentMethods = () => api("/payments/doku/direct/methods");
	const createDirectVa = (registrationId, bankCode) => api("/payments/doku/direct/va", {
		method: "POST",
		body: {
			registration_id: registrationId,
			bank_code: bankCode
		}
	});
	const createDirectQris = (registrationId) => api("/payments/doku/direct/qris", {
		method: "POST",
		body: { registration_id: registrationId }
	});
	const createDirectDebitBinding = (registrationId, channelCode, phoneNo, deviceId) => api("/payments/doku/snap/direct-debit/bindings", {
		method: "POST",
		body: {
			registration_id: registrationId,
			channel_code: channelCode,
			phone_no: phoneNo,
			...deviceId ? { device_id: deviceId } : {}
		}
	});
	const createDirectDebitPayment = (registrationId, bindingId) => api("/payments/doku/snap/direct-debit/payment", {
		method: "POST",
		body: {
			registration_id: registrationId,
			binding_id: bindingId
		}
	});
	const submitDirectDebitOtp = (paymentId, bindingId, otp) => api(`/payments/doku/snap/direct-debit/payment/${encodeURIComponent(paymentId)}/otp`, {
		method: "POST",
		body: {
			binding_id: bindingId,
			otp
		}
	});
	const createDokuCheckout = (orderId) => api("/payments/doku/checkout", {
		method: "POST",
		body: { order_id: orderId }
	});
	const createMidtransCheckout = (orderId) => api("/payments/midtrans/checkout", {
		method: "POST",
		body: { order_id: orderId }
	});
	const createCheckout = (orderId) => {
		if (runtimeProvider.isMidtrans) return createMidtransCheckout(orderId);
		return createDokuCheckout(orderId);
	};
	const getOrder = (orderId) => api(`/orders/${orderId}`);
	const getPayment = (paymentId) => api(`/payments/${paymentId}`);
	const getMyInvoices = () => api("/payments/me/invoices");
	const getInvoiceByRegistration = (registrationId) => api(`/payments/registrations/${encodeURIComponent(registrationId)}/invoice`);
	return {
		paymentProvider: runtimeProvider.provider,
		paymentProviderLabel: runtimeProvider.label,
		isMidtransProvider: runtimeProvider.isMidtrans,
		isDokuProvider: runtimeProvider.isDoku,
		getPaymentMethods,
		getDirectPaymentMethods,
		createDirectVa,
		createDirectQris,
		createDirectDebitBinding,
		createDirectDebitPayment,
		submitDirectDebitOtp,
		createDokuCheckout,
		createMidtransCheckout,
		createCheckout,
		getOrder,
		getPayment,
		getMyInvoices,
		getInvoiceByRegistration,
		normalizePaymentProvider
	};
}

export { usePayment as u };
//# sourceMappingURL=usePayment-C_Rsx3yc.mjs.map
