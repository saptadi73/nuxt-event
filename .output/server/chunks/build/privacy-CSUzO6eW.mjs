globalThis.__timing__.logStart('Load chunks/build/privacy-CSUzO6eW');import { a as useSeoMeta$1 } from '../virtual/entry.mjs';
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

//#region app/pages/privacy.vue?vue&type=script&setup=true&lang.ts
var privacy_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "privacy",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Kebijakan Privasi | ASEAN AI for Education" });
		const sections = [
			{
				title: "Data yang dikumpulkan",
				text: "Kami memproses data akun, profil profesional, pilihan acara, transaksi, tiket, dan aktivitas check-in yang diperlukan untuk menyelenggarakan event."
			},
			{
				title: "Cara data digunakan",
				text: "Data digunakan untuk registrasi, komunikasi acara, pembayaran, penerbitan tiket, keamanan, dukungan peserta, analitik agregat, dan networking hanya berdasarkan persetujuan."
			},
			{
				title: "Berbagi dan keamanan",
				text: "Data tidak dijual. Akses dibatasi kepada penyelenggara dan penyedia layanan yang diperlukan. Informasi kontak pribadi tidak ditampilkan tanpa izin."
			},
			{
				title: "Hak peserta",
				text: "Peserta dapat memperbarui profil dan pengaturan privasi melalui dashboard serta menghubungi penyelenggara untuk permintaan terkait data."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(LegalPage_default, mergeProps({
				title: "Kebijakan Privasi",
				intro: "Kami menjaga data peserta dengan prinsip transparansi, pembatasan tujuan, dan keamanan.",
				sections
			}, _attrs), null, _parent));
		};
	}
});
//#endregion
//#region app/pages/privacy.vue
var _sfc_setup = privacy_vue_vue_type_script_setup_true_lang_default.setup;
privacy_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/privacy.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var privacy_default = privacy_vue_vue_type_script_setup_true_lang_default;

export { privacy_default as default };;globalThis.__timing__.logEnd('Load chunks/build/privacy-CSUzO6eW');
//# sourceMappingURL=privacy-CSUzO6eW.mjs.map
