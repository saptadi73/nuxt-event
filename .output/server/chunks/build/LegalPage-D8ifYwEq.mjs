globalThis.__timing__.logStart('Load chunks/build/LegalPage-D8ifYwEq');import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';

//#region app/components/LegalPage.vue?vue&type=script&setup=true&lang.ts
var LegalPage_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "LegalPage",
	__ssrInlineRender: true,
	props: {
		title: {},
		intro: {},
		sections: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-14 sm:px-6" }, _attrs))}><p class="text-sm uppercase tracking-[0.35em] text-cyan-200">Legal Information</p><h1 class="mt-4 text-5xl font-black">${ssrInterpolate(__props.title)}</h1><p class="mt-5 text-lg leading-8 text-slate-300">${ssrInterpolate(__props.intro)}</p><div class="mt-10 space-y-5"><!--[-->`);
			ssrRenderList(__props.sections, (section) => {
				_push(`<article class="glass-card rounded-2xl p-6"><h2 class="text-xl font-bold">${ssrInterpolate(section.title)}</h2><p class="mt-3 leading-7 text-slate-300">${ssrInterpolate(section.text)}</p></article>`);
			});
			_push(`<!--]--></div><p class="mt-8 text-sm text-slate-500">Last updated: August 1, 2026. Contact the organizer for the policy version that applies to your event.</p></section>`);
		};
	}
});
//#endregion
//#region app/components/LegalPage.vue
var _sfc_setup = LegalPage_vue_vue_type_script_setup_true_lang_default.setup;
LegalPage_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LegalPage.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var LegalPage_default = Object.assign(LegalPage_vue_vue_type_script_setup_true_lang_default, { __name: "LegalPage" });

export { LegalPage_default as L };;globalThis.__timing__.logEnd('Load chunks/build/LegalPage-D8ifYwEq');
//# sourceMappingURL=LegalPage-D8ifYwEq.mjs.map
