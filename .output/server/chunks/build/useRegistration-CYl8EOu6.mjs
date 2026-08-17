globalThis.__timing__.logStart('Load chunks/build/useRegistration-CYl8EOu6');import { e as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useRegistration.ts
function useRegistration() {
	const api = useNuxtApp().$api;
	const createRegistration = (payload) => api(`/events/${payload.event_id}/registrations`, {
		method: "POST",
		body: Object.fromEntries(Object.entries(payload).filter(([key]) => key !== "event_id"))
	});
	const getRegistration = (registrationId) => api(`/registrations/${registrationId}`);
	const getMyRegistrations = (eventId) => api("/registrations/me", { query: eventId ? { event_id: eventId } : void 0 });
	return {
		createRegistration,
		getRegistration,
		getMyRegistrations
	};
}

export { useRegistration as u };;globalThis.__timing__.logEnd('Load chunks/build/useRegistration-CYl8EOu6');
//# sourceMappingURL=useRegistration-CYl8EOu6.mjs.map
