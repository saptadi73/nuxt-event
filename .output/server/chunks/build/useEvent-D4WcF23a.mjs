globalThis.__timing__.logStart('Load chunks/build/useEvent-D4WcF23a');import { e as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useEvent.ts
function useEvent() {
	const api = useNuxtApp().$api;
	const getEvents = (page = 1, size = 20) => api(`/events?page=${page}&size=${size}`);
	const getEvent = (eventId) => api(`/events/${eventId}`);
	const getEventSessions = (slug) => api(`/events/${slug}/sessions`);
	const getEventSpeakers = (slug) => api(`/events/${slug}/speakers`);
	const getEventWorkshopTracks = (slug) => api(`/events/${slug}/workshop-tracks`);
	const getEventTicketTypes = (slug) => api(`/events/${slug}/ticket-types`);
	const getEventDelegatePackages = (eventId) => api(`/events/${eventId}/delegate-packages`);
	const getEventActivities = (eventId) => api(`/events/${eventId}/activities`);
	const getEventExhibitors = (eventId) => api(`/events/${eventId}/exhibitors`);
	return {
		getEvents,
		getEvent,
		getEventSessions,
		getEventSpeakers,
		getEventWorkshopTracks,
		getEventTicketTypes,
		getEventDelegatePackages,
		getEventActivities,
		getEventExhibitors
	};
}

export { useEvent as u };;globalThis.__timing__.logEnd('Load chunks/build/useEvent-D4WcF23a');
//# sourceMappingURL=useEvent-D4WcF23a.mjs.map
