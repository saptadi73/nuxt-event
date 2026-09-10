import { onBeforeUnmount, watch, type Ref } from 'vue';

export function useDebouncedReload(source: Ref<string>, reload: () => Promise<void>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  watch(source, () => {
    clearTimeout(timer);
    timer = setTimeout(() => { void reload(); }, 300);
  });
  onBeforeUnmount(() => clearTimeout(timer));
}

export function useTableReload(search: Ref<string>, page: Ref<number>, size: Ref<number>, reload: () => Promise<void>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  watch([search, size], () => { page.value = 1; }, { flush: 'sync' });
  watch([search, page, size], (values, previous) => {
    clearTimeout(timer);
    timer = setTimeout(() => { void reload(); }, values[0] !== previous[0] ? 300 : 0);
  });
  onBeforeUnmount(() => clearTimeout(timer));
}
