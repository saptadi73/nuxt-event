globalThis.__timing__.logStart('Load chunks/build/usePayment-B2J8chqq');import { c as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/usePayment.ts
function usePayment() {
	const api = useNuxtApp().$api;
	const createMidtransTransaction = (registrationId) => api("/payments/midtrans/create", {
		method: "POST",
		body: { registration_id: registrationId }
	});
	const getOrder = (orderId) => api(`/orders/${orderId}`);
	const getPayment = (paymentId) => api(`/payments/${paymentId}`);
	return {
		createMidtransTransaction,
		getOrder,
		getPayment
	};
}

export { usePayment as u };;globalThis.__timing__.logEnd('Load chunks/build/usePayment-B2J8chqq');
//# sourceMappingURL=usePayment-B2J8chqq.mjs.map
