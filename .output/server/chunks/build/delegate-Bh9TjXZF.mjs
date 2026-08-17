import { _ as _plugin_vue_export_helper_default, a as useSeoMeta$1, f as useRoute, b as useAsyncData } from '../virtual/entry.mjs';
import { u as useParticipant } from './useParticipant-CPMevOwd.mjs';
import { u as useRegistration } from './useRegistration-CYl8EOu6.mjs';
import { u as useEvent } from './useEvent-D4WcF23a.mjs';
import { defineComponent, reactive, withAsyncContext, watchEffect, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderDynamicModel, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual, ssrLooseContain } from 'vue/server-renderer';
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

//#region app/pages/register/delegate.vue?vue&type=script&setup=true&lang.ts
var delegate_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "delegate",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({
			title: "Delegate Registration | IWBIF 2026",
			description: "Complete the official IWBIF 2026 delegate registration."
		});
		const route = useRoute();
		const { getEvents, getEventDelegatePackages, getEventActivities } = useEvent();
		useParticipant();
		useRegistration();
		const identityFields = [
			{
				key: "full_name",
				label: "Full name",
				autocomplete: "name"
			},
			{
				key: "title",
				label: "Title"
			},
			{
				key: "job_title",
				label: "Job title"
			},
			{
				key: "company_organization",
				label: "Company / organization",
				autocomplete: "organization"
			},
			{
				key: "nationality",
				label: "Nationality"
			},
			{
				key: "country",
				label: "Country"
			},
			{
				key: "business_sector",
				label: "Business sector"
			},
			{
				key: "email",
				label: "Email",
				type: "email",
				autocomplete: "email"
			},
			{
				key: "mobile_whatsapp",
				label: "Mobile / WhatsApp",
				type: "tel"
			},
			{
				key: "company_website",
				label: "Company website",
				type: "url"
			},
			{
				key: "linkedin",
				label: "LinkedIn",
				type: "url"
			}
		];
		const form = reactive({
			event_id: "",
			delegate_package_id: typeof route.query.package === "string" ? route.query.package : "",
			full_name: "",
			job_title: "",
			company_organization: "",
			nationality: "",
			title: "",
			business_sector: "",
			country: "",
			email: "",
			mobile_whatsapp: "",
			company_website: "",
			linkedin: "",
			company_address: "",
			participation_categories: "",
			products_services: "",
			looking_for: "",
			preferred_countries: "",
			business_objectives: "",
			activity_ids: [],
			room_preference: "twin-sharing",
			preferred_roommate: "",
			arrival_date: "2026-10-14",
			departure_date: "2026-10-17",
			flight_number: "",
			airport: "",
			need_airport_pickup: false,
			dietary_restrictions: "",
			medical_condition: "",
			special_assistance: "",
			preferred_payment_method: "doku",
			need_official_invoice: false,
			tax_id: "",
			information_accuracy_confirmed: false,
			terms_accepted: false,
			business_matching_data_consent: false
		});
		const { data: options, pending, error: optionsError } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("iwbif-registration-options", async () => {
			const event = (await getEvents(1, 1)).data[0];
			if (!event) throw new Error("No IWBIF event is currently published.");
			const [packageResponse, activityResponse] = await Promise.all([getEventDelegatePackages(event.id), getEventActivities(event.id)]);
			return {
				event,
				packages: packageResponse.data.filter((item) => item.is_active),
				activities: activityResponse.data.filter((item) => item.is_active !== false)
			};
		})), __temp = await __temp, __restore(), __temp);
		watchEffect(() => {
			if (options.value?.event.id) form.event_id = options.value.event.id;
		});
		const packages = computed(() => options.value?.packages ?? []);
		const activities = computed(() => options.value?.activities ?? []);
		const submitting = ref(false);
		const feedback = ref("");
		const success = ref(false);
		const money = (amount, currency) => new Intl.NumberFormat("en-US", {
			style: "currency",
			currency
		}).format(amount);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "register-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-1096ba28><p class="text-sm uppercase tracking-[.35em] text-amber-200" data-v-1096ba28>Delegate Registration</p><h1 class="mt-4 text-4xl font-black sm:text-5xl" data-v-1096ba28>Register for IWBIF 2026</h1><p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base" data-v-1096ba28>Complete every required section. Your registration is saved as a draft before payment.</p>`);
			if (unref(pending)) _push(`<div class="mt-10 h-60 animate-pulse rounded-[2rem] bg-white/5" data-v-1096ba28></div>`);
			else if (unref(optionsError)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100" data-v-1096ba28>${ssrInterpolate(unref(optionsError).message)}</div>`);
			else {
				_push(`<form class="mt-10 space-y-7" data-v-1096ba28><fieldset class="card" data-v-1096ba28><legend data-v-1096ba28>1. Personal and company information</legend><div class="grid gap-4 md:grid-cols-2" data-v-1096ba28><!--[-->`);
				ssrRenderList(identityFields, (field) => {
					_push(`<label class="label" data-v-1096ba28><span data-v-1096ba28>${ssrInterpolate(field.label)} *</span><input${ssrRenderDynamicModel(field.type || "text", unref(form)[field.key], null)}${ssrRenderAttr("type", field.type || "text")}${ssrRenderAttr("autocomplete", field.autocomplete)} required class="field" data-v-1096ba28></label>`);
				});
				_push(`<!--]--><label class="label md:col-span-2" data-v-1096ba28><span data-v-1096ba28>Company address *</span><textarea required class="field" rows="3" data-v-1096ba28>${ssrInterpolate(unref(form).company_address)}</textarea></label></div></fieldset><fieldset class="card" data-v-1096ba28><legend data-v-1096ba28>2. Delegate package *</legend><div class="grid gap-4 md:grid-cols-2" data-v-1096ba28><!--[-->`);
				ssrRenderList(unref(packages), (item) => {
					_push(`<label class="${ssrRenderClass([unref(form).delegate_package_id === item.id ? "selected" : "", "choice"])}" data-v-1096ba28><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).delegate_package_id, item.id)) ? " checked" : ""} class="sr-only" type="radio"${ssrRenderAttr("value", item.id)} required data-v-1096ba28><span class="text-xs uppercase tracking-widest text-amber-200" data-v-1096ba28>${ssrInterpolate(item.code)}</span><strong class="mt-2 block text-xl" data-v-1096ba28>${ssrInterpolate(item.name)}</strong><span class="mt-2 block" data-v-1096ba28>${ssrInterpolate(money(item.amount ?? item.price, item.currency))}</span></label>`);
				});
				_push(`<!--]--></div></fieldset><fieldset class="card" data-v-1096ba28><legend data-v-1096ba28>3. Participation and activities</legend><label class="label" data-v-1096ba28><span data-v-1096ba28>Participation categories * (comma separated)</span><input${ssrRenderAttr("value", unref(form).participation_categories)} required class="field" placeholder="Women Entrepreneur, Buyer" data-v-1096ba28></label><div class="mt-5 grid gap-3 md:grid-cols-2" data-v-1096ba28><!--[-->`);
				ssrRenderList(unref(activities), (item) => {
					_push(`<label class="choice flex gap-3" data-v-1096ba28><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).activity_ids) ? ssrLooseContain(unref(form).activity_ids, item.id) : unref(form).activity_ids) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", item.id)} class="accent-amber-300" data-v-1096ba28><span data-v-1096ba28>${ssrInterpolate(item.name)}</span></label>`);
				});
				_push(`<!--]--></div>`);
				if (!unref(activities).length) _push(`<p class="mt-3 text-sm text-slate-400" data-v-1096ba28>No active activities are currently published.</p>`);
				else _push(`<!---->`);
				_push(`</fieldset><fieldset class="card" data-v-1096ba28><legend data-v-1096ba28>4. Business matching</legend><div class="grid gap-4 md:grid-cols-2" data-v-1096ba28><label class="label md:col-span-2" data-v-1096ba28><span data-v-1096ba28>Products / services *</span><textarea required class="field" rows="3" data-v-1096ba28>${ssrInterpolate(unref(form).products_services)}</textarea></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Looking for * (comma separated)</span><input${ssrRenderAttr("value", unref(form).looking_for)} required class="field" placeholder="Buyers, Investors" data-v-1096ba28></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Preferred countries * (comma separated)</span><input${ssrRenderAttr("value", unref(form).preferred_countries)} required class="field" data-v-1096ba28></label><label class="label md:col-span-2" data-v-1096ba28><span data-v-1096ba28>Business objectives *</span><textarea required class="field" rows="3" data-v-1096ba28>${ssrInterpolate(unref(form).business_objectives)}</textarea></label></div></fieldset><fieldset class="card" data-v-1096ba28><legend data-v-1096ba28>5. Travel and delegate requirements</legend><div class="grid gap-4 md:grid-cols-2" data-v-1096ba28><label class="label" data-v-1096ba28><span data-v-1096ba28>Room preference *</span><select required class="field" data-v-1096ba28><option value="twin-sharing" data-v-1096ba28${ssrIncludeBooleanAttr(Array.isArray(unref(form).room_preference) ? ssrLooseContain(unref(form).room_preference, "twin-sharing") : ssrLooseEqual(unref(form).room_preference, "twin-sharing")) ? " selected" : ""}>Twin sharing</option><option value="single" data-v-1096ba28${ssrIncludeBooleanAttr(Array.isArray(unref(form).room_preference) ? ssrLooseContain(unref(form).room_preference, "single") : ssrLooseEqual(unref(form).room_preference, "single")) ? " selected" : ""}>Single room</option></select></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Preferred roommate</span><input${ssrRenderAttr("value", unref(form).preferred_roommate)} class="field" data-v-1096ba28></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Arrival date *</span><input${ssrRenderAttr("value", unref(form).arrival_date)} type="date" required class="field" data-v-1096ba28></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Departure date *</span><input${ssrRenderAttr("value", unref(form).departure_date)} type="date" required class="field" data-v-1096ba28></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Airport *</span><input${ssrRenderAttr("value", unref(form).airport)} required class="field" data-v-1096ba28></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Flight number</span><input${ssrRenderAttr("value", unref(form).flight_number)} class="field" data-v-1096ba28></label><label class="check" data-v-1096ba28><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).need_airport_pickup) ? ssrLooseContain(unref(form).need_airport_pickup, null) : unref(form).need_airport_pickup) ? " checked" : ""} type="checkbox" data-v-1096ba28> Airport pickup required</label><label class="label" data-v-1096ba28><span data-v-1096ba28>Dietary restrictions</span><input${ssrRenderAttr("value", unref(form).dietary_restrictions)} class="field" data-v-1096ba28></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Medical condition</span><input${ssrRenderAttr("value", unref(form).medical_condition)} class="field" data-v-1096ba28></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Special assistance</span><input${ssrRenderAttr("value", unref(form).special_assistance)} class="field" data-v-1096ba28></label></div></fieldset><fieldset class="card" data-v-1096ba28><legend data-v-1096ba28>6. Payment and consent</legend><div class="grid gap-4 md:grid-cols-2" data-v-1096ba28><label class="label" data-v-1096ba28><span data-v-1096ba28>Preferred payment method *</span><select required class="field" data-v-1096ba28><option value="doku" data-v-1096ba28${ssrIncludeBooleanAttr(Array.isArray(unref(form).preferred_payment_method) ? ssrLooseContain(unref(form).preferred_payment_method, "doku") : ssrLooseEqual(unref(form).preferred_payment_method, "doku")) ? " selected" : ""}>Online payment (DOKU)</option><option value="bank-transfer" data-v-1096ba28${ssrIncludeBooleanAttr(Array.isArray(unref(form).preferred_payment_method) ? ssrLooseContain(unref(form).preferred_payment_method, "bank-transfer") : ssrLooseEqual(unref(form).preferred_payment_method, "bank-transfer")) ? " selected" : ""}>Bank transfer</option></select></label><label class="label" data-v-1096ba28><span data-v-1096ba28>Tax ID</span><input${ssrRenderAttr("value", unref(form).tax_id)} class="field" data-v-1096ba28></label></div><div class="mt-5 space-y-3" data-v-1096ba28><label class="check" data-v-1096ba28><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).need_official_invoice) ? ssrLooseContain(unref(form).need_official_invoice, null) : unref(form).need_official_invoice) ? " checked" : ""} type="checkbox" data-v-1096ba28> I need an official invoice</label><label class="check" data-v-1096ba28><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).information_accuracy_confirmed) ? ssrLooseContain(unref(form).information_accuracy_confirmed, null) : unref(form).information_accuracy_confirmed) ? " checked" : ""} required type="checkbox" data-v-1096ba28> I confirm that the information is accurate *</label><label class="check" data-v-1096ba28><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).terms_accepted) ? ssrLooseContain(unref(form).terms_accepted, null) : unref(form).terms_accepted) ? " checked" : ""} required type="checkbox" data-v-1096ba28> I accept the Terms and Conditions *</label><label class="check" data-v-1096ba28><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).business_matching_data_consent) ? ssrLooseContain(unref(form).business_matching_data_consent, null) : unref(form).business_matching_data_consent) ? " checked" : ""} required type="checkbox" data-v-1096ba28> I consent to business matching data processing *</label></div></fieldset>`);
				if (unref(feedback)) _push(`<div class="${ssrRenderClass([unref(success) ? "border-emerald-300/30 bg-emerald-950/30" : "border-red-300/30 bg-red-950/30", "rounded-2xl border p-5"])}" data-v-1096ba28>${ssrInterpolate(unref(feedback))}</div>`);
				else _push(`<!---->`);
				_push(`<div class="submit-row" data-v-1096ba28><button class="rounded-full bg-amber-300 px-7 py-3 font-semibold text-slate-950 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(submitting) || !unref(form).delegate_package_id || !unref(form).activity_ids.length) ? " disabled" : ""} data-v-1096ba28>${ssrInterpolate(unref(submitting) ? "Submitting…" : "Create Registration")}</button></div></form>`);
			}
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/register/delegate.vue
var _sfc_setup = delegate_vue_vue_type_script_setup_true_lang_default.setup;
delegate_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register/delegate.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var delegate_default = /*#__PURE__*/ _plugin_vue_export_helper_default(delegate_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-1096ba28"]]);

export { delegate_default as default };
//# sourceMappingURL=delegate-Bh9TjXZF.mjs.map
