import { _ as _plugin_vue_export_helper_default, a as useSeoMeta$1 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
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

//#region app/pages/contact.vue?vue&type=script&setup=true&lang.ts
var contact_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "contact",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "Contact | IWBIF 2026",
			description: "Contact IWBIF 2026 for media, partnership, and participant support."
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "contact-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8" }, _attrs))} data-v-5ce98af7><p class="text-sm uppercase tracking-[.35em] text-amber-200" data-v-5ce98af7>Contact</p><h1 class="mt-4 text-3xl font-black sm:text-5xl" data-v-5ce98af7>Connect with the IWBIF team</h1><p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8" data-v-5ce98af7>Partnerships, media inquiries, speaking opportunities, and registration assistance for IWBIF 2026 can be directed to the event operations desk.</p><div class="support-banner mt-8 rounded-[2rem] border border-amber-200/20 bg-amber-300/10 p-5 sm:p-6" data-v-5ce98af7><div data-v-5ce98af7><p class="text-xs uppercase tracking-[.3em] text-amber-200" data-v-5ce98af7>Need assistance?</p><p class="mt-3 text-lg font-semibold text-white sm:text-xl" data-v-5ce98af7>We can help with registration, partnerships, and event logistics.</p></div><a href="mailto:hello@iwbif-event.example" class="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950 sm:mt-0" data-v-5ce98af7>Email the team</a></div><div class="mt-10 grid gap-5 md:grid-cols-3" data-v-5ce98af7><article class="info-card rounded-[1.75rem] p-5 sm:p-6" data-v-5ce98af7><p class="text-xs uppercase tracking-[.2em] text-cyan-200" data-v-5ce98af7>General</p><h2 class="mt-3 text-xl font-bold text-white" data-v-5ce98af7>General Inquiry</h2><p class="mt-3 text-sm leading-7 text-slate-300" data-v-5ce98af7>hello@iwbif-event.example</p><span class="mt-5 inline-flex text-xs uppercase tracking-[.2em] text-slate-400" data-v-5ce98af7>Support desk</span></article><article class="info-card rounded-[1.75rem] p-5 sm:p-6" data-v-5ce98af7><p class="text-xs uppercase tracking-[.2em] text-cyan-200" data-v-5ce98af7>Partnerships</p><h2 class="mt-3 text-xl font-bold text-white" data-v-5ce98af7>Partnership &amp; Sponsors</h2><p class="mt-3 text-sm leading-7 text-slate-300" data-v-5ce98af7>partners@iwbif-event.example</p><span class="mt-5 inline-flex text-xs uppercase tracking-[.2em] text-slate-400" data-v-5ce98af7>Visibility and collaboration</span></article><article class="info-card rounded-[1.75rem] p-5 sm:p-6" data-v-5ce98af7><p class="text-xs uppercase tracking-[.2em] text-cyan-200" data-v-5ce98af7>Media</p><h2 class="mt-3 text-xl font-bold text-white" data-v-5ce98af7>Press &amp; Media</h2><p class="mt-3 text-sm leading-7 text-slate-300" data-v-5ce98af7>media@iwbif-event.example</p><span class="mt-5 inline-flex text-xs uppercase tracking-[.2em] text-slate-400" data-v-5ce98af7>Announcements and coverage</span></article></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/contact.vue
var _sfc_setup = contact_vue_vue_type_script_setup_true_lang_default.setup;
contact_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var contact_default = /*#__PURE__*/ _plugin_vue_export_helper_default(contact_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5ce98af7"]]);

export { contact_default as default };
//# sourceMappingURL=contact-wEhqvBdu.mjs.map
