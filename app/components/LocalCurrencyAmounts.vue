<template>
  <div v-if="amount > 0" class="currency-reference" :class="compact ? 'currency-reference--compact' : ''">
    <p v-if="!compact" class="currency-reference__label">{{ copy.base }}</p>
    <p class="currency-reference__idr">{{ idr(amount) }}</p>
    <div class="currency-reference__foreign"><span>{{ cny(amount) }}</span><span aria-hidden="true">·</span><span>{{ myr(amount) }}</span></div>
    <p v-if="showRate" class="currency-reference__rate">{{ copy.rate }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ amount: number; compact?: boolean; showRate?: boolean }>(), { compact: false, showRate: false });
const { locale } = useI18n();
const copy = computed(() => locale.value === 'zh-CN'
  ? { base: '印尼盾付款基准', rate: '固定参考汇率：1 人民币 = Rp2,445 · 1 马来西亚令吉 = Rp4,400' }
  : { base: 'IDR payment base', rate: 'Fixed reference rates: CNY 1 = IDR 2,445 · MYR 1 = IDR 4,400' });
const idr = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const cny = (value: number) => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 2445);
const myr = (value: number) => new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 4400);
</script>

<style scoped>
.currency-reference{margin-top:.75rem;border:1px solid rgba(103,232,249,.2);border-radius:1rem;background:rgba(8,47,73,.28);padding:.8rem 1rem}.currency-reference__label{font-size:.65rem;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:#a5f3fc}.currency-reference__idr{margin-top:.2rem;font-size:1rem;font-weight:800;color:#fff}.currency-reference__foreign{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.25rem;font-size:.78rem;font-weight:700;color:#fde68a}.currency-reference__rate{margin-top:.45rem;font-size:.65rem;line-height:1.4;color:#94a3b8}.currency-reference--compact{margin-top:.4rem;padding:.55rem .7rem}.currency-reference--compact .currency-reference__idr{font-size:.78rem}.currency-reference--compact .currency-reference__foreign{font-size:.7rem}
</style>
