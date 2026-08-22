<template>
  <section class="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="text-xs uppercase tracking-[.3em] text-cyan-200">Admin settings</p>
        <h1 class="mt-3 text-3xl font-black sm:text-4xl">Email notifications</h1>
        <p class="mt-3 max-w-2xl text-slate-400">Manage event email templates, preview their content, send a test, and review delivery history.</p>
      </div>
      <label class="field min-w-64"><span>Event</span><select v-model="eventId"><option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option></select></label>
    </div>

    <p v-if="feedback" class="notice" :class="feedbackTone">{{ feedback }}</p>
    <div v-if="!eventId" class="empty mt-8">No event is available. Create an event before configuring email notifications.</div>

    <div v-else class="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside class="glass-card h-fit rounded-3xl p-3">
        <p class="px-3 py-2 text-xs font-bold uppercase tracking-[.2em] text-slate-400">Templates</p>
        <button v-for="template in templates" :key="template.notification_type" type="button" class="template-button" :class="{ active: selectedType === template.notification_type }" @click="selectTemplate(template)">
          <span><strong>{{ template.name || typeLabel(template.notification_type) }}</strong><small>{{ template.notification_type }}</small></span>
          <i :class="template.is_enabled ? 'enabled' : 'disabled'">{{ template.is_enabled ? 'On' : 'Off' }}</i>
        </button>
        <p v-if="loading" class="px-3 py-6 text-sm text-slate-400">Loading templates...</p>
        <p v-else-if="!templates.length" class="px-3 py-6 text-sm text-slate-400">No templates returned by the API.</p>
      </aside>

      <div class="space-y-6">
        <form v-if="selected" class="glass-card rounded-3xl p-5 sm:p-7" @submit.prevent="save">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div><p class="text-xs uppercase tracking-[.2em] text-cyan-200">Template editor</p><h2 class="mt-2 text-2xl font-bold">{{ selected.name || typeLabel(selected.notification_type) }}</h2></div>
            <label class="toggle"><input v-model="form.is_enabled" type="checkbox" /><span>{{ form.is_enabled ? 'Enabled' : 'Disabled' }}</span></label>
          </div>
          <label class="field mt-6"><span>Email subject</span><input v-model.trim="form.subject" required /></label>
          <label class="field mt-4"><span>HTML body</span><textarea v-model="form.body_html" rows="12" placeholder="<p>Hello {{ full_name }}</p>" /></label>
          <label class="field mt-4"><span>Plain-text body</span><textarea v-model="form.body_text" rows="7" placeholder="Fallback content for email clients that do not render HTML." /></label>
          <div v-if="selected.available_variables?.length" class="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p class="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Available variables</p>
            <div class="mt-3 flex flex-wrap gap-2"><button v-for="variable in selected.available_variables" :key="variable" type="button" class="variable" @click="appendVariable(variable)">{{ normalizeVariable(variable) }}</button></div>
          </div>
          <div class="mt-6 flex flex-wrap gap-3">
            <button class="primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save template' }}</button>
            <button type="button" class="secondary" :disabled="previewing" @click="preview">{{ previewing ? 'Loading...' : 'Preview' }}</button>
          </div>
        </form>

        <section v-if="selected" class="glass-card rounded-3xl p-5 sm:p-7">
          <h2 class="text-xl font-bold">Send a test email</h2>
          <form class="mt-4 flex flex-col gap-3 sm:flex-row" @submit.prevent="testSend"><input v-model.trim="testEmail" class="input flex-1" type="email" placeholder="recipient@example.com" required /><button class="secondary" :disabled="testing">{{ testing ? 'Sending...' : 'Send test' }}</button></form>
        </section>

        <section class="glass-card overflow-hidden rounded-3xl">
          <div class="flex items-center justify-between gap-4 p-5 sm:p-7"><div><h2 class="text-xl font-bold">Delivery history</h2><p class="mt-1 text-sm text-slate-400">Latest messages for this event.</p></div><button type="button" class="secondary" :disabled="historyLoading" @click="loadHistory">Refresh</button></div>
          <div class="overflow-x-auto"><table><thead><tr><th>Recipient</th><th>Template</th><th>Status</th><th>Sent</th></tr></thead><tbody><tr v-for="item in deliveries" :key="item.id"><td>{{ item.recipient_email || item.recipient || '—' }}</td><td>{{ typeLabel(item.notification_type || '') }}</td><td><span class="status" :class="item.status">{{ item.status }}</span><small v-if="item.error_message" class="error-text">{{ item.error_message }}</small></td><td>{{ formatDate(item.sent_at || item.created_at) }}</td></tr><tr v-if="!historyLoading && !deliveries.length"><td colspan="4" class="empty">No delivery history yet.</td></tr></tbody></table></div>
        </section>
      </div>
    </div>

    <Teleport to="body"><div v-if="previewOpen" class="backdrop" @click.self="previewOpen=false"><article class="preview-modal"><header><div><p class="text-xs uppercase tracking-[.2em] text-cyan-200">Email preview</p><h2>{{ previewData?.subject }}</h2></div><button type="button" @click="previewOpen=false">×</button></header><div class="preview-body"><div v-if="previewData?.body_html" v-html="previewData.body_html" /><pre v-else>{{ previewData?.body_text }}</pre></div></article></div></Teleport>
  </section>
