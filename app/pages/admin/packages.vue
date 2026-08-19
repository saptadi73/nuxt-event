<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-end justify-between gap-5">
      <div><p class="text-sm uppercase tracking-[.3em] text-amber-200">Organizer catalog</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Manage packages</h1><p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Create and update packages shown in the purchase catalog. Backend pricing remains the source of truth.</p></div>
      <NuxtLink to="/dashboard" class="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">Back to dashboard</NuxtLink>
    </div>

    <label class="mt-8 block max-w-md text-sm text-slate-300"><span class="mb-2 block">Event</span><select v-model="selectedEventId" class="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-300/50"><option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option></select></label>
    <div v-if="feedback" class="mt-5 rounded-2xl border p-4 text-sm" :class="feedbackTone === 'error' ? 'border-red-400/30 bg-red-950/30 text-red-100' : 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100'">{{ feedback }}</div>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem]">
      <div>
        <p v-if="loading" class="glass-card rounded-3xl p-6 text-slate-300">Loading packages...</p>
        <div v-else-if="!products.length" class="glass-card rounded-3xl p-6 text-slate-300">No package has been published for this event.</div>
        <div v-else class="grid gap-4 md:grid-cols-2">
          <article v-for="product in products" :key="product.id" class="glass-card rounded-3xl p-5">
            <div class="flex items-center justify-between gap-3"><span class="text-xs font-bold uppercase tracking-[.2em] text-amber-200">{{ product.product_type }}</span><span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em]" :class="product.is_active ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/10 text-slate-400'">{{ product.is_active ? 'Active' : 'Inactive' }}</span></div>
            <h2 class="mt-4 text-xl font-bold">{{ product.name }}</h2><p class="mt-2 min-h-10 text-sm text-slate-400">{{ product.description || 'No description' }}</p><p class="mt-4 text-2xl font-black text-amber-100">{{ money(product.price ?? product.amount ?? 0, product.currency) }}</p>
            <button class="mt-5 rounded-full border border-amber-300/40 px-5 py-2 text-sm font-semibold text-amber-100" @click="editProduct(product)">Edit package</button>
          </article>
        </div>
      </div>

      <form class="glass-card h-fit rounded-[2rem] p-5 sm:p-6" @submit.prevent="saveProduct">
        <div class="flex items-center justify-between gap-3"><h2 class="text-xl font-bold">{{ editingId ? 'Update package' : 'New package' }}</h2><button v-if="editingId" type="button" class="text-sm text-slate-400" @click="resetForm">Cancel</button></div>
        <div class="mt-5 space-y-4">
          <label class="field"><span>Package name</span><input v-model.trim="form.name" required /></label>
          <div class="grid grid-cols-2 gap-3"><label class="field"><span>Code</span><input v-model.trim="form.code" placeholder="DEL-A" /></label><label class="field"><span>Type</span><select v-model="form.product_type"><option value="delegate">Delegate</option><option value="exhibitor">Exhibitor</option><option value="additional">Additional</option></select></label></div>
          <label class="field"><span>Description</span><textarea v-model.trim="form.description" rows="3" /></label>
          <div class="grid grid-cols-2 gap-3"><label class="field"><span>Price</span><input v-model.number="form.price" type="number" min="0" step="0.01" required /></label><label class="field"><span>Currency</span><input v-model.trim="form.currency" maxlength="3" required /></label></div>
          <label class="field"><span>Maximum quantity</span><input v-model.number="form.max_quantity" type="number" min="1" placeholder="Optional" /></label>
          <label class="flex items-center gap-3 text-sm text-slate-300"><input v-model="form.is_active" type="checkbox" class="h-4 w-4 accent-amber-300" />Available in catalog</label>
          <button class="w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-50" :disabled="saving || !selectedEventId">{{ saving ? 'Saving...' : editingId ? 'Update package' : 'Create package' }}</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import {useEvent,type EventItem} from '~/composables/useEvent';
import {useAdminContent,type ProductMutationPayload} from '~/composables/useAdminContent';
import type {StoreProduct} from '~/composables/useStore';
definePageMeta({middleware:['auth','admin']});useSeoMeta({title:'Manage Packages | IWBIF 2026'});
const {getEvents}=useEvent();const adminApi=useAdminContent();
const {data:eventResponse}=await useAsyncData('admin-package-events',()=>getEvents(1,100));const events=computed<EventItem[]>(()=>eventResponse.value?.data||[]);const selectedEventId=ref(events.value[0]?.id||'');
const products=ref<StoreProduct[]>([]);const loading=ref(false),saving=ref(false),editingId=ref(''),feedback=ref('');const feedbackTone=ref<'success'|'error'>('success');
const emptyForm=():ProductMutationPayload=>({code:'',name:'',description:'',product_type:'delegate',price:0,currency:'USD',max_quantity:null,is_active:true});const form=reactive<ProductMutationPayload>(emptyForm());
const apiError=(error:unknown)=>{const value=error as {data?:{message?:string;errors?:Array<{message:string}>}};return value.data?.errors?.[0]?.message||value.data?.message||(error instanceof Error?error.message:'The package could not be saved.');};
const loadProducts=async()=>{if(!selectedEventId.value){products.value=[];return;}loading.value=true;feedback.value='';try{products.value=(await adminApi.getProducts(selectedEventId.value)).data||[];}catch(error){feedbackTone.value='error';feedback.value=apiError(error);}finally{loading.value=false;}};
const resetForm=()=>{editingId.value='';Object.assign(form,emptyForm());};
const editProduct=(product:StoreProduct)=>{editingId.value=product.id;Object.assign(form,{code:product.code||'',name:product.name,description:product.description||'',product_type:product.product_type,price:product.price??product.amount??0,currency:product.currency,max_quantity:product.max_quantity??null,is_active:product.is_active});};
const saveProduct=async()=>{if(!selectedEventId.value||saving.value)return;saving.value=true;feedback.value='';const payload={...form,currency:form.currency.toUpperCase(),max_quantity:form.max_quantity||null};try{if(editingId.value)await adminApi.updateProduct(editingId.value,payload);else await adminApi.createProduct(selectedEventId.value,payload);feedbackTone.value='success';feedback.value=editingId.value?'Package updated.':'Package created.';resetForm();await loadProducts();}catch(error){feedbackTone.value='error';feedback.value=apiError(error);}finally{saving.value=false;}};
watch(selectedEventId,async()=>{resetForm();await loadProducts();});if(selectedEventId.value)await loadProducts();const money=(amount:number,currency:string)=>new Intl.NumberFormat('en-US',{style:'currency',currency:currency||'USD'}).format(amount||0);
</script>

<style scoped>.field { display:block; font-size:.875rem; color:#cbd5e1; }.field span { display:block; margin-bottom:.5rem; }.field input,.field select,.field textarea { width:100%; border:1px solid rgba(255,255,255,.1); border-radius:1rem; background:rgba(2,6,23,.78); padding:.75rem 1rem; color:white; outline:none; }.field input:focus,.field select:focus,.field textarea:focus { border-color:rgba(252,211,77,.55); }</style>
