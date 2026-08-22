import { f as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useParticipant.ts
function useParticipant() {
	const api = useNuxtApp().$api;
	const getMyProfile = () => api("/participants/me");
	const getParticipants = (page = 1, size = 20) => api(`/participants?page=${page}&size=${size}`);
	const upsertMyProfile = (payload) => api("/participants/me", {
		method: "PUT",
		body: payload
	});
	const patchMyProfile = (payload) => api("/participants/me", {
		method: "PATCH",
		body: payload
	});
	const uploadMyPhoto = (file) => {
		const body = new FormData();
		body.append("file", file);
		return api("/participants/me/photo", {
			method: "POST",
			body
		});
	};
	return {
		getMyProfile,
		getParticipants,
		upsertMyProfile,
		patchMyProfile,
		uploadMyPhoto
	};
}

export { useParticipant as u };
//# sourceMappingURL=useParticipant-CPMevOwd.mjs.map
