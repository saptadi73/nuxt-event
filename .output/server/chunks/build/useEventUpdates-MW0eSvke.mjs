import { c as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useEventUpdates.ts
function useEventUpdates() {
	const api = useNuxtApp().$api;
	const getAnnouncements = (eventId) => api(`/events/${eventId}/announcements`);
	const getMyCertificates = () => api("/certificates/me");
	return {
		getAnnouncements,
		getMyCertificates
	};
}

export { useEventUpdates as u };
//# sourceMappingURL=useEventUpdates-MW0eSvke.mjs.map
