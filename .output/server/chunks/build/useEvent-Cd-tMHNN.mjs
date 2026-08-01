globalThis.__timing__.logStart('Load chunks/build/useEvent-Cd-tMHNN');import { c as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useEvent.ts
function useEvent() {
	const api = useNuxtApp().$api;
	const getEvents = (page = 1, size = 20) => api(`/events?page=${page}&size=${size}`);
	const getEvent = (eventId) => api(`/events/${eventId}`);
	const getEventSessions = (slug) => api(`/events/${slug}/sessions`);
	const getEventSpeakers = (slug) => api(`/events/${slug}/speakers`);
	const getEventWorkshopTracks = (slug) => api(`/events/${slug}/workshop-tracks`);
	const getEventTicketTypes = (slug) => api(`/events/${slug}/ticket-types`);
	return {
		getEvents,
		getEvent,
		getEventSessions,
		getEventSpeakers,
		getEventWorkshopTracks,
		getEventTicketTypes
	};
}

export { useEvent as u };;globalThis.__timing__.logEnd('Load chunks/build/useEvent-Cd-tMHNN');
//# sourceMappingURL=useEvent-Cd-tMHNN.mjs.map
