import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { _ as _plugin_vue_export_helper_default, a as useAsyncData, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { u as useAdminContent } from './useAdminContent-GiNaIDgL.mjs';
import { defineComponent, withAsyncContext, computed, ref, reactive, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import 'nostics';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'nostics/formatters/ansi';
import 'vue-router';
import '@vue/shared';

//#region app/pages/admin/packages.vue?vue&type=script&setup=true&lang.ts
var packages_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "packages",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Manage Delegate Packages | IWBIF 2026" });
		const { getEvents, getEventDelegatePackages } = useEvent();
		useAdminContent();
		const { data: eventResponse } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-package-events", () => getEvents(1, 100))), __temp = await __temp, __restore(), __temp);
		const events = computed(() => eventResponse.value?.data || []);
		const selectedEventId = ref(events.value[0]?.id || "");
		const packages = ref([]);
		const loading = ref(false);
		const saving = ref(false);
		const deletingId = ref("");
		const editingId = ref("");
		const feedback = ref("");
		const feedbackTone = ref("success");
		const emptyForm = () => ({
			code: "",
			name: "",
			currency: "USD",
			amount: 0,
			payment_amount_idr: null,
			is_active: true
		});
		const form = reactive(emptyForm());
		const apiError = (error) => {
			const value = error;
			return value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : "The package could not be saved.");
		};
		const loadPackages = async () => {
			if (!selectedEventId.value) {
				packages.value = [];
				return;
			}
			loading.value = true;
			feedback.value = "";
			try {
				packages.value = (await getEventDelegatePackages(selectedEventId.value)).data || [];
			} catch (error) {
				feedbackTone.value = "error";
				feedback.value = apiError(error);
			} finally {
				loading.value = false;
			}
		};
		const resetForm = () => {
			editingId.value = "";
			Object.assign(form, emptyForm());
		};
		watch(selectedEventId, async () => {
			resetForm();
			await loadPackages();
		});
		if (selectedEventId.value) [__temp, __restore] = withAsyncContext(() => loadPackages()), await __temp, __restore();
		const money = (amount, currency) => new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency || "USD"
		}).format(amount || 0);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-1cc14031><div class="flex flex-wrap items-end justify-between gap-5" data-v-1cc14031><div data-v-1cc14031><p class="text-sm uppercase tracking-[.3em] text-amber-200" data-v-1cc14031>Organizer catalog</p><h1 class="mt-3 text-3xl font-black sm:text-4xl" data-v-1cc14031>Manage Delegate Packages</h1><p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300" data-v-1cc14031>Create, update, activate, or remove Delegate packages. Set the USD price and the corresponding DOKU payment amount in IDR.</p></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/dashboard",
				class: "rounded-full border border-white/20 px-5 py-3 text-sm font-semibold"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Back to dashboard`);
					else return [createTextVNode("Back to dashboard")];
				}),
				_: 1
			}, _parent));
			_push(`</div><label class="mt-8 block max-w-md text-sm text-slate-300" data-v-1cc14031><span class="mb-2 block" data-v-1cc14031>Event</span><select class="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-300/50" data-v-1cc14031><!--[-->`);
			ssrRenderList(unref(events), (event) => {
				_push(`<option${ssrRenderAttr("value", event.id)} data-v-1cc14031${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEventId)) ? ssrLooseContain(unref(selectedEventId), event.id) : ssrLooseEqual(unref(selectedEventId), event.id)) ? " selected" : ""}>${ssrInterpolate(event.name)}</option>`);
			});
			_push(`<!--]--></select></label>`);
			if (unref(feedback)) _push(`<div class="${ssrRenderClass([unref(feedbackTone) === "error" ? "border-red-400/30 bg-red-950/30 text-red-100" : "border-emerald-300/30 bg-emerald-950/30 text-emerald-100", "mt-5 rounded-2xl border p-4 text-sm"])}" data-v-1cc14031>${ssrInterpolate(unref(feedback))}</div>`);
			else _push(`<!---->`);
			_push(`<div class="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem]" data-v-1cc14031><div data-v-1cc14031>`);
			if (unref(loading)) _push(`<p class="glass-card rounded-3xl p-6 text-slate-300" data-v-1cc14031>Loading Delegate packages...</p>`);
			else if (!unref(packages).length) _push(`<div class="glass-card rounded-3xl p-6 text-slate-300" data-v-1cc14031>No Delegate package has been created for this event.</div>`);
			else {
				_push(`<div class="grid gap-4 md:grid-cols-2" data-v-1cc14031><!--[-->`);
				ssrRenderList(unref(packages), (item) => {
					_push(`<article class="glass-card rounded-3xl p-5" data-v-1cc14031><div class="flex items-center justify-between gap-3" data-v-1cc14031><span class="text-xs font-bold uppercase tracking-[.2em] text-amber-200" data-v-1cc14031>${ssrInterpolate(item.code)}</span><span class="${ssrRenderClass([item.is_active ? "bg-emerald-300/10 text-emerald-200" : "bg-white/10 text-slate-400", "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em]"])}" data-v-1cc14031>${ssrInterpolate(item.is_active ? "Active" : "Inactive")}</span></div><h2 class="mt-4 text-xl font-bold" data-v-1cc14031>${ssrInterpolate(item.name)}</h2><div class="mt-4 flex flex-wrap items-end justify-between gap-3" data-v-1cc14031><p class="text-2xl font-black text-amber-100" data-v-1cc14031>${ssrInterpolate(money(item.amount, item.currency))}</p>`);
					if (item.payment_amount_idr) _push(`<p class="text-sm text-slate-400" data-v-1cc14031>Payment: ${ssrInterpolate(money(item.payment_amount_idr, "IDR"))}</p>`);
					else _push(`<!---->`);
					_push(`</div><div class="mt-5 flex flex-wrap gap-3" data-v-1cc14031><button class="rounded-full border border-amber-300/40 px-5 py-2 text-sm font-semibold text-amber-100" data-v-1cc14031>Edit</button><button class="rounded-full border border-red-300/30 px-5 py-2 text-sm font-semibold text-red-200 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(deletingId) === item.id) ? " disabled" : ""} data-v-1cc14031>${ssrInterpolate(unref(deletingId) === item.id ? "Removing..." : "Remove")}</button></div></article>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div><form class="glass-card h-fit rounded-[2rem] p-5 sm:p-6" data-v-1cc14031><div class="flex items-center justify-between gap-3" data-v-1cc14031><h2 class="text-xl font-bold" data-v-1cc14031>${ssrInterpolate(unref(editingId) ? "Update package" : "New package")}</h2>`);
			if (unref(editingId)) _push(`<button type="button" class="text-sm text-slate-400" data-v-1cc14031>Cancel</button>`);
			else _push(`<!---->`);
			_push(`</div><div class="mt-5 space-y-4" data-v-1cc14031><label class="field" data-v-1cc14031><span data-v-1cc14031>Package name</span><input${ssrRenderAttr("value", unref(form).name)} required placeholder="Package A - USD500" data-v-1cc14031></label><label class="field" data-v-1cc14031><span data-v-1cc14031>Code</span><input${ssrRenderAttr("value", unref(form).code)} required maxlength="30" placeholder="A" data-v-1cc14031></label><div class="grid grid-cols-2 gap-3" data-v-1cc14031><label class="field" data-v-1cc14031><span data-v-1cc14031>Price</span><input${ssrRenderAttr("value", unref(form).amount)} type="number" min="0.01" step="0.01" required data-v-1cc14031></label><label class="field" data-v-1cc14031><span data-v-1cc14031>Currency</span><input${ssrRenderAttr("value", unref(form).currency)} maxlength="3" required data-v-1cc14031></label></div><label class="field" data-v-1cc14031><span data-v-1cc14031>Payment amount (IDR)</span><input${ssrRenderAttr("value", unref(form).payment_amount_idr)} type="number" min="1" step="1" placeholder="8000000" data-v-1cc14031></label><label class="flex items-center gap-3 text-sm text-slate-300" data-v-1cc14031><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 accent-amber-300" data-v-1cc14031>Available for purchase</label><button class="w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(saving) || !unref(selectedEventId)) ? " disabled" : ""} data-v-1cc14031>${ssrInterpolate(unref(saving) ? "Saving..." : unref(editingId) ? "Update package" : "Create package")}</button></div></form></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/packages.vue
var _sfc_setup = packages_vue_vue_type_script_setup_true_lang_default.setup;
packages_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/packages.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var packages_default = /*#__PURE__*/ _plugin_vue_export_helper_default(packages_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-1cc14031"]]);

export { packages_default as default };
//# sourceMappingURL=packages-DIlv162w.mjs.map
