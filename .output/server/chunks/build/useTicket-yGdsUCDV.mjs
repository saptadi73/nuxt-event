import { f as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useTicket.ts
function useTicket() {
	const api = useNuxtApp().$api;
	const getMyTickets = () => api("/tickets/me");
	const getQrByTicket = (ticketId) => api(`/tickets/${ticketId}/qr`);
	const reissueTicket = (ticketId) => api(`/tickets/${ticketId}/reissue`, { method: "POST" });
	return {
		getMyTickets,
		getQrByTicket,
		reissueTicket
	};
}

export { useTicket as u };
//# sourceMappingURL=useTicket-yGdsUCDV.mjs.map
