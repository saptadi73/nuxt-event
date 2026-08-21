<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-end justify-between gap-5">
      <div><p class="text-sm uppercase tracking-[.3em] text-cyan-200">Event operations</p><h1 class="mt-3 text-3xl font-black sm:text-4xl">Program & agenda</h1><p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Manage schedules, rooms, capacity, and publication status.</p></div>
      <div class="flex flex-wrap gap-3"><NuxtLink to="/program" class="action-secondary">View public program</NuxtLink><button class="action-primary" :disabled="!selectedEventId" @click="openCreate">+ New session</button></div>
    </div>

    <div class="mt-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[.04] p-4 sm:flex-row sm:items-end sm:justify-between">
      <label class="field w-full sm:max-w-md"><span>Event</span><select v-model="selectedEventId"><option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option></select></label>
      <p class="text-sm text-slate-400">{{ sessions.length }} sessions</p>
    </div>
    <p v-if="feedback" class="mt-5 rounded-2xl border p-4 text-sm" :class="feedbackTone === 'error' ? 'border-red-400/30 bg-red-950/30 text-red-100' : 'border-emerald-300/30 bg-emerald-950/30 text-emerald-100'">{{ feedback }}</p>

    <div class="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/45 shadow-2xl shadow-slate-950/30">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[900px] text-left">
          <thead class="border-b border-white/10 bg-white/[.045] text-[11px] uppercase tracking-[.18em] text-slate-400"><tr><th class="px-5 py-4">Session</th><th class="px-5 py-4">Schedule</th><th class="px-5 py-4">Room</th><th class="px-5 py-4">Capacity</th><th class="px-5 py-4">Status</th><th class="px-5 py-4 text-right">Actions</th></tr></thead>
          <tbody class="divide-y divide-white/[.07]">
            <tr v-if="loading"><td colspan="6" class="px-5 py-12 text-center text-slate-400">Loading program...</td></tr>
            <tr v-else-if="!sessions.length"><td colspan="6" class="px-5 py-12 text-center text-slate-400">No sessions are available for this event.</td></tr>
            <tr v-for="session in sessions" v-else :key="session.id" class="transition hover:bg-cyan-300/[.035]">
              <td class="px-5 py-4"><p class="font-bold text-white">{{ session.title }}</p><p class="mt-1 text-xs capitalize text-cyan-200">{{ session.session_type || 'session' }}</p></td>
              <td class="px-5 py-4 text-sm text-slate-300"><p>{{ formatDay(session.start_at) }}</p><p class="mt-1 text-xs text-slate-500">{{ formatTime(session.start_at) }}–{{ formatTime(session.end_at) }}</p></td>
              <td class="px-5 py-4 text-sm text-slate-300">{{ session.room_name || 'TBA' }}</td><td class="px-5 py-4 text-sm text-slate-300">{{ session.capacity || '—' }}</td>
              <td class="px-5 py-4"><span class="status-pill" :class="session.status === 'published' ? 'status-live' : session.status === 'canceled' ? 'status-off' : 'status-draft'">{{ session.status || 'published' }}</span></td>
              <td class="px-5 py-4"><div class="flex justify-end gap-2"><button class="table-button" @click="openEdit(session)">Edit</button><button class="table-button border-red-300/20 text-red-200 hover:border-red-300/50" @click="removeSession(session)">Delete</button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body"><div v-if="modalOpen" class="modal-backdrop" @click.self="closeModal"><form class="modal-card" @submit.prevent="saveSession">
      <div class="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7"><div><p class="text-xs uppercase tracking-[.24em] text-cyan-200">Program editor</p><h2 class="mt-2 text-2xl font-black">{{ editingId ? 'Update session' : 'Create session' }}</h2></div><button type="button" class="modal-close" aria-label="Close" @click="closeModal">×</button></div>
      <div class="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-6 sm:px-7">
        <label class="field"><span>Session title</span><input v-model.trim="form.title" required /></label><label class="field"><span>Slug</span><input v-model.trim="form.slug" placeholder="business-forum-opening" /></label><label class="field"><span>Description</span><textarea v-model.trim="form.description" rows="3" /></label>
        <div class="grid gap-4 sm:grid-cols-2"><label class="field"><span>Session type</span><input v-model.trim="form.session_type" placeholder="panel" /></label><label class="field"><span>Room</span><input v-model.trim="form.room_name" placeholder="Grand Ballroom" /></label></div>
        <div class="grid gap-4 sm:grid-cols-2"><label class="field"><span>Starts at</span><input v-model="form.start_at" type="datetime-local" required /></label><label class="field"><span>Ends at</span><input v-model="form.end_at" type="datetime-local" required /></label></div>
        <div class="grid gap-4 sm:grid-cols-2"><label class="field"><span>Capacity</span><input v-model.number="form.capacity" type="number" min="1" /></label><label class="field"><span>Status</span><select v-model="form.status"><option value="draft">Draft</option><option value="published">Published</option><option value="canceled">Canceled</option></select></label></div>
      </div>
      <div class="flex justify-end gap-3 border-t border-white/10 px-5 py-5 sm:px-7"><button type="button" class="action-secondary" @click="closeModal">Cancel</button><button class="action-primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save session' }}</button></div>
    </form></div></Teleport>
  </section>
</template>

