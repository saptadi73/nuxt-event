import { i as useRuntimeConfig } from '../virtual/entry.mjs';

//#region app/composables/useMediaUrl.ts
function useMediaUrl() {
	const config = useRuntimeConfig();
	const mediaUrl = (url) => {
		if (!url) return "";
		if (/^(data:|blob:)/i.test(url)) return url;
		const backendOrigin = new URL(config.public.apiBaseUrl).origin;
		if (/^https?:/i.test(url)) {
			const absoluteUrl = new URL(url);
			if ([
				"127.0.0.1",
				"localhost",
				"0.0.0.0"
			].includes(absoluteUrl.hostname)) return `${backendOrigin}${absoluteUrl.pathname}${absoluteUrl.search}${absoluteUrl.hash}`;
			return url;
		}
		return `${backendOrigin}${url.startsWith("/") ? url : `/${url}`}`;
	};
	return { mediaUrl };
}

export { useMediaUrl as u };
//# sourceMappingURL=useMediaUrl-BgmpAAxd.mjs.map
