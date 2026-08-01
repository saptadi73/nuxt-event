globalThis.__timing__.logStart('Load chunks/build/invoice-URqIsKA4');import { a as useSeoMeta$1, N as NuxtLink } from '../virtual/entry.mjs';
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

//#region app/pages/dashboard/invoice.vue?vue&type=script&setup=true&lang.ts
var invoice_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "invoice",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Invoice | ASEAN AI for Education" });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-12 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[.35em] text-cyan-200">Payment and Invoice</p><h1 class="mt-3 text-4xl font-black">Registration invoice</h1><div class="glass-card mt-8 rounded-[2rem] p-7"><div class="flex flex-wrap justify-between gap-5 border-b border-white/10 pb-6"><div><p class="text-sm text-slate-400">ASEAN AI for Education Summit 2026</p><p class="mt-1 font-semibold">18–19 November 2026 · Jakarta</p></div><span class="h-fit rounded-full bg-orange-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-orange-200">Awaiting registration data</span></div><dl class="mt-6 grid gap-5 sm:grid-cols-2"><div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Registration number</dt><dd class="mt-2 text-lg font-semibold">Available after registration</dd></div><div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Participant</dt><dd class="mt-2 text-lg font-semibold">Your registered name</dd></div><div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Ticket category</dt><dd class="mt-2 text-lg font-semibold">Selected ticket</dd></div><div><dt class="text-xs uppercase tracking-[.2em] text-slate-500">Payment status</dt><dd class="mt-2 text-lg font-semibold">Check payment status</dd></div></dl><div class="mt-7 flex flex-wrap gap-3">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/dashboard/payment-status",
				class: "rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Check payment status`);
					else return [createTextVNode("Check payment status")];
				}),
				_: 1
			}, _parent));
			_push(`<button disabled class="cursor-not-allowed rounded-full border border-white/10 px-5 py-3 text-slate-500">Download invoice</button></div></div></section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/invoice.vue
var _sfc_setup = invoice_vue_vue_type_script_setup_true_lang_default.setup;
invoice_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/invoice.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var invoice_default = invoice_vue_vue_type_script_setup_true_lang_default;

export { invoice_default as default };;globalThis.__timing__.logEnd('Load chunks/build/invoice-URqIsKA4');
//# sourceMappingURL=invoice-URqIsKA4.mjs.map
