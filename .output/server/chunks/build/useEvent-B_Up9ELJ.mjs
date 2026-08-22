import { c as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useEvent.ts
function useEvent() {
	const api = useNuxtApp().$api;
	const getEvents = (page = 1, size = 20) => api(`/events?page=${page}&size=${size}`);
	const getEvent = (eventId) => api(`/events/${eventId}`);
	const getEventSessions = (slug) => api(`/events/${slug}/sessions`);
	const getSessionsByEventId = (eventId) => api(`/sessions/events/${eventId}`);
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
		getSessionsByEventId,
		getEventSpeakers,
		getEventWorkshopTracks,
		getEventTicketTypes,
		getEventDelegatePackages,
		getEventActivities,
		getEventExhibitors
	};
}

export { useEvent as u };
//# sourceMappingURL=useEvent-B_Up9ELJ.mjs.map
