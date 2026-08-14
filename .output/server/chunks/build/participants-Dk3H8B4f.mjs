globalThis.__timing__.logStart('Load chunks/build/participants-Dk3H8B4f');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/participants.vue?vue&type=script&setup=true&lang.ts
var participants_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "participants",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({
			title: "Participants | IWBIF 2026",
			description: "The trusted IWBIF 2026 international delegate network."
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-amber-200">Participants</p><h1 class="mt-4 text-5xl font-black">A trusted international delegate network.</h1><p class="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Meet women entrepreneurs, buyers, investors, government representatives, financial institutions, business associations, media, exhibitors, and Youth Womenpreneurs.</p><div class="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-8"><h2 class="text-2xl font-bold">Privacy-led directory</h2><p class="mt-3 leading-7 text-slate-300">Participant profiles are available only according to account access, registration status, and each delegate&#39;s directory consent.</p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/dashboard/directory",
				class: "mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Open Delegate Directory`);
					else return [createTextVNode("Open Delegate Directory")];
				}),
				_: 1
			}, _parent));
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region app/pages/participants.vue
var _sfc_setup = participants_vue_vue_type_script_setup_true_lang_default.setup;
participants_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/participants.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var participants_default = participants_vue_vue_type_script_setup_true_lang_default;

export { participants_default as default };;globalThis.__timing__.logEnd('Load chunks/build/participants-Dk3H8B4f');
//# sourceMappingURL=participants-Dk3H8B4f.mjs.map
