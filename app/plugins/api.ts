export default defineNuxtPlugin(() => {
  const api = useApi();
  return { provide: { api } };
});
