globalThis.__timing__.logStart('Load chunks/build/usePayment-Bc46Nipp');import { e as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/usePayment.ts
function usePayment() {
	const api = useNuxtApp().$api;
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
	const createDokuCheckout = (registrationId) => api("/payments/doku/checkout", {
		method: "POST",
		body: { registration_id: registrationId }
	});
	const getOrder = (orderId) => api(`/orders/${orderId}`);
	const getPayment = (paymentId) => api(`/payments/${paymentId}`);
	const getMyInvoices = () => api("/payments/me/invoices");
	const getInvoiceByRegistration = (registrationId) => api(`/payments/registrations/${encodeURIComponent(registrationId)}/invoice`);
	return {
		getPaymentMethods,
		getDirectPaymentMethods,
		createDirectVa,
		createDirectQris,
		createDirectDebitBinding,
		createDirectDebitPayment,
		submitDirectDebitOtp,
		createDokuCheckout,
		getOrder,
		getPayment,
		getMyInvoices,
		getInvoiceByRegistration
	};
}

export { usePayment as u };;globalThis.__timing__.logEnd('Load chunks/build/usePayment-Bc46Nipp');
//# sourceMappingURL=usePayment-Bc46Nipp.mjs.map
