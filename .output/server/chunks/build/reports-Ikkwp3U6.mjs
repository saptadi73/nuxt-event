globalThis.__timing__.logStart('Load chunks/build/reports-Ikkwp3U6');import { _ as _plugin_vue_export_helper_default, a as useRoute, b as useRouter, c as useSeoMeta$1, u as useAuthStore, e as useNuxtApp } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-D4WcF23a.mjs';
import { defineComponent, ref, computed, withAsyncContext, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
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
var reports_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "reports",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const route = useRoute();
		const router = useRouter();
		useSeoMeta$1({ title: "Sales Report | IWBIF 2026" });
		const authStore = useAuthStore();
		const { getReport } = useAdminReport();
		const { getEvents, getEventDelegatePackages } = useEvent();
		const dateFrom = ref("");
		const dateTo = ref("");
		const statusFilter = ref("");
		const channelFilter = ref("");
		const packageIdFilter = ref("");
		const eventFilter = ref("");
		const loading = ref(false);
		const searchTerm = ref("");
		const itemsPerPage = ref(20);
		const currentPage = ref(1);
		const eventsLoading = ref(false);
		const packageLoading = ref(false);
		const autoReloadTimer = ref(null);
		const events = ref([]);
		const packageOptions = ref([]);
		const routeReady = ref(false);
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
		const report = ref(defaultReport);
		const pending = computed(() => loading.value);
		const lastUpdated = ref(null);
		const formatDateShort = (value) => {
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) return value;
			return new Intl.DateTimeFormat("en-US", {
				month: "short",
				day: "numeric"
			}).format(date);
		};
		const buildReportParams = () => {
			const params = {};
			if (dateFrom.value) params.date_from = `${dateFrom.value}T00:00:00`;
			if (dateTo.value) params.date_to = `${dateTo.value}T23:59:59`;
			if (statusFilter.value) params.status = statusFilter.value;
			if (channelFilter.value) params.channel_code = channelFilter.value;
			if (eventFilter.value) params.event_id = eventFilter.value;
			if (packageIdFilter.value.trim()) params.package_id = packageIdFilter.value.trim();
			return params;
		};
		const readFiltersFromQuery = () => {
			const q = route.query;
			eventFilter.value = typeof q.event_id === "string" ? q.event_id : "";
			dateFrom.value = typeof q.date_from === "string" ? q.date_from.split("T")[0] : "";
			dateTo.value = typeof q.date_to === "string" ? q.date_to.split("T")[0] : "";
			statusFilter.value = typeof q.status === "string" ? q.status : "";
			channelFilter.value = typeof q.channel_code === "string" ? q.channel_code : "";
			packageIdFilter.value = typeof q.package_id === "string" ? q.package_id : "";
			searchTerm.value = typeof q.q === "string" ? q.q : "";
			if (typeof q.per_page === "string" && !Number.isNaN(Number(q.per_page))) {
				const nextPerPage = Number(q.per_page);
				if (nextPerPage > 0) itemsPerPage.value = nextPerPage;
			}
		};
		const buildQueryState = () => ({
			event_id: eventFilter.value || void 0,
			date_from: dateFrom.value || void 0,
			date_to: dateTo.value || void 0,
			status: statusFilter.value || void 0,
			channel_code: channelFilter.value || void 0,
			package_id: packageIdFilter.value || void 0,
			q: searchTerm.value || void 0,
			per_page: String(itemsPerPage.value) || void 0
		});
		const syncFiltersToUrl = () => {
			if (!routeReady.value) return;
			const nextQuery = Object.fromEntries(Object.entries(buildQueryState()).filter(([, value]) => Boolean(value)).map(([key, value]) => [key, String(value)]));
			router.replace({ query: nextQuery });
		};
		const csvUrl = computed(() => {
			const query = new URLSearchParams();
			const params = buildReportParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value) query.append(key, value);
			});
			return query.toString() ? `/admin/reports/payments.csv?${query.toString()}` : "/admin/reports/payments.csv";
		});
		const csvFileName = computed(() => {
			const fallbackDate = formatDateOnly((/* @__PURE__ */ new Date()).toISOString());
			return `sales-report-${(events.value.find((item) => item.id === eventFilter.value)?.name || "all-events").toLowerCase().replace(/[^a-z0-9]+/g, "-")}${(dateFrom.value && dateTo.value ? `-${dateFrom.value}-to-${dateTo.value}` : "") || `-${fallbackDate}`}.csv`;
		});
		const loadReport = async () => {
			if (loading.value) return;
			loading.value = true;
			errorMessage.value = "";
			if (hasDateRangeInvalid.value) {
				errorMessage.value = "Tanggal mulai tidak boleh lebih besar dari tanggal selesai.";
				loading.value = false;
				return;
			}
			try {
				const response = await getReport(buildReportParams());
				report.value = response.data || defaultReport;
				lastUpdated.value = /* @__PURE__ */ new Date();
				if (currentPage.value !== 1) currentPage.value = 1;
			} catch (error) {
				errorMessage.value = "Unable to load payment report. Please check your admin access token or backend availability.";
				console.error(error);
			} finally {
				loading.value = false;
			}
		};
		const loadEvents = async () => {
			if (eventsLoading.value) return;
			eventsLoading.value = true;
			try {
				const response = await getEvents(1, 100);
				events.value = response.data || [];
			} finally {
				eventsLoading.value = false;
			}
		};
		const loadPackagesByEvent = async (clearSelected = true) => {
			packageOptions.value = [];
			if (clearSelected) packageIdFilter.value = "";
			if (!eventFilter.value) return;
			packageLoading.value = true;
			try {
				const packages = (await getEventDelegatePackages(eventFilter.value)).data || [];
				packageOptions.value = packages.map((item) => ({
					id: item.id,
					name: item.name || item.code
				}));
				if (packageIdFilter.value && !packageOptions.value.find((item) => item.id === packageIdFilter.value)) packageIdFilter.value = "";
			} catch {
				packageOptions.value = [];
				packageIdFilter.value = "";
			} finally {
				packageLoading.value = false;
			}
		};
		const scheduleAutoReload = () => {
			if (!routeReady.value) return;
			if (autoReloadTimer.value) {
				clearTimeout(autoReloadTimer.value);
				autoReloadTimer.value = null;
			}
			autoReloadTimer.value = setTimeout(() => {
				if (!hasDateRangeInvalid.value) loadReport();
			}, 350);
		};
		const formatDateOnly = (value) => {
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) return "";
			return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
		};
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
		const byChannel = computed(() => report.value.by_channel ?? []);
		const channelOptions = computed(() => [...new Set(byChannel.value.map((item) => item.label).filter(Boolean))]);
		const dailyRevenue = computed(() => report.value.daily_revenue ?? []);
		const dailyRevenueMax = computed(() => Math.max(...dailyRevenue.value.map((item) => item.amount), 1));
		const transactions = computed(() => report.value.transactions ?? []);
		const filteredTransactions = computed(() => {
			const q = searchTerm.value.trim().toLowerCase();
			if (!q) return transactions.value;
			return transactions.value.filter((item) => {
				return [
					item.order_number,
					item.id,
					item.participant_name,
					item.package_name,
					item.channel_code,
					item.provider,
					item.transaction_status,
					item.status
				].filter(Boolean).join(" ").toLowerCase().includes(q);
			});
		});
		const totalPages = computed(() => Math.max(1, Math.ceil(filteredTransactions.value.length / itemsPerPage.value)));
		const paginatedTransactions = computed(() => {
			const page = Math.max(1, Math.min(currentPage.value, totalPages.value));
			currentPage.value = page;
			const start = (page - 1) * itemsPerPage.value;
			return filteredTransactions.value.slice(start, start + itemsPerPage.value);
		});
		[__temp, __restore] = withAsyncContext(() => loadEvents()), await __temp, __restore();
		readFiltersFromQuery();
		if (eventFilter.value) [__temp, __restore] = withAsyncContext(() => loadPackagesByEvent(false)), await __temp, __restore();
		[__temp, __restore] = withAsyncContext(() => loadReport()), await __temp, __restore();
		routeReady.value = true;
		syncFiltersToUrl();
		const formatCurrency = (value) => {
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				maximumFractionDigits: 0
			}).format(Number(value || 0));
		};
		const formatNumber = (value) => {
			return new Intl.NumberFormat("id-ID").format(Number(value || 0));
		};
		const hasDateRangeInvalid = computed(() => Boolean(dateFrom.value && dateTo.value && dateFrom.value > dateTo.value));
		const hasActiveFilters = computed(() => {
			return !!eventFilter.value || !!dateFrom.value || !!dateTo.value || !!statusFilter.value || !!channelFilter.value || !!packageIdFilter.value || !!searchTerm.value;
		});
		const lastUpdatedLabel = computed(() => {
			if (!lastUpdated.value) return "belum dimuat";
			return new Intl.DateTimeFormat("en-GB", {
				dateStyle: "medium",
				timeStyle: "short"
			}).format(lastUpdated.value);
		});
		const transactionStatusClass = (status) => {
			const value = (status || "").toLowerCase();
			if (value === "success") return "status-success";
			if (value === "pending" || value === "created") return "status-pending";
			return "status-danger";
		};
		watch(eventFilter, async () => {
			currentPage.value = 1;
			await loadPackagesByEvent();
			syncFiltersToUrl();
			scheduleAutoReload();
		});
		watch([
			dateFrom,
			dateTo,
			statusFilter,
			channelFilter,
			packageIdFilter
		], () => {
			currentPage.value = 1;
			syncFiltersToUrl();
			scheduleAutoReload();
		});
		watch([searchTerm, itemsPerPage], () => {
			currentPage.value = 1;
			syncFiltersToUrl();
		});
		watch(currentPage, () => {
			syncFiltersToUrl();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" }, _attrs))} data-v-368d1170><div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" data-v-368d1170><div data-v-368d1170><p class="text-xs uppercase tracking-[0.28em] text-amber-200" data-v-368d1170>Organizer Panel</p><h1 class="mt-3 text-3xl font-black sm:text-4xl" data-v-368d1170>Ticket sales &amp; revenue report</h1><p class="mt-2 text-xs text-slate-400" data-v-368d1170>Last updated: ${ssrInterpolate(unref(lastUpdatedLabel))}</p></div><div class="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100" data-v-368d1170> Role: ${ssrInterpolate(unref(authStore).userRole || "unknown")}</div></div><div class="mb-6 grid gap-3 rounded-3xl border border-amber-300/20 bg-white/5 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]" data-v-368d1170><label class="grid gap-2 text-sm" data-v-368d1170><span class="text-xs uppercase tracking-[0.2em] text-slate-400" data-v-368d1170>Event</span><select class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none"${ssrIncludeBooleanAttr(unref(eventsLoading)) ? " disabled" : ""} data-v-368d1170><option value="" data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(eventFilter)) ? ssrLooseContain(unref(eventFilter), "") : ssrLooseEqual(unref(eventFilter), "")) ? " selected" : ""}>Semua event</option><!--[-->`);
			ssrRenderList(unref(events), (event) => {
				_push(`<option${ssrRenderAttr("value", event.id)} data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(eventFilter)) ? ssrLooseContain(unref(eventFilter), event.id) : ssrLooseEqual(unref(eventFilter), event.id)) ? " selected" : ""}>${ssrInterpolate(event.name)}</option>`);
			});
			_push(`<!--]--></select></label><label class="grid gap-2 text-sm" data-v-368d1170><span class="text-xs uppercase tracking-[0.2em] text-slate-400" data-v-368d1170>Tanggal mulai</span><input${ssrRenderAttr("value", unref(dateFrom))} type="date" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" data-v-368d1170></label><label class="grid gap-2 text-sm" data-v-368d1170><span class="text-xs uppercase tracking-[0.2em] text-slate-400" data-v-368d1170>Tanggal selesai</span><input${ssrRenderAttr("value", unref(dateTo))} type="date" class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" data-v-368d1170></label><label class="grid gap-2 text-sm" data-v-368d1170><span class="text-xs uppercase tracking-[0.2em] text-slate-400" data-v-368d1170>Status</span><select class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" data-v-368d1170><option value="" data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>Semua status</option><option value="created" data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "created") : ssrLooseEqual(unref(statusFilter), "created")) ? " selected" : ""}>created</option><option value="pending" data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "pending") : ssrLooseEqual(unref(statusFilter), "pending")) ? " selected" : ""}>pending</option><option value="success" data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "success") : ssrLooseEqual(unref(statusFilter), "success")) ? " selected" : ""}>success</option><option value="failed" data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "failed") : ssrLooseEqual(unref(statusFilter), "failed")) ? " selected" : ""}>failed</option><option value="expired" data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "expired") : ssrLooseEqual(unref(statusFilter), "expired")) ? " selected" : ""}>expired</option></select></label><label class="grid gap-2 text-sm" data-v-368d1170><span class="text-xs uppercase tracking-[0.2em] text-slate-400" data-v-368d1170>Channel</span><select class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none" data-v-368d1170><option value="" data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(channelFilter)) ? ssrLooseContain(unref(channelFilter), "") : ssrLooseEqual(unref(channelFilter), "")) ? " selected" : ""}>Semua channel</option><!--[-->`);
			ssrRenderList(unref(channelOptions), (option) => {
				_push(`<option${ssrRenderAttr("value", option)} data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(channelFilter)) ? ssrLooseContain(unref(channelFilter), option) : ssrLooseEqual(unref(channelFilter), option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
			});
			_push(`<!--]--></select></label><label class="grid gap-2 text-sm" data-v-368d1170><span class="text-xs uppercase tracking-[0.2em] text-slate-400" data-v-368d1170>Package ID</span><select class="rounded-full border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white outline-none"${ssrIncludeBooleanAttr(!unref(eventFilter) || unref(packageLoading)) ? " disabled" : ""} data-v-368d1170><option value=""${ssrIncludeBooleanAttr(unref(packageLoading)) ? " disabled" : ""} data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(packageIdFilter)) ? ssrLooseContain(unref(packageIdFilter), "") : ssrLooseEqual(unref(packageIdFilter), "")) ? " selected" : ""}>${ssrInterpolate(unref(packageLoading) ? "Memuat package..." : "Semua package")}</option><!--[-->`);
			ssrRenderList(unref(packageOptions), (option) => {
				_push(`<option${ssrRenderAttr("value", option.id)} data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(packageIdFilter)) ? ssrLooseContain(unref(packageIdFilter), option.id) : ssrLooseEqual(unref(packageIdFilter), option.id)) ? " selected" : ""}>${ssrInterpolate(option.name)}</option>`);
			});
			_push(`<!--]--></select></label><div class="flex items-end gap-2" data-v-368d1170><button${ssrIncludeBooleanAttr(unref(loading) || !unref(hasActiveFilters)) ? " disabled" : ""} class="rounded-full border border-white/20 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" data-v-368d1170> Reset </button></div><div class="sm:col-span-6 flex flex-wrap gap-2" data-v-368d1170><button class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10" data-v-368d1170> Hari ini </button><button class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10" data-v-368d1170> 7 hari </button><button class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10" data-v-368d1170> 30 hari </button><button class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10" data-v-368d1170> Bulan ini </button></div><p class="text-xs text-slate-400 sm:col-span-6" data-v-368d1170>Filter diterapkan otomatis setelah kamu selesai mengubah pilihan (dengan delay 350ms).</p></div>`);
			if (unref(pending)) {
				_push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4" data-v-368d1170><!--[-->`);
				ssrRenderList(4, (n) => {
					_push(`<div class="h-32 animate-pulse rounded-3xl bg-white/5" data-v-368d1170></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(errorMessage)) _push(`<div class="rounded-3xl border border-rose-400/40 bg-rose-500/10 p-5 text-sm text-rose-100" data-v-368d1170>${ssrInterpolate(unref(errorMessage))}</div>`);
			else {
				_push(`<div class="space-y-6" data-v-368d1170><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4" data-v-368d1170><!--[-->`);
				ssrRenderList(unref(summaryCards), (metric) => {
					_push(`<article class="glass-card rounded-3xl p-5" data-v-368d1170><p class="text-[10px] uppercase tracking-[0.25em] text-slate-400" data-v-368d1170>${ssrInterpolate(metric.label)}</p><p class="mt-3 text-2xl font-black text-white" data-v-368d1170>${ssrInterpolate(metric.value)}</p><p class="mt-2 text-sm text-slate-400" data-v-368d1170>${ssrInterpolate(metric.note)}</p></article>`);
				});
				_push(`<!--]--></div><div class="grid gap-6 xl:grid-cols-2" data-v-368d1170><article class="glass-card rounded-3xl p-5" data-v-368d1170><h2 class="text-lg font-bold" data-v-368d1170>Revenue by status</h2><ul class="mt-4 space-y-3 text-sm text-slate-300" data-v-368d1170><!--[-->`);
				ssrRenderList(unref(byStatus), (item) => {
					_push(`<li class="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0" data-v-368d1170><span data-v-368d1170>${ssrInterpolate(item.label)}</span><strong class="text-white" data-v-368d1170>${ssrInterpolate(formatCurrency(item.amount))}</strong></li>`);
				});
				_push(`<!--]--></ul></article><article class="glass-card rounded-3xl p-5" data-v-368d1170><h2 class="text-lg font-bold" data-v-368d1170>Daily revenue</h2><div class="mt-4 flex min-h-[14rem] items-end gap-2 overflow-x-auto" data-v-368d1170><!--[-->`);
				ssrRenderList(unref(dailyRevenue), (item) => {
					_push(`<div class="daily-chart-column" data-v-368d1170><div class="daily-chart-bar" style="${ssrRenderStyle({ height: `${Math.max(6, item.amount / unref(dailyRevenueMax) * 100)}%` })}"${ssrRenderAttr("title", `${item.date}: ${formatCurrency(item.amount)}`)} data-v-368d1170></div><span class="daily-chart-label" data-v-368d1170>${ssrInterpolate(formatDateShort(item.date))}</span><span class="mt-1 text-[10px] leading-tight text-slate-400" data-v-368d1170>${ssrInterpolate(formatCurrency(item.amount))}</span></div>`);
				});
				_push(`<!--]--></div></article></div><article class="glass-card rounded-3xl p-5" data-v-368d1170><div class="mb-4 flex items-center justify-between gap-3" data-v-368d1170><h2 class="text-lg font-bold" data-v-368d1170>Latest transactions</h2><a${ssrRenderAttr("href", unref(csvUrl))}${ssrRenderAttr("download", unref(csvFileName))} class="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100" data-v-368d1170>Download CSV</a></div><div class="mb-4" data-v-368d1170><label class="grid gap-2 text-sm" data-v-368d1170><span class="text-xs uppercase tracking-[0.2em] text-slate-400" data-v-368d1170>Cari transaksi</span><input${ssrRenderAttr("value", unref(searchTerm))} type="text" placeholder="Cari order, participant, package, channel, status" class="rounded-full border border-white/15 bg-slate-900 px-4 py-2 text-sm text-white outline-none" data-v-368d1170></label></div><div class="mb-2 flex flex-wrap gap-2 text-xs" data-v-368d1170><span class="inline-flex rounded-full border border-emerald-300/30 px-2 py-1 text-emerald-200" data-v-368d1170>Success: Lunas</span><span class="inline-flex rounded-full border border-amber-300/30 px-2 py-1 text-amber-200" data-v-368d1170>Pending/Created</span><span class="inline-flex rounded-full border border-rose-300/30 px-2 py-1 text-rose-200" data-v-368d1170>Failed/Expired</span></div><div class="flex items-center justify-between text-sm text-slate-400 mb-3" data-v-368d1170><span data-v-368d1170>${ssrInterpolate(unref(paginatedTransactions).length)} dari ${ssrInterpolate(unref(filteredTransactions).length)} transaksi</span><label class="flex items-center gap-2" data-v-368d1170><span class="text-xs uppercase tracking-[0.16em] text-slate-500" data-v-368d1170>Per halaman</span><select class="rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white outline-none" data-v-368d1170><option${ssrRenderAttr("value", 10)} data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(itemsPerPage)) ? ssrLooseContain(unref(itemsPerPage), 10) : ssrLooseEqual(unref(itemsPerPage), 10)) ? " selected" : ""}>10</option><option${ssrRenderAttr("value", 20)} data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(itemsPerPage)) ? ssrLooseContain(unref(itemsPerPage), 20) : ssrLooseEqual(unref(itemsPerPage), 20)) ? " selected" : ""}>20</option><option${ssrRenderAttr("value", 50)} data-v-368d1170${ssrIncludeBooleanAttr(Array.isArray(unref(itemsPerPage)) ? ssrLooseContain(unref(itemsPerPage), 50) : ssrLooseEqual(unref(itemsPerPage), 50)) ? " selected" : ""}>50</option></select></label></div><div class="overflow-x-auto" data-v-368d1170><table class="min-w-full text-left text-sm text-slate-300" data-v-368d1170><thead data-v-368d1170><tr class="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-400" data-v-368d1170><th class="py-3 pr-4" data-v-368d1170>Order</th><th class="py-3 pr-4" data-v-368d1170>Participant</th><th class="py-3 pr-4" data-v-368d1170>Package</th><th class="py-3 pr-4" data-v-368d1170>Channel</th><th class="py-3 pr-4" data-v-368d1170>Status</th><th class="py-3 pr-4 text-right" data-v-368d1170>Amount</th></tr></thead><tbody data-v-368d1170><!--[-->`);
				ssrRenderList(unref(paginatedTransactions), (item) => {
					_push(`<tr class="border-b border-white/5 last:border-0" data-v-368d1170><td class="py-3 pr-4 text-white" data-v-368d1170>${ssrInterpolate(item.order_number || item.id)}</td><td class="py-3 pr-4" data-v-368d1170>${ssrInterpolate(item.participant_name || "N/A")}</td><td class="py-3 pr-4" data-v-368d1170>${ssrInterpolate(item.package_name || "N/A")}</td><td class="py-3 pr-4" data-v-368d1170>${ssrInterpolate(item.channel_code || item.provider || "N/A")}</td><td class="py-3 pr-4" data-v-368d1170><span class="${ssrRenderClass([transactionStatusClass(item.transaction_status || item.status || ""), "inline-flex rounded-full px-2 py-1 text-xs font-bold"])}" data-v-368d1170>${ssrInterpolate(item.transaction_status || item.status || "N/A")}</span></td><td class="py-3 pr-4 text-right text-white" data-v-368d1170>${ssrInterpolate(formatCurrency(item.gross_amount || 0))}</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
				if (unref(totalPages) > 1) _push(`<div class="mt-4 flex items-center justify-between" data-v-368d1170><button${ssrIncludeBooleanAttr(unref(currentPage) <= 1) ? " disabled" : ""} class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" data-v-368d1170> Awal </button><div class="flex items-center gap-2" data-v-368d1170><button${ssrIncludeBooleanAttr(unref(currentPage) <= 1) ? " disabled" : ""} class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" data-v-368d1170> Prev </button><span class="text-xs text-slate-300" data-v-368d1170>Page ${ssrInterpolate(unref(currentPage))} / ${ssrInterpolate(unref(totalPages))}</span><button${ssrIncludeBooleanAttr(unref(currentPage) >= unref(totalPages)) ? " disabled" : ""} class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" data-v-368d1170> Next </button></div><button${ssrIncludeBooleanAttr(unref(currentPage) >= unref(totalPages)) ? " disabled" : ""} class="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50" data-v-368d1170> Akhir </button></div>`);
				else _push(`<!---->`);
				_push(`</article></div>`);
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
var reports_default = /*#__PURE__*/ _plugin_vue_export_helper_default(reports_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-368d1170"]]);

export { reports_default as default };;globalThis.__timing__.logEnd('Load chunks/build/reports-Ikkwp3U6');
//# sourceMappingURL=reports-Ikkwp3U6.mjs.map
