import { b as useRoute, u as useAuthStore, n as navigateTo, c as useNuxtApp } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import '@vue/shared';
import 'unhead/utils';

//#region app/composables/useAttendance.ts
function useAttendance() {
	const api = useNuxtApp().$api;
	const scanAttendance = (payload) => api("/attendance/scan", {
		method: "POST",
		body: payload
	});
	const manualCheckIn = (payload) => api("/check-ins/manual", {
		method: "POST",
		body: payload
	});
	const getEventAttendanceReport = (eventId, includeWithoutTicket = true) => {
		const query = new URLSearchParams({ include_without_ticket: String(includeWithoutTicket) });
		return api(`/attendance/events/${encodeURIComponent(eventId)}/report?${query.toString()}`);
	};
	const getRegistrationRoster = (eventId, registrationId) => api(`/attendance/events/${encodeURIComponent(eventId)}/roster/${encodeURIComponent(registrationId)}`);
	return {
		scanAttendance,
		manualCheckIn,
		getEventAttendanceReport,
		getRegistrationRoster
	};
}
//#endregion
//#region app/pages/admin/attendance.vue?vue&type=script&setup=true&lang.ts
var attendance_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "attendance",
	__ssrInlineRender: true,
	setup(__props) {
		useRoute();
		const authStore = useAuthStore();
		useEvent();
		const { getEventAttendanceReport } = useAttendance();
		const selectedEventId = ref("");
		const gateName = ref("Main Gate");
		const manualTicketNumber = ref("");
		const scannerRunning = ref(false);
		const scannerBusy = ref(false);
		const manualBusy = ref(false);
		const scannerError = ref("");
		const lastResult = ref(null);
		const events = ref([]);
		const eventsLoading = ref(false);
		const reportLoading = ref(false);
		const reportError = ref("");
		const includeWithoutTicket = ref(true);
		const attendanceRows = ref([]);
		const summaryCards = ref([]);
		ref(null);
		const formatDateTime = (value) => {
			if (!value) return "—";
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) return value;
			return new Intl.DateTimeFormat("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			}).format(date);
		};
		const attendanceStatusClass = (row) => {
			if (row.is_checked_in || row.status === "checked_in") return "bg-emerald-500/15 text-emerald-200 border border-emerald-300/30";
			if (row.has_ticket === false || row.attendance_status === "no_ticket") return "bg-amber-500/15 text-amber-200 border border-amber-300/30";
			return "bg-slate-700/60 text-slate-200 border border-white/10";
		};
		const attendanceStatusLabel = (row) => {
			if (row.is_checked_in || row.status === "checked_in") return "Checked in";
			if (row.has_ticket === false || row.attendance_status === "no_ticket") return "No ticket";
			return "Pending";
		};
		const normalizeAttendanceRows = (payload) => {
			if (!payload || typeof payload !== "object") return [];
			const source = payload;
			return Array.isArray(source.registrants) ? source.registrants : Array.isArray(source.rows) ? source.rows : Array.isArray(source.items) ? source.items : [];
		};
		const refreshReport = async () => {
			if (!selectedEventId.value) return;
			reportLoading.value = true;
			reportError.value = "";
			try {
				const payload = (await getEventAttendanceReport(selectedEventId.value, includeWithoutTicket.value))?.data ?? {};
				const rows = normalizeAttendanceRows(payload);
				attendanceRows.value = rows;
				const summary = payload.summary;
				const attendanceRate = Number(summary?.attendance_rate ?? summary?.total_checked_in ?? 0);
				summaryCards.value = [
					{
						label: "Total",
						value: String(summary?.total_registrations ?? rows.length ?? 0),
						note: "Registered guests"
					},
					{
						label: "Checked in",
						value: String(summary?.checked_in ?? summary?.total_checked_in ?? rows.filter((item) => item.is_checked_in || item.status === "checked_in").length),
						note: "Present today"
					},
					{
						label: "Pending",
						value: String(summary?.pending ?? rows.filter((item) => !(item.is_checked_in || item.status === "checked_in")).length),
						note: "Waiting to scan"
					},
					{
						label: "Attendance rate",
						value: `${Number.isFinite(attendanceRate) ? attendanceRate : 0}%`,
						note: "Overall attendance"
					}
				];
			} catch (error) {
				reportError.value = error.data?.message || "Unable to load attendance report.";
			} finally {
				reportLoading.value = false;
			}
		};
		watch(selectedEventId, () => {
			if (selectedEventId.value) refreshReport();
		});
		watch(includeWithoutTicket, () => {
			if (selectedEventId.value) refreshReport();
		});
		useSeoMeta$1({ title: "Attendance Scanner | IWBIF 2026" });
		if (!computed(() => authStore.isAdminOrOrganizer || authStore.userRole === "organizer").value) navigateTo("/dashboard");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" }, _attrs))}><div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p class="text-xs uppercase tracking-[0.32em] text-cyan-200">Organizer Panel</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Attendance scanner &amp; report</h1><p class="mt-2 max-w-2xl text-sm leading-7 text-slate-300"> Scan participant QR tickets, check-in manually, and export attendance report as CSV for the event team. </p></div><div class="flex flex-wrap gap-3"><button class="rounded-full border border-white/20 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"> Refresh report </button><button class="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:brightness-110"> Export CSV </button></div></div><div class="mb-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]"><article class="glass-card rounded-3xl p-5 sm:p-6"><div class="flex items-center justify-between gap-3"><div><p class="text-[10px] uppercase tracking-[0.28em] text-slate-400">Live scanner</p><h2 class="mt-2 text-xl font-bold">QR ticket check-in</h2></div><span class="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">${ssrInterpolate(unref(scannerRunning) ? "Scanning" : "Idle")}</span></div>`);
			if (unref(scannerError)) _push(`<div class="mt-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-100">${ssrInterpolate(unref(scannerError))}</div>`);
			else _push(`<!---->`);
			_push(`<div class="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60"><video class="aspect-video w-full bg-black object-cover" muted playsinline autoplay></video></div><div class="mt-5 flex flex-wrap gap-3"><button class="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"${ssrIncludeBooleanAttr(unref(scannerBusy) || !unref(selectedEventId)) ? " disabled" : ""}>${ssrInterpolate(unref(scannerBusy) ? "Starting..." : unref(scannerRunning) ? "Restart scanner" : "Start camera")}</button><button class="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"${ssrIncludeBooleanAttr(unref(scannerBusy) || !unref(selectedEventId)) ? " disabled" : ""}> Stop </button><button class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"${ssrIncludeBooleanAttr(unref(manualBusy) || !unref(selectedEventId) || !unref(manualTicketNumber)) ? " disabled" : ""}>${ssrInterpolate(unref(manualBusy) ? "Checking in..." : "Manual check-in")}</button></div><div class="mt-5 grid gap-4 sm:grid-cols-2"><label class="grid gap-2 text-sm"><span class="text-[10px] uppercase tracking-[0.24em] text-slate-400">Event</span><select class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none"${ssrIncludeBooleanAttr(unref(eventsLoading)) ? " disabled" : ""}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEventId)) ? ssrLooseContain(unref(selectedEventId), "") : ssrLooseEqual(unref(selectedEventId), "")) ? " selected" : ""}>Select event</option><!--[-->`);
			ssrRenderList(unref(events), (event) => {
				_push(`<option${ssrRenderAttr("value", event.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEventId)) ? ssrLooseContain(unref(selectedEventId), event.id) : ssrLooseEqual(unref(selectedEventId), event.id)) ? " selected" : ""}>${ssrInterpolate(event.name)}</option>`);
			});
			_push(`<!--]--></select></label><label class="grid gap-2 text-sm"><span class="text-[10px] uppercase tracking-[0.24em] text-slate-400">Gate name</span><input${ssrRenderAttr("value", unref(gateName))} type="text" placeholder="Main Gate" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none"></label><label class="grid gap-2 text-sm sm:col-span-2"><span class="text-[10px] uppercase tracking-[0.24em] text-slate-400">Manual ticket number</span><input${ssrRenderAttr("value", unref(manualTicketNumber))} type="text" placeholder="TICKET-..." class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none"></label></div></article><article class="glass-card rounded-3xl p-5 sm:p-6"><p class="text-[10px] uppercase tracking-[0.28em] text-slate-400">Latest result</p><h2 class="mt-2 text-xl font-bold">Check-in status</h2>`);
			if (unref(lastResult)) _push(`<div class="mt-5 space-y-4"><div class="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4"><div class="flex items-center justify-between gap-3"><span class="text-[10px] uppercase tracking-[0.22em] text-emerald-200">Status</span><span class="rounded-full border border-emerald-300/30 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">${ssrInterpolate(unref(lastResult).check_in?.status || "success")}</span></div><p class="mt-3 text-2xl font-black text-white">${ssrInterpolate(unref(lastResult).registrant?.participant_name || unref(lastResult).registrant?.ticket_number || "Participant")}</p><p class="mt-1 text-sm text-slate-300">${ssrInterpolate(unref(lastResult).registrant?.ticket_number || "Ticket not available")}</p></div><dl class="grid gap-3 text-sm text-slate-300"><div class="flex items-center justify-between gap-3 border-b border-white/10 pb-2"><dt>Registration</dt><dd class="font-semibold text-white">${ssrInterpolate(unref(lastResult).registrant?.registration_number || "N/A")}</dd></div><div class="flex items-center justify-between gap-3 border-b border-white/10 pb-2"><dt>Gate</dt><dd class="font-semibold text-white">${ssrInterpolate(unref(lastResult).check_in?.gate_name || unref(gateName) || "N/A")}</dd></div><div class="flex items-center justify-between gap-3 border-b border-white/10 pb-2"><dt>Checked-in</dt><dd class="font-semibold text-white">${ssrInterpolate(formatDateTime(unref(lastResult).check_in?.check_in_at))}</dd></div><div class="flex items-center justify-between gap-3"><dt>Ticket status</dt><dd class="font-semibold text-white">${ssrInterpolate(unref(lastResult).registrant?.is_checked_in ? "Checked in" : "Waiting")}</dd></div></dl></div>`);
			else _push(`<div class="mt-5 rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-5 text-sm text-slate-300"> Scan a QR ticket or use manual check-in to see the latest attendance result here. </div>`);
			_push(`</article></div><article class="glass-card rounded-3xl p-5 sm:p-6"><div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-[10px] uppercase tracking-[0.28em] text-slate-400">Attendance overview</p><h2 class="mt-2 text-xl font-bold">Event attendance report</h2></div><label class="flex items-center gap-2 rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-sm text-slate-300"><input${ssrIncludeBooleanAttr(Array.isArray(unref(includeWithoutTicket)) ? ssrLooseContain(unref(includeWithoutTicket), null) : unref(includeWithoutTicket)) ? " checked" : ""} type="checkbox" class="h-4 w-4 accent-cyan-300"> Include guests without ticket </label></div>`);
			if (unref(reportLoading)) {
				_push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(4, (n) => {
					_push(`<div class="h-28 animate-pulse rounded-2xl bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(reportError)) _push(`<div class="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">${ssrInterpolate(unref(reportError))}</div>`);
			else {
				_push(`<div class="space-y-5"><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(unref(summaryCards), (card) => {
					_push(`<article class="rounded-2xl border border-white/10 bg-slate-900/40 p-4"><p class="text-[10px] uppercase tracking-[0.24em] text-slate-400">${ssrInterpolate(card.label)}</p><p class="mt-3 text-2xl font-black text-white">${ssrInterpolate(card.value)}</p><p class="mt-1 text-xs text-slate-400">${ssrInterpolate(card.note)}</p></article>`);
				});
				_push(`<!--]--></div><div class="overflow-x-auto"><table class="min-w-full text-left text-sm text-slate-300"><thead><tr class="border-b border-white/10 text-[10px] uppercase tracking-[0.22em] text-slate-400"><th class="py-3 pr-4">Registrant</th><th class="py-3 pr-4">Ticket</th><th class="py-3 pr-4">Status</th><th class="py-3 pr-4">Check-in</th><th class="py-3 pr-4">Gate</th><th class="py-3 pr-4">Action</th></tr></thead><tbody><!--[-->`);
				ssrRenderList(unref(attendanceRows), (row) => {
					_push(`<tr class="border-b border-white/5 last:border-0"><td class="py-3 pr-4"><div class="font-semibold text-white">${ssrInterpolate(row.participant_name || "Unknown participant")}</div><div class="text-xs text-slate-400">${ssrInterpolate(row.registration_number || row.registration_id || "N/A")}</div></td><td class="py-3 pr-4"><div class="font-medium text-white">${ssrInterpolate(row.ticket_number || "No ticket")}</div><div class="text-xs text-slate-400">${ssrInterpolate(row.organization_name || "No organization")}</div></td><td class="py-3 pr-4"><span class="${ssrRenderClass([attendanceStatusClass(row), "inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"])}">${ssrInterpolate(attendanceStatusLabel(row))}</span></td><td class="py-3 pr-4">${ssrInterpolate(formatDateTime(row.check_in_at))}</td><td class="py-3 pr-4">${ssrInterpolate(row.gate_name || "—")}</td><td class="py-3 pr-4"><button class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100"> Detail </button></td></tr>`);
				});
				_push(`<!--]--></tbody></table></div></div>`);
			}
			_push(`</article></section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/attendance.vue
var _sfc_setup = attendance_vue_vue_type_script_setup_true_lang_default.setup;
attendance_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/attendance.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var attendance_default = attendance_vue_vue_type_script_setup_true_lang_default;

export { attendance_default as default };
//# sourceMappingURL=attendance-C-zvhE-m.mjs.map
