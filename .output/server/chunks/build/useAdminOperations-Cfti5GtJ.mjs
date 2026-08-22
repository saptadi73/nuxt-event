import { f as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useAdminOperations.ts
function useAdminOperations() {
	const api = useNuxtApp().$api;
	const getUsers = (page = 1, size = 20, role = "", status = "") => {
		const query = new URLSearchParams({
			page: String(page),
			size: String(size)
		});
		if (role) query.set("role", role);
		if (status) query.set("status", status);
		return api(`/admin/users?${query}`);
	};
	const createUser = (body) => api("/admin/users", {
		method: "POST",
		body
	});
	const updateUser = (id, body) => api(`/admin/users/${id}`, {
		method: "PUT",
		body
	});
	const getAdminAnnouncements = (eventId) => api(`/admin/events/${eventId}/announcements`);
	const createAnnouncement = (eventId, body) => api(`/admin/events/${eventId}/announcements`, {
		method: "POST",
		body
	});
	const updateAnnouncement = (id, body) => api(`/admin/announcements/${id}`, {
		method: "PUT",
		body
	});
	const deleteAnnouncement = (id) => api(`/admin/announcements/${id}`, { method: "DELETE" });
	const getAdminCertificates = (eventId) => api(`/admin/events/${eventId}/certificates`);
	const createCertificate = (body) => api("/admin/certificates", {
		method: "POST",
		body
	});
	const updateCertificate = (id, body) => api(`/admin/certificates/${id}`, {
		method: "PUT",
		body
	});
	const deleteCertificate = (id) => api(`/admin/certificates/${id}`, { method: "DELETE" });
	return {
		getUsers,
		createUser,
		updateUser,
		getAdminAnnouncements,
		createAnnouncement,
		updateAnnouncement,
		deleteAnnouncement,
		getAdminCertificates,
		createCertificate,
		updateCertificate,
		deleteCertificate
	};
}

export { useAdminOperations as u };
//# sourceMappingURL=useAdminOperations-Cfti5GtJ.mjs.map
