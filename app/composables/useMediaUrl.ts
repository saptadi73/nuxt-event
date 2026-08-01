export function useMediaUrl() {
  const config = useRuntimeConfig();

  const mediaUrl = (url?: string) => {
    if (!url) return '';
    if (/^(https?:|data:|blob:)/i.test(url)) return url;

    return `${config.public.apiBaseUrl.replace(/\/api\/v1\/?$/, '')}${url.startsWith('/') ? url : `/${url}`}`;
  };

  return { mediaUrl };
}