<script setup lang="ts">
import { useEvent, type EventItem, type SessionItem } from '~/composables/useEvent';
import { useAdminContent, type SessionMutationPayload } from '~/composables/useAdminContent';
definePageMeta({ middleware: ['auth', 'admin'] }); useSeoMeta({ title: 'Manage Program | IWBIF 2026' });
const { getEvents } = useEvent(); const adminApi = useAdminContent();
const { data: eventResponse } = await useAsyncData('admin-program-events', () => getEvents(1, 100));
const events = computed<EventItem[]>(() => eventResponse.value?.data || []); const selectedEventId = ref(events.value[0]?.id || ''); const selectedEvent = computed(() => events.value.find(item => item.id === selectedEventId.value));
const sessions = ref<SessionItem[]>([]); const loading = ref(false); const saving = ref(false); const editingId = ref(''); const modalOpen = ref(false); const feedback = ref(''); const feedbackTone = ref<'success'|'error'>('success');
type SessionForm = Omit<SessionMutationPayload, 'start_at'|'end_at'> & { start_at:string; end_at:string };
const emptyForm = ():SessionForm => ({ title:'', slug:'', description:'', session_type:'session', room_name:'', start_at:'', end_at:'', capacity:null, status:'published' }); const form = reactive<SessionForm>(emptyForm());
const apiError=(error:unknown)=>{const value=error as {data?:{message?:string;errors?:Array<{message:string}>}};return value.data?.errors?.[0]?.message||value.data?.message||(error instanceof Error?error.message:'The session could not be saved.');};
const localDate=(value:string)=>{const date=new Date(value);return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);};
const loadSessions=async()=>{if(!selectedEvent.value?.slug){sessions.value=[];return;}loading.value=true;try{sessions.value=(await adminApi.getSessions(selectedEvent.value.slug)).data||[];}catch(error){feedbackTone.value='error';feedback.value=apiError(error);}finally{loading.value=false;}};
const resetForm=()=>{editingId.value='';Object.assign(form,emptyForm());}; const openCreate=()=>{resetForm();modalOpen.value=true;};
const openEdit=(session:SessionItem)=>{editingId.value=session.id;Object.assign(form,{title:session.title,slug:session.slug||'',description:session.description||'',session_type:session.session_type||'session',room_name:session.room_name||'',start_at:localDate(session.start_at),end_at:localDate(session.end_at),capacity:session.capacity??null,status:session.status||'published'});modalOpen.value=true;};
const closeModal=()=>{modalOpen.value=false;resetForm();};
const saveSession=async()=>{if(!selectedEventId.value||saving.value)return;if(new Date(form.end_at)<=new Date(form.start_at)){feedbackTone.value='error';feedback.value='End time must be after start time.';return;}saving.value=true;const payload={...form,slug:form.slug||null,description:form.description||null,room_name:form.room_name||null,capacity:form.capacity||null,start_at:new Date(form.start_at).toISOString(),end_at:new Date(form.end_at).toISOString()};try{if(editingId.value)await adminApi.updateSession(editingId.value,payload);else await adminApi.createSession({...payload,event_id:selectedEventId.value});feedbackTone.value='success';feedback.value=editingId.value?'Session updated.':'Session created.';closeModal();await loadSessions();}catch(error){feedbackTone.value='error';feedback.value=apiError(error);}finally{saving.value=false;}};
const removeSession=async(session:SessionItem)=>{if(!window.confirm(`Delete session "${session.title}"?`))return;try{await adminApi.deleteSession(session.id);feedbackTone.value='success';feedback.value='Session deleted.';await loadSessions();}catch(error){feedbackTone.value='error';feedback.value=apiError(error);}};
watch(selectedEventId,loadSessions); if(selectedEventId.value)await loadSessions();
const formatDay=(value:string)=>new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeZone:'Asia/Jakarta'}).format(new Date(value)); const formatTime=(value:string)=>new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'}).format(new Date(value));
</script>

<style scoped>
.field{display:block;font-size:.875rem;color:#cbd5e1}.field span{display:block;margin-bottom:.5rem}.field input,.field select,.field textarea{width:100%;border:1px solid rgba(255,255,255,.1);border-radius:1rem;background:rgba(2,6,23,.82);padding:.75rem 1rem;color:white;outline:none}.field input:focus,.field select:focus,.field textarea:focus{border-color:rgba(103,232,249,.55);box-shadow:0 0 0 3px rgba(103,232,249,.08)}
.action-primary,.action-secondary,.table-button{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:.7rem 1.15rem;font-size:.875rem;font-weight:700;transition:.18s}.action-primary{background:#67e8f9;color:#082f49}.action-primary:hover{filter:brightness(1.08)}.action-primary:disabled{opacity:.5}.action-secondary,.table-button{border:1px solid rgba(255,255,255,.15);color:#e2e8f0}.action-secondary:hover,.table-button:hover{border-color:rgba(103,232,249,.45);color:white}.table-button{padding:.45rem .85rem;font-size:.75rem}.status-pill{display:inline-flex;border-radius:999px;padding:.35rem .7rem;font-size:.65rem;font-weight:800;text-transform:uppercase;letter-spacing:.12em}.status-live{background:rgba(52,211,153,.12);color:#a7f3d0}.status-draft{background:rgba(251,191,36,.12);color:#fde68a}.status-off{background:rgba(248,113,113,.12);color:#fecaca}
.modal-backdrop{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:rgba(2,6,23,.78);padding:1rem;backdrop-filter:blur(12px)}.modal-card{width:min(100%,46rem);overflow:hidden;border:1px solid rgba(255,255,255,.13);border-radius:2rem;background:linear-gradient(145deg,#071a36,#020d20);color:white;box-shadow:0 35px 100px rgba(0,0,0,.55)}.modal-close{display:flex;height:2.5rem;width:2.5rem;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.12);border-radius:999px;font-size:1.5rem;color:#cbd5e1}
</style>