</template>

<script setup lang="ts">
import { useEmailNotifications, type EmailDeliveryItem, type EmailNotificationTemplate, type EmailPreview } from '~/composables/useEmailNotifications';
import { useEvent, type EventItem } from '~/composables/useEvent';

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Email Notifications | IWBIF 2026' });

const emailApi = useEmailNotifications();
const { getEvents } = useEvent();
const { data: eventResponse } = await useAsyncData('email-notification-events', () => getEvents(1, 100));
const events = computed<EventItem[]>(() => eventResponse.value?.data || []);
const eventId = ref(events.value[0]?.id || '');
const templates = ref<EmailNotificationTemplate[]>([]);
const selectedType = ref('');
const deliveries = ref<EmailDeliveryItem[]>([]);
const loading = ref(false), saving = ref(false), previewing = ref(false), testing = ref(false), historyLoading = ref(false);
const feedback = ref(''), feedbackTone = ref<'success' | 'error'>('success');
const testEmail = ref('');
const previewOpen = ref(false), previewData = ref<EmailPreview | null>(null);
const form = reactive({ subject: '', body_html: '', body_text: '', is_enabled: true });
const selected = computed(() => templates.value.find(item => item.notification_type === selectedType.value));
const payload = () => ({ subject: form.subject, body_html: form.body_html || null, body_text: form.body_text || null, is_enabled: form.is_enabled });
const apiError = (error: unknown) => { const value = error as { data?: { message?: string; errors?: Array<{ message: string }> } }; return value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : 'The operation could not be completed.'); };
const selectTemplate = (item: EmailNotificationTemplate) => { selectedType.value = item.notification_type; Object.assign(form, { subject: item.subject || '', body_html: item.body_html || '', body_text: item.body_text || '', is_enabled: item.is_enabled !== false }); };
const loadTemplates = async () => { if (!eventId.value) return; loading.value = true; feedback.value = ''; try { templates.value = (await emailApi.getTemplates(eventId.value)).data || []; const next = templates.value.find(item => item.notification_type === selectedType.value) || templates.value.at(0); if (next) selectTemplate(next); } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); templates.value = []; } finally { loading.value = false; } };
const loadHistory = async () => { if (!eventId.value) return; historyLoading.value = true; try { deliveries.value = (await emailApi.getDeliveryHistory(eventId.value)).data || []; } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } finally { historyLoading.value = false; } };
const save = async () => { if (!selected.value) return; saving.value = true; try { const result = await emailApi.updateTemplate(eventId.value, selected.value.notification_type, payload()); const index = templates.value.findIndex(item => item.notification_type === selectedType.value); templates.value[index] = result.data; selectTemplate(result.data); feedbackTone.value = 'success'; feedback.value = 'Email template saved.'; } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } finally { saving.value = false; } };
const preview = async () => { if (!selected.value) return; previewing.value = true; try { previewData.value = (await emailApi.previewTemplate(eventId.value, selected.value.notification_type, payload())).data; previewOpen.value = true; } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } finally { previewing.value = false; } };
const testSend = async () => { if (!selected.value) return; testing.value = true; try { await emailApi.sendTest(eventId.value, selected.value.notification_type, testEmail.value); feedbackTone.value = 'success'; feedback.value = `Test email queued for ${testEmail.value}.`; await loadHistory(); } catch (error) { feedbackTone.value = 'error'; feedback.value = apiError(error); } finally { testing.value = false; } };
const appendVariable = (variable: string) => { const token = normalizeVariable(variable); form.body_html += token; };
const normalizeVariable = (variable: string) => variable.includes('{{') ? variable : `{{ ${variable} }}`;
const typeLabel = (value: string) => value ? value.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase()) : '—';
const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
watch(eventId, async () => { selectedType.value = ''; await Promise.all([loadTemplates(), loadHistory()]); });
if (eventId.value) await Promise.all([loadTemplates(), loadHistory()]);
</script>

