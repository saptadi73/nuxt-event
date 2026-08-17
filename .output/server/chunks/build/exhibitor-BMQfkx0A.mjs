import { _ as _plugin_vue_export_helper_default, a as useSeoMeta$1, b as useAsyncData, c as useNuxtApp } from '../virtual/entry.mjs';
import { u as useEvent } from './useEvent-D4WcF23a.mjs';
import { defineComponent, reactive, ref, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/composables/useExhibitor.ts
function useExhibitor() {
	const api = useNuxtApp().$api;
	const createExhibitor = (eventId, payload) => api(`/events/${eventId}/exhibitors`, {
		method: "POST",
		body: payload
	});
	const getMyExhibitors = (eventId) => api(`/events/${eventId}/exhibitors`);
	const updateExhibitor = (eventId, exhibitorId, payload) => api(`/events/${eventId}/exhibitors/${exhibitorId}`, {
		method: "PUT",
		body: payload
	});
	return {
		createExhibitor,
		getMyExhibitors,
		updateExhibitor
	};
}
//#endregion
//#region app/pages/register/exhibitor.vue?vue&type=script&setup=true&lang.ts
var exhibitor_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "exhibitor",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({
			title: "Exhibitor Registration | IWBIF 2026",
			description: "Register as an exhibitor for IWBIF 2026."
		});
		const { getEvents } = useEvent();
		useExhibitor();
		const form = reactive({
			company_name: "",
			country: "",
			brand: "",
			contact_person: "",
			email: "",
			phone: "",
			products_to_display: "",
			booth_size_requested: "",
			electricity_requirement: "",
			special_requirement: "",
			exhibition_terms_accepted: false
		});
		const submitting = ref(false);
		const feedback = ref("");
		const success = ref(false);
		const { data: eventData, pending, error: fetchError } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("iwbif-exhibitor-event", async () => {
			const event = (await getEvents(1, 1)).data[0];
			if (!event) throw new Error("No IWBIF event is currently published.");
			return event;
		})), __temp = await __temp, __restore(), __temp);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-89adfb28><p class="text-sm uppercase tracking-[.35em] text-cyan-200" data-v-89adfb28>Exhibitor Registration</p><h1 class="mt-4 text-3xl font-black sm:text-5xl" data-v-89adfb28>Register as an exhibitor</h1><p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base" data-v-89adfb28>Submit your company profile and exhibition interest. Your account must already be created before starting.</p>`);
			if (unref(pending)) _push(`<div class="mt-8 h-60 animate-pulse rounded-[2rem] bg-white/5" data-v-89adfb28></div>`);
			else if (unref(fetchError)) _push(`<div class="mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100" data-v-89adfb28>${ssrInterpolate(unref(fetchError).message)}</div>`);
			else {
				_push(`<form class="mt-8 space-y-7" data-v-89adfb28><fieldset class="card" data-v-89adfb28><legend data-v-89adfb28>Company profile</legend><div class="grid gap-4 md:grid-cols-2" data-v-89adfb28><label class="label" data-v-89adfb28><span data-v-89adfb28>Company name *</span><input${ssrRenderAttr("value", unref(form).company_name)} required class="field" data-v-89adfb28></label><label class="label" data-v-89adfb28><span data-v-89adfb28>Country *</span><input${ssrRenderAttr("value", unref(form).country)} required class="field" data-v-89adfb28></label><label class="label" data-v-89adfb28><span data-v-89adfb28>Brand</span><input${ssrRenderAttr("value", unref(form).brand)} class="field" data-v-89adfb28></label><label class="label" data-v-89adfb28><span data-v-89adfb28>Contact person *</span><input${ssrRenderAttr("value", unref(form).contact_person)} required class="field" data-v-89adfb28></label><label class="label" data-v-89adfb28><span data-v-89adfb28>Email *</span><input${ssrRenderAttr("value", unref(form).email)} type="email" required class="field" data-v-89adfb28></label><label class="label" data-v-89adfb28><span data-v-89adfb28>Phone *</span><input${ssrRenderAttr("value", unref(form).phone)} type="tel" required class="field" data-v-89adfb28></label><label class="label md:col-span-2" data-v-89adfb28><span data-v-89adfb28>Products to display *</span><textarea required class="field" rows="3" data-v-89adfb28>${ssrInterpolate(unref(form).products_to_display)}</textarea></label><label class="label" data-v-89adfb28><span data-v-89adfb28>Booth size requested *</span><input${ssrRenderAttr("value", unref(form).booth_size_requested)} required class="field" data-v-89adfb28></label><label class="label" data-v-89adfb28><span data-v-89adfb28>Electricity requirement</span><input${ssrRenderAttr("value", unref(form).electricity_requirement)} class="field" data-v-89adfb28></label><label class="label md:col-span-2" data-v-89adfb28><span data-v-89adfb28>Special requirement</span><textarea class="field" rows="3" data-v-89adfb28>${ssrInterpolate(unref(form).special_requirement)}</textarea></label></div></fieldset><fieldset class="card" data-v-89adfb28><legend data-v-89adfb28>Agreement</legend><label class="check mt-2" data-v-89adfb28><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).exhibition_terms_accepted) ? ssrLooseContain(unref(form).exhibition_terms_accepted, null) : unref(form).exhibition_terms_accepted) ? " checked" : ""} type="checkbox" required data-v-89adfb28><span data-v-89adfb28>I accept the exhibitor terms and conditions.</span></label></fieldset>`);
				if (unref(feedback)) _push(`<div class="${ssrRenderClass([unref(success) ? "border-emerald-300/30 bg-emerald-950/30" : "border-red-300/30 bg-red-950/30", "rounded-2xl border p-5"])}" data-v-89adfb28>${ssrInterpolate(unref(feedback))}</div>`);
				else _push(`<!---->`);
				_push(`<div class="submit-row" data-v-89adfb28><button type="submit" class="rounded-full bg-cyan-300 px-7 py-3 font-semibold text-slate-950 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} data-v-89adfb28>${ssrInterpolate(unref(submitting) ? "Submitting..." : "Create exhibitor registration")}</button></div></form>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/register/exhibitor.vue
var _sfc_setup = exhibitor_vue_vue_type_script_setup_true_lang_default.setup;
exhibitor_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register/exhibitor.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var exhibitor_default = /*#__PURE__*/ _plugin_vue_export_helper_default(exhibitor_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-89adfb28"]]);

export { exhibitor_default as default };
//# sourceMappingURL=exhibitor-BMQfkx0A.mjs.map
