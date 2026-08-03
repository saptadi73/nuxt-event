globalThis.__timing__.logStart('Load chunks/build/usePayment-s4-2mR-w');import { c as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/usePayment.ts
function usePayment() {
	const api = useNuxtApp().$api;
	const createMidtransTransaction = () => api("/payments/midtrans/create", { method: "POST" });
	const getOrder = (orderId) => api(`/orders/${orderId}`);
	const getPayment = (paymentId) => api(`/payments/${paymentId}`);
	const getMyInvoices = () => api("/payments/me/invoices");
	const getInvoiceByRegistration = (registrationId) => api(`/payments/registrations/${registrationId}/invoice`);
	return {
		createMidtransTransaction,
		getOrder,
		getPayment,
		getMyInvoices,
		getInvoiceByRegistration
	};
}

export { usePayment as u };;globalThis.__timing__.logEnd('Load chunks/build/usePayment-s4-2mR-w');
//# sourceMappingURL=usePayment-s4-2mR-w.mjs.map