<style scoped>
.field span{display:block;margin-bottom:.5rem;font-size:.8rem;color:#cbd5e1}.field input,.field select,.field textarea,.input{width:100%;border:1px solid #ffffff1a;border-radius:1rem;background:#020617cc;padding:.8rem 1rem;color:white;outline:none}.field textarea{font-family:ui-monospace,monospace;font-size:.85rem}.field input:focus,.field select:focus,.field textarea:focus,.input:focus{border-color:#67e8f980;box-shadow:0 0 0 3px #67e8f91a}.template-button{display:flex;width:100%;align-items:center;justify-content:space-between;gap:.75rem;border-radius:1rem;padding:.8rem;text-align:left;transition:.15s}.template-button:hover,.template-button.active{background:#67e8f912}.template-button strong,.template-button small{display:block}.template-button strong{font-size:.85rem}.template-button small{margin-top:.2rem;color:#64748b;font-size:.68rem}.template-button i{border-radius:999px;padding:.25rem .5rem;font-style:normal;font-size:.65rem;font-weight:800}.template-button i.enabled{background:#34d39920;color:#a7f3d0}.template-button i.disabled{background:#f8717120;color:#fecaca}.toggle{display:flex;align-items:center;gap:.6rem;color:#cbd5e1}.primary,.secondary{border-radius:999px;padding:.7rem 1.15rem;font-size:.85rem;font-weight:800}.primary{background:#67e8f9;color:#083344}.secondary{border:1px solid #ffffff26;color:white}.primary:disabled,.secondary:disabled{opacity:.45}.variable{border-radius:999px;background:#22d3ee1a;padding:.3rem .65rem;font-family:ui-monospace,monospace;font-size:.7rem;color:#a5f3fc}.notice,.empty{border:1px solid #ffffff1a;border-radius:1rem;background:#ffffff08;padding:1rem;color:#cbd5e1}.notice{margin-top:1.5rem}.notice.success{border-color:#6ee7b74d;background:#064e3b4d}.notice.error{border-color:#fca5a54d;background:#7f1d1d4d}table{width:100%;min-width:650px;text-align:left}th,td{padding:1rem 1.5rem}th{background:#ffffff08;font-size:.68rem;text-transform:uppercase;letter-spacing:.15em;color:#94a3b8}td{border-top:1px solid #ffffff12;font-size:.82rem;color:#cbd5e1}.status{border-radius:999px;background:#ffffff12;padding:.3rem .6rem;font-size:.68rem;font-weight:800;text-transform:uppercase}.status.sent,.status.success{background:#34d39920;color:#a7f3d0}.status.failed,.status.error{background:#f8717120;color:#fecaca}.error-text{display:block;margin-top:.4rem;color:#fca5a5}.backdrop{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem;background:#020617dc;backdrop-filter:blur(10px)}.preview-modal{width:min(100%,50rem);max-height:90vh;overflow:hidden;border:1px solid #ffffff21;border-radius:2rem;background:#fff;color:#0f172a}.preview-modal header{display:flex;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid #e2e8f0;padding:1.25rem 1.5rem}.preview-modal h2{margin-top:.3rem;font-size:1.15rem;font-weight:800}.preview-modal header button{font-size:1.8rem}.preview-body{max-height:70vh;overflow:auto;padding:2rem}.preview-body pre{white-space:pre-wrap;font-family:inherit}
</style>
