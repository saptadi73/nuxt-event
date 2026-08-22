import { c as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useAdminReport.ts
function useAdminReport() {
	const api = useNuxtApp().$api;
	const getReport = (params = {}) => {
		const query = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value === void 0 || value === null || value === "") return;
			query.append(key, String(value));
		});
		const suffix = query.toString() ? `?${query.toString()}` : "";
		return api(`/admin/reports/payments${suffix}`);
	};
	const confirmManualPayment = (orderId, payload) => api(`/admin/orders/${encodeURIComponent(orderId)}/confirm-manual-payment`, {
		method: "POST",
		body: payload
	});
	return {
		getReport,
		confirmManualPayment
	};
}

export { useAdminReport as u };
//# sourceMappingURL=useAdminReport-CUb4ebGl.mjs.map
