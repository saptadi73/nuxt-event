import { c as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useAdminContent.ts
function useAdminContent() {
	const api = useNuxtApp().$api;
	const getProducts = (eventId) => api(`/store/events/${eventId}/products`);
	const createProduct = (eventId, payload) => api(`/store/admin/events/${eventId}/products`, {
		method: "POST",
		body: payload
	});
	const updateProduct = (productId, payload) => api(`/store/admin/products/${productId}`, {
		method: "PUT",
		body: payload
	});
	const createDelegatePackage = (eventId, payload) => api(`/admin/events/${eventId}/delegate-packages`, {
		method: "POST",
		body: payload
	});
	const updateDelegatePackage = (eventId, packageId, payload) => api(`/admin/events/${eventId}/delegate-packages/${packageId}`, {
		method: "PUT",
		body: payload
	});
	const deleteDelegatePackage = (eventId, packageId) => api(`/admin/events/${eventId}/delegate-packages/${packageId}`, { method: "DELETE" });
	const getSessions = (eventSlug) => api(`/events/${eventSlug}/sessions`);
	const createSession = (payload) => api("/sessions", {
		method: "POST",
		body: payload
	});
	const updateSession = (sessionId, payload) => api(`/sessions/${sessionId}`, {
		method: "PUT",
		body: payload
	});
	const deleteSession = (sessionId) => api(`/sessions/${sessionId}`, { method: "DELETE" });
	const createSpeaker = (payload) => api("/speakers", {
		method: "POST",
		body: payload
	});
	const updateSpeaker = (speakerId, payload) => api(`/speakers/${speakerId}`, {
		method: "PUT",
		body: payload
	});
	const deleteSpeaker = (speakerId) => api(`/speakers/${speakerId}`, { method: "DELETE" });
	const attachSpeakerToEvent = (speakerId, eventId) => api(`/speakers/${speakerId}/events`, {
		method: "POST",
		body: { event_id: eventId }
	});
	return {
		getProducts,
		createProduct,
		updateProduct,
		createDelegatePackage,
		updateDelegatePackage,
		deleteDelegatePackage,
		getSessions,
		createSession,
		updateSession,
		deleteSession,
		createSpeaker,
		updateSpeaker,
		deleteSpeaker,
		attachSpeakerToEvent
	};
}

export { useAdminContent as u };
//# sourceMappingURL=useAdminContent-GiNaIDgL.mjs.map
