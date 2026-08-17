globalThis.__timing__.logStart('Load chunks/build/useTicket-yGdsUCDV');import { e as useNuxtApp } from '../virtual/entry.mjs';

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

export { useTicket as u };;globalThis.__timing__.logEnd('Load chunks/build/useTicket-yGdsUCDV');
//# sourceMappingURL=useTicket-yGdsUCDV.mjs.map
