import { _ as _plugin_vue_export_helper_default, u as useAuthStore } from '../virtual/entry.mjs';
import { u as useSeoMeta$1 } from './head-D-xrF-Fu.mjs';
import { u as useAdminOperations } from './useAdminOperations-Cfti5GtJ.mjs';
import { defineComponent, ref, reactive, computed, watch, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
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

//#region app/pages/admin/users.vue?vue&type=script&setup=true&lang.ts
var users_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "users",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useSeoMeta$1({ title: "Manage Users | IWBIF 2026" });
		const authStore = useAuthStore();
		const api = useAdminOperations();
		const users = ref([]), loading = ref(false), saving = ref(false), modalOpen = ref(false), editingId = ref(""), feedback = ref(""), tone = ref("success");
		const page = ref(1), roleFilter = ref(""), statusFilter = ref("");
		const meta = reactive({
			total: 0,
			pages: 1
		});
		const empty = () => ({
			email: "",
			password: "",
			full_name: "",
			phone: "",
			country: "",
			role: "participant",
			status: "active",
			is_email_verified: false
		});
		const form = reactive(empty());
		const errorText = (error) => {
			const value = error;
			return value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : "User could not be saved.");
		};
		const editingSelf = computed(() => Boolean(editingId.value && editingId.value === authStore.user?.id));
		const load = async () => {
			loading.value = true;
			try {
				const result = await api.getUsers(page.value, 20, roleFilter.value, statusFilter.value);
				users.value = result.data || [];
				meta.total = result.meta?.total || users.value.length;
				meta.pages = result.meta?.pages || 1;
			} catch (error) {
				tone.value = "error";
				feedback.value = errorText(error);
			} finally {
				loading.value = false;
			}
		};
		watch(page, load);
		watch([roleFilter, statusFilter], async () => {
			if (page.value !== 1) page.value = 1;
			else await load();
		});
		[__temp, __restore] = withAsyncContext(() => load()), await __temp, __restore();
		const formatDate = (value) => value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(value)) : "—";
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))} data-v-8d555950><div class="header-row" data-v-8d555950><div data-v-8d555950><p class="eyebrow" data-v-8d555950>Access control</p><h1 data-v-8d555950>User &amp; role management</h1><p data-v-8d555950>Manage participant and organizer access without exposing privileged admin controls.</p></div><button class="primary" data-v-8d555950>+ New user</button></div><div class="toolbar" data-v-8d555950><div class="filters" data-v-8d555950><select data-v-8d555950><option value="" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "") : ssrLooseEqual(unref(roleFilter), "")) ? " selected" : ""}>All roles</option><option value="participant" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "participant") : ssrLooseEqual(unref(roleFilter), "participant")) ? " selected" : ""}>Participant</option><option value="organizer" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "organizer") : ssrLooseEqual(unref(roleFilter), "organizer")) ? " selected" : ""}>Organizer</option>`);
			if (unref(authStore).userRole === "admin") _push(`<option value="admin" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "admin") : ssrLooseEqual(unref(roleFilter), "admin")) ? " selected" : ""}>Admin</option>`);
			else _push(`<!---->`);
			_push(`</select><select data-v-8d555950><option value="" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All statuses</option><option value="active" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "active") : ssrLooseEqual(unref(statusFilter), "active")) ? " selected" : ""}>Active</option><option value="inactive" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "inactive") : ssrLooseEqual(unref(statusFilter), "inactive")) ? " selected" : ""}>Inactive</option><option value="suspended" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "suspended") : ssrLooseEqual(unref(statusFilter), "suspended")) ? " selected" : ""}>Suspended</option></select></div><span data-v-8d555950>${ssrInterpolate(unref(meta).total ?? unref(users).length)} users</span></div>`);
			if (unref(feedback)) _push(`<p class="${ssrRenderClass([unref(tone), "notice"])}" data-v-8d555950>${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			_push(`<div class="table-shell" data-v-8d555950><table data-v-8d555950><thead data-v-8d555950><tr data-v-8d555950><th data-v-8d555950>User</th><th data-v-8d555950>Role</th><th data-v-8d555950>Status</th><th data-v-8d555950>Verification</th><th data-v-8d555950>Created</th><th class="right" data-v-8d555950>Actions</th></tr></thead><tbody data-v-8d555950>`);
			if (unref(loading)) _push(`<tr data-v-8d555950><td colspan="6" class="empty" data-v-8d555950>Loading users...</td></tr>`);
			else if (!unref(users).length) _push(`<tr data-v-8d555950><td colspan="6" class="empty" data-v-8d555950>No users found.</td></tr>`);
			else {
				_push(`<!--[-->`);
				ssrRenderList(unref(users), (user) => {
					_push(`<tr data-v-8d555950><td data-v-8d555950><strong data-v-8d555950>${ssrInterpolate(user.full_name || "Unnamed user")}</strong><small data-v-8d555950>${ssrInterpolate(user.email)}</small></td><td data-v-8d555950><span class="pill role" data-v-8d555950>${ssrInterpolate(user.role)}</span></td><td data-v-8d555950><span class="${ssrRenderClass([user.status, "pill"])}" data-v-8d555950>${ssrInterpolate(user.status)}</span></td><td data-v-8d555950>${ssrInterpolate(user.is_email_verified ? "Verified" : "Unverified")}</td><td data-v-8d555950>${ssrInterpolate(formatDate(user.created_at))}</td><td class="right" data-v-8d555950><button class="table-action"${ssrIncludeBooleanAttr(unref(authStore).userRole !== "admin" && user.role === "admin") ? " disabled" : ""} data-v-8d555950>${ssrInterpolate(unref(authStore).userRole !== "admin" && user.role === "admin" ? "Protected" : "Edit")}</button></td></tr>`);
				});
				_push(`<!--]-->`);
			}
			_push(`</tbody></table></div><div class="pager" data-v-8d555950><button${ssrIncludeBooleanAttr(unref(page) <= 1) ? " disabled" : ""} data-v-8d555950>Previous</button><span data-v-8d555950>Page ${ssrInterpolate(unref(page))} of ${ssrInterpolate(unref(meta).pages || 1)}</span><button${ssrIncludeBooleanAttr(unref(page) >= (unref(meta).pages || 1)) ? " disabled" : ""} data-v-8d555950>Next</button></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(modalOpen)) {
					_push(`<div class="backdrop" data-v-8d555950><form class="modal" data-v-8d555950><div class="modal-head" data-v-8d555950><div data-v-8d555950><p class="eyebrow" data-v-8d555950>Account editor</p><h2 data-v-8d555950>${ssrInterpolate(unref(editingId) ? "Update user" : "Create user")}</h2></div><button type="button" data-v-8d555950>×</button></div><div class="modal-body" data-v-8d555950>`);
					if (!unref(editingId)) _push(`<label class="field" data-v-8d555950><span data-v-8d555950>Email</span><input${ssrRenderAttr("value", unref(form).email)} type="email" required data-v-8d555950></label>`);
					else _push(`<!---->`);
					if (!unref(editingId)) _push(`<label class="field" data-v-8d555950><span data-v-8d555950>Temporary password</span><input${ssrRenderAttr("value", unref(form).password)} type="password" minlength="8" maxlength="128" required data-v-8d555950></label>`);
					else _push(`<!---->`);
					_push(`<label class="field" data-v-8d555950><span data-v-8d555950>Full name</span><input${ssrRenderAttr("value", unref(form).full_name)} data-v-8d555950></label><div class="grid" data-v-8d555950><label class="field" data-v-8d555950><span data-v-8d555950>Phone</span><input${ssrRenderAttr("value", unref(form).phone)} data-v-8d555950></label><label class="field" data-v-8d555950><span data-v-8d555950>Country</span><input${ssrRenderAttr("value", unref(form).country)} data-v-8d555950></label></div><div class="grid" data-v-8d555950><label class="field" data-v-8d555950><span data-v-8d555950>Role</span><select${ssrIncludeBooleanAttr(unref(editingSelf)) ? " disabled" : ""} data-v-8d555950><option value="participant" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "participant") : ssrLooseEqual(unref(form).role, "participant")) ? " selected" : ""}>Participant</option><option value="organizer" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "organizer") : ssrLooseEqual(unref(form).role, "organizer")) ? " selected" : ""}>Organizer</option>`);
					if (unref(authStore).userRole === "admin") _push(`<option value="admin" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "admin") : ssrLooseEqual(unref(form).role, "admin")) ? " selected" : ""}>Admin</option>`);
					else _push(`<!---->`);
					_push(`</select>`);
					if (unref(editingSelf)) _push(`<small data-v-8d555950>You cannot change your own role.</small>`);
					else _push(`<!---->`);
					_push(`</label><label class="field" data-v-8d555950><span data-v-8d555950>Status</span><select${ssrIncludeBooleanAttr(unref(editingSelf)) ? " disabled" : ""} data-v-8d555950><option value="active" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "active") : ssrLooseEqual(unref(form).status, "active")) ? " selected" : ""}>Active</option><option value="inactive" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "inactive") : ssrLooseEqual(unref(form).status, "inactive")) ? " selected" : ""}>Inactive</option><option value="suspended" data-v-8d555950${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "suspended") : ssrLooseEqual(unref(form).status, "suspended")) ? " selected" : ""}>Suspended</option></select>`);
					if (unref(editingSelf)) _push(`<small data-v-8d555950>You cannot disable your own account.</small>`);
					else _push(`<!---->`);
					_push(`</label></div><label class="check" data-v-8d555950><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_email_verified) ? ssrLooseContain(unref(form).is_email_verified, null) : unref(form).is_email_verified) ? " checked" : ""} type="checkbox" data-v-8d555950> Email verified</label></div><div class="modal-foot" data-v-8d555950><button type="button" class="secondary" data-v-8d555950>Cancel</button><button class="primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-8d555950>${ssrInterpolate(unref(saving) ? "Saving..." : "Save user")}</button></div></form></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</section>`);
		};
	}
});
//#endregion
//#region app/pages/admin/users.vue
var _sfc_setup = users_vue_vue_type_script_setup_true_lang_default.setup;
users_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var users_default = /*#__PURE__*/ _plugin_vue_export_helper_default(users_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8d555950"]]);

export { users_default as default };
//# sourceMappingURL=users-CKzTmiQb.mjs.map
