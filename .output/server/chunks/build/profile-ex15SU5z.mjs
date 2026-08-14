globalThis.__timing__.logStart('Load chunks/build/profile-ex15SU5z');import { u as useMediaUrl } from './useMediaUrl-CtPklTwb.mjs';
import { u as useParticipant } from './useParticipant-CPMevOwd.mjs';
import { defineComponent, reactive, ref, computed, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import '../virtual/entry.mjs';
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

//#region app/pages/dashboard/profile.vue?vue&type=script&setup=true&lang.ts
var profile_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "profile",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const { getMyProfile} = useParticipant();
		const { mediaUrl } = useMediaUrl();
		const form = reactive({
			full_name: "",
			organization_name: "",
			biography: ""
		});
		const feedback = ref("");
		const profilePhotoUrl = ref("");
		const initials = computed(() => (form.full_name || "You").split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase());
		const me = ([__temp, __restore] = withAsyncContext(() => getMyProfile()), __temp = await __temp, __restore(), __temp);
		if (me?.data) {
			form.full_name = me.data.full_name || "";
			form.organization_name = me.data.organization_name || "";
			form.biography = me.data.biography || "";
			profilePhotoUrl.value = me.data.profile_photo_url || "";
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8" }, _attrs))}><h1 class="text-4xl font-black text-white">My Profile</h1><p class="mt-3 text-slate-300">Update the data used by the \`PUT /participants/me\` and \`PATCH /participants/me\` endpoints.</p><div class="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6"><div class="flex flex-wrap items-center gap-4">`);
			if (unref(profilePhotoUrl)) _push(`<img${ssrRenderAttr("src", unref(mediaUrl)(unref(profilePhotoUrl)))} alt="Your profile photo" class="h-20 w-20 rounded-2xl object-cover">`);
			else _push(`<div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300/10 text-2xl font-bold text-cyan-200">${ssrInterpolate(unref(initials))}</div>`);
			_push(`<label class="grid gap-2 text-sm text-slate-300"><span>Profile photo</span><input type="file" accept="image/jpeg,image/png,image/webp" class="block text-sm text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"></label></div><label class="grid gap-2"><span class="text-sm text-slate-300">Full Name</span><input${ssrRenderAttr("value", unref(form).full_name)} class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"></label><label class="grid gap-2"><span class="text-sm text-slate-300">Organization</span><input${ssrRenderAttr("value", unref(form).organization_name)} class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"></label><label class="grid gap-2"><span class="text-sm text-slate-300">Biography</span><textarea rows="5" class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none">${ssrInterpolate(unref(form).biography)}</textarea></label><div class="flex flex-wrap gap-3"><button class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"> Save All </button><button class="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white"> Save Partial </button></div></div>`);
			if (unref(feedback)) _push(`<div class="mt-4 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-white">${ssrInterpolate(unref(feedback))}</div>`);
			else _push(`<!---->`);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/dashboard/profile.vue
var _sfc_setup = profile_vue_vue_type_script_setup_true_lang_default.setup;
profile_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/profile.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var profile_default = profile_vue_vue_type_script_setup_true_lang_default;

export { profile_default as default };;globalThis.__timing__.logEnd('Load chunks/build/profile-ex15SU5z');
//# sourceMappingURL=profile-ex15SU5z.mjs.map
