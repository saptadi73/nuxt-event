globalThis.__timing__.logStart('Load chunks/build/register-CBri3I9a');import { a as useSeoMeta$1, e as useRoute, b as useAsyncData, N as NuxtLink, c as useNuxtApp } from '../virtual/entry.mjs';
import { u as useParticipant } from './useParticipant-CPMevOwd.mjs';
import { u as useEvent } from './useEvent-Cd-tMHNN.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { defineComponent, ref, reactive, withAsyncContext, computed, watchEffect, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual, ssrLooseContain, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/composables/useRegistration.ts
function useRegistration() {
	const api = useNuxtApp().$api;
	const createRegistration = (payload) => api("/registrations", {
		method: "POST",
		body: payload
	});
	const getRegistration = (registrationId) => api(`/registrations/${registrationId}`);
	return {
		createRegistration,
		getRegistration
	};
}
//#endregion
//#region app/pages/register.vue?vue&type=script&setup=true&lang.ts
var register_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "register",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({
			title: "Register | ASEAN AI for Education Summit 2026",
			description: "Create your participant registration, select a ticket, and choose a workshop interest."
		});
		const route = useRoute();
		useParticipant();
		useRegistration();
		const { getEvents, getEventTicketTypes, getEventWorkshopTracks } = useEvent();
		const submitting = ref(false);
		const feedback = ref("");
		const success = ref(false);
		const form = reactive({
			full_name: "",
			organization_name: "",
			biography: "",
			event_id: "",
			ticket_type_id: typeof route.query.ticket === "string" ? route.query.ticket : "",
			workshop_track_id: "",
			dietary_preference: "",
			accessibility_requirements: "",
			emergency_contact_name: "",
			emergency_contact_phone: "",
			privacy_consent: false,
			directory_consent: false,
			code_of_conduct_consent: false
		});
		const { data: options, pending: loadingOptions, error: optionsError } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("registration-options", async () => {
			const event = (await getEvents(1, 1)).data[0];
			if (!event?.slug) throw new Error("Event not found");
			const [ticketResponse, trackResponse] = await Promise.all([getEventTicketTypes(event.slug), getEventWorkshopTracks(event.slug)]);
			return {
				event,
				tickets: ticketResponse.data.filter((item) => item.is_active),
				tracks: trackResponse.data
			};
		})), __temp = await __temp, __restore(), __temp);
		const tickets = computed(() => options.value?.tickets ?? []);
		const tracks = computed(() => options.value?.tracks ?? []);
		watchEffect(() => {
			if (options.value?.event.id) form.event_id = options.value.event.id;
		});
		const formatPrice = (price, currency) => new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: 0
		}).format(price);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8" }, _attrs))} data-v-00b539e5><p class="text-sm uppercase tracking-[.35em] text-cyan-200" data-v-00b539e5>Participant Registration</p><h1 class="mt-4 max-w-4xl text-5xl font-black" data-v-00b539e5>Join the ASEAN AI for Education Summit 2026</h1><p class="mt-4 max-w-3xl text-lg leading-8 text-slate-300" data-v-00b539e5>Complete your professional profile, choose your ticket and workshop interest, then submit your registration draft.</p>`);
			if (unref(loadingOptions)) {
				_push(`<div class="mt-10 grid gap-5" data-v-00b539e5><!--[-->`);
				ssrRenderList(3, (n) => {
					_push(`<div class="h-40 animate-pulse rounded-[2rem] bg-white/5" data-v-00b539e5></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (unref(optionsError)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100" data-v-00b539e5>Registration options could not be loaded from the event backend.</div>`);
			else {
				_push(`<form class="mt-10 space-y-7" data-v-00b539e5><fieldset class="glass-card rounded-[2rem] p-6 sm:p-8" data-v-00b539e5><legend class="px-2 text-xl font-bold" data-v-00b539e5>1. Professional profile</legend><div class="mt-4 grid gap-5 md:grid-cols-2" data-v-00b539e5><label class="grid gap-2" data-v-00b539e5><span class="text-sm text-slate-300" data-v-00b539e5>Full name *</span><input${ssrRenderAttr("value", unref(form).full_name)} required minlength="2" autocomplete="name" class="field" data-v-00b539e5></label><label class="grid gap-2" data-v-00b539e5><span class="text-sm text-slate-300" data-v-00b539e5>Organization</span><input${ssrRenderAttr("value", unref(form).organization_name)} autocomplete="organization" class="field" data-v-00b539e5></label></div><label class="mt-5 grid gap-2" data-v-00b539e5><span class="text-sm text-slate-300" data-v-00b539e5>Professional biography</span><textarea rows="4" class="field" placeholder="Introduce your experience, current work, and AI interests." data-v-00b539e5>${ssrInterpolate(unref(form).biography)}</textarea></label></fieldset><fieldset class="glass-card rounded-[2rem] p-6 sm:p-8" data-v-00b539e5><legend class="px-2 text-xl font-bold" data-v-00b539e5>2. Select a ticket *</legend><div class="mt-4 grid gap-4 md:grid-cols-2" data-v-00b539e5><!--[-->`);
				ssrRenderList(unref(tickets), (ticket) => {
					_push(`<label class="${ssrRenderClass([unref(form).ticket_type_id === ticket.id ? "border-cyan-300 bg-cyan-300/10" : "border-white/10 bg-white/5", "cursor-pointer rounded-3xl border p-5 transition"])}" data-v-00b539e5><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).ticket_type_id, ticket.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", ticket.id)} class="sr-only" required data-v-00b539e5><span class="text-xs uppercase tracking-[.2em] text-cyan-200" data-v-00b539e5>${ssrInterpolate(ticket.code)}</span><span class="mt-2 flex items-center justify-between gap-4" data-v-00b539e5><strong class="text-xl" data-v-00b539e5>${ssrInterpolate(ticket.name)}</strong><strong data-v-00b539e5>${ssrInterpolate(formatPrice(ticket.price, ticket.currency))}</strong></span><span class="mt-3 block text-sm leading-6 text-slate-400" data-v-00b539e5>${ssrInterpolate(ticket.description)}</span><span class="mt-3 block text-xs text-slate-500" data-v-00b539e5>Capacity ${ssrInterpolate(ticket.capacity)}</span></label>`);
				});
				_push(`<!--]--></div></fieldset><fieldset class="glass-card rounded-[2rem] p-6 sm:p-8" data-v-00b539e5><legend class="px-2 text-xl font-bold" data-v-00b539e5>3. Workshop interest</legend><p class="mt-3 text-sm text-slate-400" data-v-00b539e5>Your preference helps the organizer plan teams. Final allocation follows capacity and confirmation.</p><div class="mt-5 grid gap-3" data-v-00b539e5><!--[-->`);
				ssrRenderList(unref(tracks), (track) => {
					_push(`<label class="${ssrRenderClass([unref(form).workshop_track_id === track.id ? "border-orange-300/60 bg-orange-300/10" : "border-white/10 bg-white/5", "flex cursor-pointer gap-4 rounded-2xl border p-4"])}" data-v-00b539e5><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).workshop_track_id, track.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", track.id)} class="mt-1 accent-orange-300" data-v-00b539e5><span data-v-00b539e5><strong data-v-00b539e5>${ssrInterpolate(track.name)}</strong><span class="mt-1 block text-sm leading-6 text-slate-400" data-v-00b539e5>${ssrInterpolate(track.description)}</span></span></label>`);
				});
				_push(`<!--]--></div></fieldset><fieldset class="glass-card rounded-[2rem] p-6 sm:p-8" data-v-00b539e5><legend class="px-2 text-xl font-bold" data-v-00b539e5>4. Participant requirements</legend><div class="mt-4 grid gap-5 md:grid-cols-2" data-v-00b539e5><label class="grid gap-2" data-v-00b539e5><span class="text-sm text-slate-300" data-v-00b539e5>Dietary preference</span><input${ssrRenderAttr("value", unref(form).dietary_preference)} class="field" placeholder="Vegetarian, halal, allergies..." data-v-00b539e5></label><label class="grid gap-2" data-v-00b539e5><span class="text-sm text-slate-300" data-v-00b539e5>Accessibility requirements</span><input${ssrRenderAttr("value", unref(form).accessibility_requirements)} class="field" placeholder="Tell us how we can support you" data-v-00b539e5></label><label class="grid gap-2" data-v-00b539e5><span class="text-sm text-slate-300" data-v-00b539e5>Emergency contact name</span><input${ssrRenderAttr("value", unref(form).emergency_contact_name)} class="field" data-v-00b539e5></label><label class="grid gap-2" data-v-00b539e5><span class="text-sm text-slate-300" data-v-00b539e5>Emergency contact phone</span><input${ssrRenderAttr("value", unref(form).emergency_contact_phone)} type="tel" class="field" data-v-00b539e5></label></div></fieldset><fieldset class="glass-card rounded-[2rem] p-6 sm:p-8" data-v-00b539e5><legend class="px-2 text-xl font-bold" data-v-00b539e5>5. Consent and review</legend><div class="mt-4 space-y-4" data-v-00b539e5><label class="flex gap-3 text-sm leading-6 text-slate-300" data-v-00b539e5><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).privacy_consent) ? ssrLooseContain(unref(form).privacy_consent, null) : unref(form).privacy_consent) ? " checked" : ""} type="checkbox" required class="mt-1 h-4 w-4 accent-cyan-300" data-v-00b539e5><span data-v-00b539e5>I have read and accept the `);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/privacy",
					class: "text-cyan-200 underline"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Privacy Policy`);
						else return [createTextVNode("Privacy Policy")];
					}),
					_: 1
				}, _parent));
				_push(` and `);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/terms",
					class: "text-cyan-200 underline"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Terms and Conditions`);
						else return [createTextVNode("Terms and Conditions")];
					}),
					_: 1
				}, _parent));
				_push(`.</span></label><label class="flex gap-3 text-sm leading-6 text-slate-300" data-v-00b539e5><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).directory_consent) ? ssrLooseContain(unref(form).directory_consent, null) : unref(form).directory_consent) ? " checked" : ""} type="checkbox" class="mt-1 h-4 w-4 accent-cyan-300" data-v-00b539e5><span data-v-00b539e5>I consent to showing my approved professional information in the authenticated participant directory.</span></label><label class="flex gap-3 text-sm leading-6 text-slate-300" data-v-00b539e5><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).code_of_conduct_consent) ? ssrLooseContain(unref(form).code_of_conduct_consent, null) : unref(form).code_of_conduct_consent) ? " checked" : ""} type="checkbox" required class="mt-1 h-4 w-4 accent-cyan-300" data-v-00b539e5><span data-v-00b539e5>I agree to follow the `);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/code-of-conduct",
					class: "text-cyan-200 underline"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Code of Conduct`);
						else return [createTextVNode("Code of Conduct")];
					}),
					_: 1
				}, _parent));
				_push(`.</span></label></div></fieldset>`);
				if (unref(feedback)) _push(`<div role="status" class="${ssrRenderClass([unref(success) ? "border-green-400/30 bg-green-950/30 text-green-100" : "border-red-400/30 bg-red-950/30 text-red-100", "rounded-2xl border p-5 text-sm"])}" data-v-00b539e5>${ssrInterpolate(unref(feedback))}</div>`);
				else _push(`<!---->`);
				_push(`<div class="flex flex-wrap items-center justify-between gap-4" data-v-00b539e5><p class="text-sm text-slate-400" data-v-00b539e5>Ticket price is always validated by the backend.</p><button type="submit" class="rounded-full bg-cyan-400 px-7 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(submitting) || !unref(form).ticket_type_id) ? " disabled" : ""} data-v-00b539e5>${ssrInterpolate(unref(submitting) ? "Submitting..." : "Create Registration")}</button></div></form>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/register.vue
var _sfc_setup = register_vue_vue_type_script_setup_true_lang_default.setup;
register_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var register_default = /*#__PURE__*/ _plugin_vue_export_helper_default(register_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-00b539e5"]]);

export { register_default as default };;globalThis.__timing__.logEnd('Load chunks/build/register-CBri3I9a');
//# sourceMappingURL=register-CBri3I9a.mjs.map
