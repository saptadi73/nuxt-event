globalThis.__timing__.logStart('Load chunks/build/terms-BA29PLkf');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
import { L as LegalPage_default } from './LegalPage-qu_C2PuV.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/terms.vue?vue&type=script&setup=true&lang.ts
var terms_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "terms",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Syarat dan Ketentuan | ASEAN AI for Education" });
		const sections = [
			{
				title: "Registrasi dan tiket",
				text: "Peserta wajib memberikan informasi yang akurat. Tiket bersifat pribadi dan QR code tidak boleh dibagikan kepada pihak lain."
			},
			{
				title: "Pembayaran",
				text: "Status pembayaran mengikuti konfirmasi resmi backend setelah validasi penyedia pembayaran. Ketentuan pengembalian dana dapat berbeda pada setiap jenis event atau tiket."
			},
			{
				title: "Perilaku peserta",
				text: "Peserta wajib menghormati orang lain, menjaga lingkungan bebas pelecehan, dan mengikuti petunjuk keselamatan serta tata tertib venue."
			},
			{
				title: "Perubahan program",
				text: "Penyelenggara dapat menyesuaikan pembicara, jadwal, format, atau venue apabila diperlukan dan akan menyampaikan perubahan penting melalui kanal resmi."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(LegalPage_default, mergeProps({
				title: "Syarat dan Ketentuan",
				intro: "Ketentuan ini menjaga pengalaman summit tetap aman, adil, dan profesional bagi semua peserta.",
				sections
			}, _attrs), null, _parent));
		};
	}
});
//#endregion
//#region app/pages/terms.vue
var _sfc_setup = terms_vue_vue_type_script_setup_true_lang_default.setup;
terms_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var terms_default = terms_vue_vue_type_script_setup_true_lang_default;

export { terms_default as default };;globalThis.__timing__.logEnd('Load chunks/build/terms-BA29PLkf');
//# sourceMappingURL=terms-BA29PLkf.mjs.map
