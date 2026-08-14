globalThis.__timing__.logStart('Load chunks/build/useMediaUrl-CtPklTwb');import { h as useRuntimeConfig } from '../virtual/entry.mjs';

//#region app/composables/useMediaUrl.ts
function useMediaUrl() {
	const config = useRuntimeConfig();
	const mediaUrl = (url) => {
		if (!url) return "";
		if (/^(https?:|data:|blob:)/i.test(url)) return url;
		return `${config.public.apiBaseUrl.replace(/\/api\/v1\/?$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
	};
	return { mediaUrl };
}

export { useMediaUrl as u };;globalThis.__timing__.logEnd('Load chunks/build/useMediaUrl-CtPklTwb');
//# sourceMappingURL=useMediaUrl-CtPklTwb.mjs.map
