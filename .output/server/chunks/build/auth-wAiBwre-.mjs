import { d as defineNuxtRouteMiddleware, u as useAuthStore, n as navigateTo } from '../virtual/entry.mjs';
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
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'devalue';
import 'vue-router';
import '@vue/shared';

//#region app/middleware/auth.ts
var auth_default = defineNuxtRouteMiddleware(() => {
	const auth = useAuthStore();
	auth.hydrateUserFromToken();
	if (!auth.isAuthenticated) return navigateTo("/auth/login");
});

export { auth_default as default };
//# sourceMappingURL=auth-wAiBwre-.mjs.map
