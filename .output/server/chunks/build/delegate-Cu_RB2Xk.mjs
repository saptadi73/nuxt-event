import { _ as _plugin_vue_export_helper_default, b as useRoute, a as useAsyncData } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as useEvent } from './useEvent-B_Up9ELJ.mjs';
import { u as useParticipant } from './useParticipant-CPMevOwd.mjs';
import { u as useRegistration } from './useRegistration-CYl8EOu6.mjs';
import { defineComponent, reactive, withAsyncContext, watchEffect, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderDynamicModel, ssrRenderClass } from 'vue/server-renderer';
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
		const titleOptions = [
			"Mrs.",
			"Ms.",
			"Dr.",
			"Prof.",
			"Mr.",
			"Others"
		];
		const businessSectorOptions = [
			"Agriculture",
			"Food & Beverage",
			"Fashion & Textile",
			"Beauty",
			"Healthcare",
			"Tourism",
			"Education",
			"Technology",
			"Manufacturing",
			"Creative Industry",
			"Trading",
			"Finance",
			"Professional Services",
			"Others"
		];
		const countryOptions = [
			"Malaysia",
			"China",
			"Indonesia",
			"Singapore",
			"Thailand",
			"Cambodia",
			"Vietnam",
			"Philippines",
			"Brunei",
			"Laos",
			"Myanmar",
			"Other"
		];
		const participationCategoryOptions = [
			"Delegate",
			"Speaker",
			"Buyer",
			"Investor",
			"Government",
			"Association",
			"Media",
			"Exhibitor",
			"Sponsor",
			"Other"
		];
		const lookingForOptions = [
			"Buyer",
			"Distributor",
			"Importer",
			"Retailer",
			"Investor",
			"Technology Partner",
			"Joint Venture",
			"Government",
			"Others"
		];
		const preferredCountryOptions = [
			"Indonesia",
			"Malaysia",
			"China",
			"Singapore",
			"Thailand",
			"Vietnam",
			"Cambodia",
			"Philippines",
			"Others"
		];
		const airportOptions = [
			"CGK",
			"HLP",
			"Other"
		];
		const identityFields = [
			{
				key: "full_name",
				label: "Full name",
				autocomplete: "name"
			},
			{
				key: "title",
				label: "Title",
				options: titleOptions
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
				label: "Country",
				options: countryOptions
			},
			{
				key: "business_sector",
				label: "Business sector",
				options: businessSectorOptions
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
				type: "url",
				required: false
			},
			{
				key: "linkedin",
				label: "LinkedIn",
				type: "url",
				required: false
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
			office_phone: "",
			company_website: "",
			linkedin: "",
			company_address: "",
			participation_categories: [],
			presentation_topic: "",
			products_interested: "",
			investment_interest: "",
			products_services: "",
			looking_for: [],
			preferred_countries: [],
			business_objectives: "",
			activity_ids: [],
			room_preference: "Twin Sharing",
			preferred_roommate: "",
			arrival_date: "2026-10-14",
			departure_date: "2026-10-17",
			flight_number: "",
			airport: "",
			need_airport_pickup: null,
			dietary_restrictions: "",
			medical_condition: "",
			special_assistance: "",
			need_official_invoice: null,
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
		computed(() => {
			return (typeof route.query.package === "string" ? route.query.package : "") || sessionStorage.getItem("iwbif-last-delegate-package-id") || "";
		});
		const submitting = ref(false);
		const feedback = ref("");
		const success = ref(false);
		const money = (amount, currency) => new Intl.NumberFormat("en-US", {
			style: "currency",
			currency
		}).format(amount);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "register-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-46f57c02><p class="text-sm uppercase tracking-[.35em] text-amber-200" data-v-46f57c02>Delegate Registration</p><h1 class="mt-4 text-4xl font-black sm:text-5xl" data-v-46f57c02>Register for IWBIF 2026</h1><p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base" data-v-46f57c02>Complete every required section after your package purchase is confirmed. The backend links the paid delegate order to your registration automatically.</p>`);
			if (unref(pending)) _push(`<div class="mt-10 h-60 animate-pulse rounded-[2rem] bg-white/5" data-v-46f57c02></div>`);
			else if (unref(optionsError)) _push(`<div class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100" data-v-46f57c02>${ssrInterpolate(unref(optionsError).message)}</div>`);
			else {
				_push(`<form class="mt-10 space-y-7" data-v-46f57c02><fieldset class="card" data-v-46f57c02><legend data-v-46f57c02>1. Personal and company information</legend><div class="grid gap-4 md:grid-cols-2" data-v-46f57c02><!--[-->`);
				ssrRenderList(identityFields, (field) => {
					_push(`<label class="label" data-v-46f57c02><span data-v-46f57c02>${ssrInterpolate(field.label)}${ssrInterpolate(field.required === false ? "" : " *")}</span>`);
					if (field.options) {
						_push(`<select required class="field" data-v-46f57c02><option value="" disabled data-v-46f57c02${ssrIncludeBooleanAttr(Array.isArray(unref(form)[field.key]) ? ssrLooseContain(unref(form)[field.key], "") : ssrLooseEqual(unref(form)[field.key], "")) ? " selected" : ""}>Select ${ssrInterpolate(field.label.toLowerCase())}</option><!--[-->`);
						ssrRenderList(field.options, (option) => {
							_push(`<option${ssrRenderAttr("value", option)} data-v-46f57c02${ssrIncludeBooleanAttr(Array.isArray(unref(form)[field.key]) ? ssrLooseContain(unref(form)[field.key], option) : ssrLooseEqual(unref(form)[field.key], option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
						});
						_push(`<!--]--></select>`);
					} else _push(`<input${ssrRenderDynamicModel(field.type || "text", unref(form)[field.key], null)}${ssrRenderAttr("type", field.type || "text")}${ssrRenderAttr("autocomplete", field.autocomplete)}${ssrIncludeBooleanAttr(field.required !== false) ? " required" : ""} class="field" data-v-46f57c02>`);
					_push(`</label>`);
				});
				_push(`<!--]--><label class="label" data-v-46f57c02><span data-v-46f57c02>Office phone</span><input${ssrRenderAttr("value", unref(form).office_phone)} type="tel" class="field" data-v-46f57c02></label><label class="label md:col-span-2" data-v-46f57c02><span data-v-46f57c02>Company address *</span><textarea required class="field" rows="3" data-v-46f57c02>${ssrInterpolate(unref(form).company_address)}</textarea></label></div></fieldset><fieldset class="card" data-v-46f57c02><legend data-v-46f57c02>2. Delegate package *</legend><div class="grid gap-4 md:grid-cols-2" data-v-46f57c02><!--[-->`);
				ssrRenderList(unref(packages), (item) => {
					_push(`<label class="${ssrRenderClass([unref(form).delegate_package_id === item.id ? "selected" : "", "choice"])}" data-v-46f57c02><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).delegate_package_id, item.id)) ? " checked" : ""} class="sr-only" type="radio"${ssrRenderAttr("value", item.id)} required data-v-46f57c02><strong class="block text-xl" data-v-46f57c02>${ssrInterpolate(item.name)}</strong><span class="mt-2 block" data-v-46f57c02>${ssrInterpolate(money(item.amount ?? item.price, item.currency))}</span></label>`);
				});
				_push(`<!--]--></div></fieldset><fieldset class="card" data-v-46f57c02><legend data-v-46f57c02>3. Participation and activities</legend><span class="label" data-v-46f57c02>Participation categories *</span><div class="mt-3 grid gap-3 md:grid-cols-2" data-v-46f57c02><!--[-->`);
				ssrRenderList(participationCategoryOptions, (option) => {
					_push(`<label class="choice flex gap-3" data-v-46f57c02><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).participation_categories) ? ssrLooseContain(unref(form).participation_categories, option) : unref(form).participation_categories) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", option)} class="accent-amber-300" data-v-46f57c02><span data-v-46f57c02>${ssrInterpolate(option)}</span></label>`);
				});
				_push(`<!--]--></div><div class="mt-5 grid gap-4 md:grid-cols-2" data-v-46f57c02>`);
				if (unref(form).participation_categories.includes("Speaker")) _push(`<label class="label md:col-span-2" data-v-46f57c02><span data-v-46f57c02>Presentation topic</span><textarea class="field" rows="3" data-v-46f57c02>${ssrInterpolate(unref(form).presentation_topic)}</textarea></label>`);
				else _push(`<!---->`);
				if (unref(form).participation_categories.includes("Buyer")) _push(`<label class="label md:col-span-2" data-v-46f57c02><span data-v-46f57c02>Products interested</span><textarea class="field" rows="3" data-v-46f57c02>${ssrInterpolate(unref(form).products_interested)}</textarea></label>`);
				else _push(`<!---->`);
				if (unref(form).participation_categories.includes("Investor")) _push(`<label class="label md:col-span-2" data-v-46f57c02><span data-v-46f57c02>Investment interest</span><textarea class="field" rows="3" data-v-46f57c02>${ssrInterpolate(unref(form).investment_interest)}</textarea></label>`);
				else _push(`<!---->`);
				_push(`</div><div class="mt-5 grid gap-3 md:grid-cols-2" data-v-46f57c02><!--[-->`);
				ssrRenderList(unref(activities), (item) => {
					_push(`<label class="choice flex gap-3" data-v-46f57c02><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).activity_ids) ? ssrLooseContain(unref(form).activity_ids, item.id) : unref(form).activity_ids) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", item.id)} class="accent-amber-300" data-v-46f57c02><span data-v-46f57c02>${ssrInterpolate(item.name)}</span></label>`);
				});
				_push(`<!--]--></div>`);
				if (!unref(activities).length) _push(`<p class="mt-3 text-sm text-slate-400" data-v-46f57c02>No active activities are currently published.</p>`);
				else _push(`<!---->`);
				_push(`</fieldset><fieldset class="card" data-v-46f57c02><legend data-v-46f57c02>4. Business matching</legend><label class="label" data-v-46f57c02><span data-v-46f57c02>Products / services *</span><textarea required class="field" rows="3" data-v-46f57c02>${ssrInterpolate(unref(form).products_services)}</textarea></label><span class="label mt-5" data-v-46f57c02>Looking for *</span><div class="mt-3 grid gap-3 md:grid-cols-2" data-v-46f57c02><!--[-->`);
				ssrRenderList(lookingForOptions, (option) => {
					_push(`<label class="choice flex gap-3" data-v-46f57c02><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).looking_for) ? ssrLooseContain(unref(form).looking_for, option) : unref(form).looking_for) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", option)} class="accent-amber-300" data-v-46f57c02><span data-v-46f57c02>${ssrInterpolate(option)}</span></label>`);
				});
				_push(`<!--]--></div><span class="label mt-5" data-v-46f57c02>Preferred countries *</span><div class="mt-3 grid gap-3 md:grid-cols-2" data-v-46f57c02><!--[-->`);
				ssrRenderList(preferredCountryOptions, (option) => {
					_push(`<label class="choice flex gap-3" data-v-46f57c02><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).preferred_countries) ? ssrLooseContain(unref(form).preferred_countries, option) : unref(form).preferred_countries) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", option)} class="accent-amber-300" data-v-46f57c02><span data-v-46f57c02>${ssrInterpolate(option)}</span></label>`);
				});
				_push(`<!--]--></div><label class="label mt-5" data-v-46f57c02><span data-v-46f57c02>Business objectives *</span><textarea required class="field" rows="3" data-v-46f57c02>${ssrInterpolate(unref(form).business_objectives)}</textarea></label></fieldset><fieldset class="card" data-v-46f57c02><legend data-v-46f57c02>5. Travel and delegate requirements</legend><div class="grid gap-4 md:grid-cols-2" data-v-46f57c02><label class="label" data-v-46f57c02><span data-v-46f57c02>Room preference *</span><select required class="field" data-v-46f57c02><option value="Twin Sharing" data-v-46f57c02${ssrIncludeBooleanAttr(Array.isArray(unref(form).room_preference) ? ssrLooseContain(unref(form).room_preference, "Twin Sharing") : ssrLooseEqual(unref(form).room_preference, "Twin Sharing")) ? " selected" : ""}>Twin Sharing</option><option value="Single Room (+Supplement)" data-v-46f57c02${ssrIncludeBooleanAttr(Array.isArray(unref(form).room_preference) ? ssrLooseContain(unref(form).room_preference, "Single Room (+Supplement)") : ssrLooseEqual(unref(form).room_preference, "Single Room (+Supplement)")) ? " selected" : ""}>Single Room (+Supplement)</option></select></label><label class="label" data-v-46f57c02><span data-v-46f57c02>Preferred roommate</span><input${ssrRenderAttr("value", unref(form).preferred_roommate)} class="field" data-v-46f57c02></label><label class="label" data-v-46f57c02><span data-v-46f57c02>Arrival date *</span><input${ssrRenderAttr("value", unref(form).arrival_date)} type="date" required class="field" data-v-46f57c02></label><label class="label" data-v-46f57c02><span data-v-46f57c02>Departure date *</span><input${ssrRenderAttr("value", unref(form).departure_date)} type="date"${ssrRenderAttr("min", unref(form).arrival_date)} required class="field" data-v-46f57c02></label><label class="label" data-v-46f57c02><span data-v-46f57c02>Airport *</span><select required class="field" data-v-46f57c02><option value="" disabled data-v-46f57c02${ssrIncludeBooleanAttr(Array.isArray(unref(form).airport) ? ssrLooseContain(unref(form).airport, "") : ssrLooseEqual(unref(form).airport, "")) ? " selected" : ""}>Select airport</option><!--[-->`);
				ssrRenderList(airportOptions, (option) => {
					_push(`<option${ssrRenderAttr("value", option)} data-v-46f57c02${ssrIncludeBooleanAttr(Array.isArray(unref(form).airport) ? ssrLooseContain(unref(form).airport, option) : ssrLooseEqual(unref(form).airport, option)) ? " selected" : ""}>${ssrInterpolate(option)}</option>`);
				});
				_push(`<!--]--></select></label><label class="label" data-v-46f57c02><span data-v-46f57c02>Flight number</span><input${ssrRenderAttr("value", unref(form).flight_number)} class="field" data-v-46f57c02></label><div class="label" data-v-46f57c02><span data-v-46f57c02>Need airport pickup? *</span><div class="flex gap-5" data-v-46f57c02><label class="check" data-v-46f57c02><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).need_airport_pickup, true)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", true)} data-v-46f57c02> Yes</label><label class="check" data-v-46f57c02><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).need_airport_pickup, false)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", false)} data-v-46f57c02> No</label></div></div><label class="label" data-v-46f57c02><span data-v-46f57c02>Dietary restrictions</span><input${ssrRenderAttr("value", unref(form).dietary_restrictions)} class="field" data-v-46f57c02></label><label class="label" data-v-46f57c02><span data-v-46f57c02>Medical condition</span><input${ssrRenderAttr("value", unref(form).medical_condition)} class="field" data-v-46f57c02></label><label class="label" data-v-46f57c02><span data-v-46f57c02>Special assistance</span><input${ssrRenderAttr("value", unref(form).special_assistance)} class="field" data-v-46f57c02></label></div></fieldset><fieldset class="card" data-v-46f57c02><legend data-v-46f57c02>6. Invoice and consent</legend><div class="grid gap-4 md:grid-cols-2" data-v-46f57c02><label class="label" data-v-46f57c02><span data-v-46f57c02>Tax ID</span><input${ssrRenderAttr("value", unref(form).tax_id)} class="field" data-v-46f57c02></label><div class="label" data-v-46f57c02><span data-v-46f57c02>Need official invoice? *</span><div class="flex gap-5" data-v-46f57c02><label class="check" data-v-46f57c02><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).need_official_invoice, true)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", true)} data-v-46f57c02> Yes</label><label class="check" data-v-46f57c02><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).need_official_invoice, false)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", false)} data-v-46f57c02> No</label></div></div></div><div class="mt-5 space-y-3" data-v-46f57c02><label class="check" data-v-46f57c02><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).information_accuracy_confirmed) ? ssrLooseContain(unref(form).information_accuracy_confirmed, null) : unref(form).information_accuracy_confirmed) ? " checked" : ""} required type="checkbox" data-v-46f57c02> I confirm that the information is accurate *</label><label class="check" data-v-46f57c02><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).terms_accepted) ? ssrLooseContain(unref(form).terms_accepted, null) : unref(form).terms_accepted) ? " checked" : ""} required type="checkbox" data-v-46f57c02> I accept the Terms and Conditions *</label><label class="check" data-v-46f57c02><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).business_matching_data_consent) ? ssrLooseContain(unref(form).business_matching_data_consent, null) : unref(form).business_matching_data_consent) ? " checked" : ""} required type="checkbox" data-v-46f57c02> I consent to business matching data processing *</label></div></fieldset>`);
				if (unref(feedback)) _push(`<div class="${ssrRenderClass([unref(success) ? "border-emerald-300/30 bg-emerald-950/30" : "border-red-300/30 bg-red-950/30", "rounded-2xl border p-5"])}" data-v-46f57c02>${ssrInterpolate(unref(feedback))}</div>`);
				else _push(`<!---->`);
				_push(`<div class="submit-row" data-v-46f57c02><button class="rounded-full bg-amber-300 px-7 py-3 font-semibold text-slate-950 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(submitting) || !unref(form).delegate_package_id || !unref(form).activity_ids.length || !unref(form).participation_categories.length || !unref(form).looking_for.length || !unref(form).preferred_countries.length || unref(form).need_airport_pickup === null || unref(form).need_official_invoice === null) ? " disabled" : ""} data-v-46f57c02>${ssrInterpolate(unref(submitting) ? "Submitting…" : "Create Registration")}</button></div></form>`);
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
var delegate_default = /*#__PURE__*/ _plugin_vue_export_helper_default(delegate_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-46f57c02"]]);

export { delegate_default as default };
//# sourceMappingURL=delegate-Cu_RB2Xk.mjs.map
