import { a as useSeoMeta$1, u as useAuthStore, b as useAsyncData, c as useNuxtApp } from '../virtual/entry.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@vue/shared';
import 'unhead/utils';

//#region app/composables/useAdminReport.ts
function useAdminReport() {
	const api = useNuxtApp().$api;
	const getReport = (params = {}) => {
		const query = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value === void 0 || value === null || value === "") return;
			query.append(key, String(value));
		});
		const suffix = query.toString() ? `?${query.toString()}` : "";
		return api(`/admin/reports/payments${suffix}`);
	};
	return { getReport };
}
//#endregion
//#region app/pages/admin/reports.vue?vue&type=script&setup=true&lang.ts
var csvUrl = "/admin/reports/payments.csv";
var reports_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "reports",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Sales Report | IWBIF 2026" });
		const authStore = useAuthStore();
		const { getReport } = useAdminReport();
		const errorMessage = ref("");
		const defaultReport = {
			summary: {
				total_transactions: 0,
				successful_transactions: 0,
				pending_transactions: 0,
				failed_transactions: 0,
				expired_transactions: 0,
				gross_revenue: 0,
				pending_amount: 0,
				currency: "IDR"
			},
			by_status: [],
			by_channel: [],
			by_package: [],
			daily_revenue: [],
			transactions: []
		};
		const { data, pending, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-report-payments", () => getReport())), __temp = await __temp, __restore(), __temp);
		const report = computed(() => data.value?.data ?? defaultReport);
		const summaryCards = computed(() => [
			{
				label: "Total transactions",
				value: formatNumber(report.value.summary.total_transactions),
				note: "All recorded orders"
			},
			{
				label: "Successful",
				value: formatNumber(report.value.summary.successful_transactions),
				note: "Paid & validated"
			},
			{
				label: "Revenue",
				value: formatCurrency(report.value.summary.gross_revenue),
				note: report.value.summary.currency
			},
			{
				label: "Pending amount",
				value: formatCurrency(report.value.summary.pending_amount),
				note: "Awaiting verification"
			}
		]);
		const byStatus = computed(() => report.value.by_status ?? []);
		const dailyRevenue = computed(() => report.value.daily_revenue ?? []);
		const transactions = computed(() => report.value.transactions ?? []);
		if (error.value) errorMessage.value = "Unable to load payment report. Please check your admin access token or backend availability.";
		function formatCurrency(value) {
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				maximumFractionDigits: 0
			}).format(Number(value || 0));
		}
		function formatNumber(value) {
			return new Intl.NumberFormat("id-ID").format(Number(value || 0));
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" }, _attrs))}><div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p class="text-xs uppercase tracking-[0.28em] text-amber-200">Organizer Panel</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Ticket sales &amp; revenue report</h1></div><div class="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100"> Role: ${ssrInterpolate(unref(authStore).userRole || "unknown")}</div></div>`);
			if (unref(pending)) {
				_push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(4, (n) => {
					_push(`<div class="h-32 animate-pulse rounded-3xl bg-white/5"></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(errorMessage)) _push(`<div class="rounded-3xl border border-rose-400/40 bg-rose-500/10 p-5 text-sm text-rose-100">${ssrInterpolate(unref(errorMessage))}</div>`);
			else {
				_push(`<div class="space-y-6"><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
				ssrRenderList(unref(summaryCards), (metric) => {
					_push(`<article class="glass-card rounded-3xl p-5"><p class="text-[10px] uppercase tracking-[0.25em] text-slate-400">${ssrInterpolate(metric.label)}</p><p class="mt-3 text-2xl font-black text-white">${ssrInterpolate(metric.value)}</p><p class="mt-2 text-sm text-slate-400">${ssrInterpolate(metric.note)}</p></article>`);
				});
				_push(`<!--]--></div><div class="grid gap-6 xl:grid-cols-2"><article class="glass-card rounded-3xl p-5"><h2 class="text-lg font-bold">Revenue by status</h2><ul class="mt-4 space-y-3 text-sm text-slate-300"><!--[-->`);
				ssrRenderList(unref(byStatus), (item) => {
					_push(`<li class="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0"><span>${ssrInterpolate(item.label)}</span><strong class="text-white">${ssrInterpolate(formatCurrency(item.amount))}</strong></li>`);
				});
				_push(`<!--]--></ul></article><article class="glass-card rounded-3xl p-5"><h2 class="text-lg font-bold">Daily revenue</h2><ul class="mt-4 space-y-3 text-sm text-slate-300"><!--[-->`);
				ssrRenderList(unref(dailyRevenue), (item) => {
					_push(`<li class="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0"><span>${ssrInterpolate(item.date)}</span><strong class="text-white">${ssrInterpolate(formatCurrency(item.amount))}</strong></li>`);
				});
				_push(`<!--]--></ul></article></div><article class="glass-card rounded-3xl p-5"><div class="mb-4 flex items-center justify-between gap-3"><h2 class="text-lg font-bold">Latest transactions</h2><a${ssrRenderAttr("href", csvUrl)} class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Download CSV</a></div><div class="overflow-x-auto"><table class="min-w-full text-left text-sm text-slate-300"><thead><tr class="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-400"><th class="py-3 pr-4">Order</th><th class="py-3 pr-4">Participant</th><th class="py-3 pr-4">Package</th><th class="py-3 pr-4">Channel</th><th class="py-3 pr-4">Status</th><th class="py-3 pr-4 text-right">Amount</th></tr></thead><tbody><!--[-->`);
				ssrRenderList(unref(transactions), (item) => {
					_push(`<tr class="border-b border-white/5 last:border-0"><td class="py-3 pr-4 text-white">${ssrInterpolate(item.order_number || item.id)}</td><td class="py-3 pr-4">${ssrInterpolate(item.participant_name || "N/A")}</td><td class="py-3 pr-4">${ssrInterpolate(item.package_name || "N/A")}</td><td class="py-3 pr-4">${ssrInterpolate(item.channel_code || item.provider || "N/A")}</td><td class="py-3 pr-4">${ssrInterpolate(item.transaction_status || item.status || "N/A")}</td><td class="py-3 pr-4 text-right text-white">${ssrInterpolate(formatCurrency(item.gross_amount || 0))}</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div></article></div>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/reports.vue
var _sfc_setup = reports_vue_vue_type_script_setup_true_lang_default.setup;
reports_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/reports.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var reports_default = reports_vue_vue_type_script_setup_true_lang_default;

export { reports_default as default };
//# sourceMappingURL=reports-BQwqbVYN.mjs.map
