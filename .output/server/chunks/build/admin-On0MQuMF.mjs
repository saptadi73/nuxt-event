globalThis.__timing__.logStart('Load chunks/build/admin-On0MQuMF');import { d as defineNuxtRouteMiddleware, u as useAuthStore, n as navigateTo } from '../virtual/entry.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue';
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
import 'vue/server-renderer';
import 'devalue';
import '@vue/shared';
import 'unhead/utils';

//#region app/middleware/admin.ts
var admin_default = defineNuxtRouteMiddleware(() => {
	const auth = useAuthStore();
	auth.hydrateUserFromToken();
	if (!auth.isAuthenticated) return navigateTo("/auth/login");
	if (!auth.isAdminOrOrganizer) return navigateTo("/dashboard");
});

export { admin_default as default };;globalThis.__timing__.logEnd('Load chunks/build/admin-On0MQuMF');
//# sourceMappingURL=admin-On0MQuMF.mjs.map
