import { c as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/usePayment.ts
function usePayment() {
	const api = useNuxtApp().$api;
	const createDokuCheckout = (registrationId) => api("/payments/doku/checkout", {
		method: "POST",
		body: { registration_id: registrationId }
	});
	const getOrder = (orderId) => api(`/orders/${orderId}`);
	const getPayment = (paymentId) => api(`/payments/${paymentId}`);
	const getMyInvoices = () => api("/payments/me/invoices");
	const getInvoiceByRegistration = (registrationId) => api(`/payments/registrations/${encodeURIComponent(registrationId)}/invoice`);
	return {
		createDokuCheckout,
		getOrder,
		getPayment,
		getMyInvoices,
		getInvoiceByRegistration
	};
}

export { usePayment as u };
//# sourceMappingURL=usePayment-CjKDGwPj.mjs.map
