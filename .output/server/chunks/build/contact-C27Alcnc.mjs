globalThis.__timing__.logStart('Load chunks/build/contact-C27Alcnc');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
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
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-amber-200">Contact</p><h1 class="mt-4 text-5xl font-black">Connect with the IWBIF team</h1><p class="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Partnerships, media inquiries, speaking opportunities, and registration assistance for IWBIF 2026 can be directed to the event operations desk.</p><div class="mt-10 grid gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-8 md:grid-cols-3"><article class="glass-card rounded-2xl p-5"><p class="text-xs uppercase tracking-[.2em] text-cyan-200">General</p><h2 class="mt-3 text-xl font-bold">General Inquiry</h2><p class="mt-3 text-sm text-slate-300">hello@iwbif-event.example</p></article><article class="glass-card rounded-2xl p-5"><p class="text-xs uppercase tracking-[.2em] text-cyan-200">Partnerships</p><h2 class="mt-3 text-xl font-bold">Partnership &amp; Sponsors</h2><p class="mt-3 text-sm text-slate-300">partners@iwbif-event.example</p></article><article class="glass-card rounded-2xl p-5"><p class="text-xs uppercase tracking-[.2em] text-cyan-200">Media</p><h2 class="mt-3 text-xl font-bold">Press &amp; Media</h2><p class="mt-3 text-sm text-slate-300">media@iwbif-event.example</p></article></div></section>`);
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
var contact_default = contact_vue_vue_type_script_setup_true_lang_default;

export { contact_default as default };;globalThis.__timing__.logEnd('Load chunks/build/contact-C27Alcnc');
//# sourceMappingURL=contact-C27Alcnc.mjs.map
