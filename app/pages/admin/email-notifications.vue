<template>
  <section class="notification-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Komunikasi peserta</p>
        <h1>Pengaturan Email Otomatis</h1>
        <p>Atur kapan email dikirim, buat pengecualian untuk peserta tertentu, dan periksa hasil pengirimannya.</p>
      </div>
      <label class="field event-picker">
        <span>Acara yang diatur</span>
        <select v-model="eventId">
          <option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option>
        </select>
      </label>
    </header>

    <p v-if="feedback" class="notice" :class="feedbackTone" role="status">{{ feedback }}</p>
    <div v-if="!eventId" class="empty-state">Belum ada acara yang dapat diatur.</div>

    <template v-else>
      <nav class="section-tabs" aria-label="Bagian pengaturan email">
        <button type="button" :class="{ active: activeSection === 'general' }" @click="activeSection='general'">
          <span class="tab-number">1</span><span><strong>Aturan umum</strong><small>Berlaku untuk semua peserta</small></span>
        </button>
        <button type="button" :class="{ active: activeSection === 'account' }" @click="activeSection='account'">
          <span class="tab-number">2</span><span><strong>Per peserta</strong><small>Buat pengecualian khusus</small></span>
        </button>
        <button type="button" :class="{ active: activeSection === 'history' }" @click="activeSection='history'">
          <span class="tab-number">3</span><span><strong>Riwayat</strong><small>Lihat email berhasil dan gagal</small></span>
        </button>
      </nav>

      <section v-if="activeSection === 'general'" class="section-content">
        <div class="section-intro">
          <div><p class="step-label">Langkah 1</p><h2>Tentukan email yang dikirim otomatis</h2><p>Matikan jenis email yang tidak ingin dikirim kepada siapa pun. Anda tetap dapat mengubah isi email sebelum mengaktifkannya.</p></div>
          <div class="summary-card"><strong>{{ activeTemplateCount }}</strong><span>dari {{ templates.length }} jenis email aktif</span></div>
        </div>

        <div class="template-layout">
          <aside class="template-list glass-card">
            <p class="list-title">Pilih jenis email</p>
            <button v-for="template in templates" :key="template.trigger" type="button" class="template-button" :class="{ active: selectedType === template.trigger }" @click="selectTemplate(template)">
              <span><strong>{{ triggerInfo(template.trigger).title }}</strong><small>{{ triggerInfo(template.trigger).description }}</small></span>
              <i :class="template.is_enabled ? 'enabled' : 'disabled'">{{ template.is_enabled ? 'Aktif' : 'Nonaktif' }}</i>
            </button>
            <p v-if="loading" class="loading-copy">Memuat jenis email…</p>
            <p v-else-if="!templates.length" class="loading-copy">Belum ada template email.</p>
          </aside>

          <div class="editor-stack">
            <form v-if="selected" class="glass-card editor-card" @submit.prevent="saveTemplate">
              <div class="editor-head">
                <div><p class="step-label">Isi email</p><h2>{{ triggerInfo(selected.trigger).title }}</h2><p>{{ triggerInfo(selected.trigger).description }}</p></div>
                <label class="switch-control">
                  <input v-model="form.is_enabled" type="checkbox">
                  <span aria-hidden="true" />
                  <strong>{{ form.is_enabled ? 'Kirim otomatis' : 'Jangan dikirim' }}</strong>
                </label>
              </div>

              <div class="master-explanation" :class="form.is_enabled ? 'enabled' : 'disabled'">
                <strong>{{ form.is_enabled ? 'Email ini akan dikirim' : 'Email ini dimatikan untuk semua peserta' }}</strong>
                <p>{{ form.is_enabled ? 'Pengaturan khusus peserta masih dapat mematikan email ini.' : 'Pengaturan peserta tidak dapat mengaktifkannya selama aturan umum ini nonaktif.' }}</p>
              </div>

              <label class="field"><span>Judul email</span><input v-model.trim="form.subject_template" required></label>
              <label class="field"><span>Isi pesan</span><textarea v-model="form.body_template" rows="13" required /></label>

              <div v-if="selected.available_variables.length" class="variable-box">
                <p><strong>Masukkan data peserta secara otomatis</strong><small>Klik salah satu pilihan untuk menambahkannya ke isi pesan.</small></p>
                <div class="variable-list"><button v-for="variable in selected.available_variables" :key="variable" type="button" class="variable" @click="appendVariable(variable)">+ {{ variableLabel(variable) }}</button></div>
              </div>

              <div class="form-actions">
                <button class="primary" :disabled="saving || !templateDirty">{{ saving ? 'Menyimpan…' : templateDirty ? 'Simpan perubahan' : 'Sudah tersimpan' }}</button>
                <button type="button" class="secondary" @click="previewTemplate">Lihat contoh</button>
              </div>
            </form>

            <section v-if="selected" class="glass-card test-card">
              <div><h3>Kirim email percobaan</h3><p>Gunakan alamat Anda sendiri untuk memastikan tampilan email sudah benar.</p></div>
              <form @submit.prevent="testSend">
                <input v-model.trim="testEmail" class="input" type="email" placeholder="nama@perusahaan.com" required>
                <button class="secondary" :disabled="testing || templateDirty">{{ testing ? 'Mengirim…' : 'Kirim percobaan' }}</button>
              </form>
              <small v-if="templateDirty">Simpan perubahan terlebih dahulu sebelum mengirim percobaan.</small>
            </section>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'account'" class="section-content">
        <div class="section-intro">
          <div><p class="step-label">Langkah 2</p><h2>Buat pengecualian untuk peserta tertentu</h2><p>Pilih peserta, lalu tentukan email yang tetap mengikuti aturan umum atau tidak boleh dikirim kepada peserta tersebut.</p></div>
        </div>

        <div class="account-grid">
          <aside class="glass-card account-picker">
            <label class="field"><span>Cari peserta</span><input v-model.trim="userSearch" type="search" placeholder="Ketik nama atau email"></label>
            <div class="user-results">
              <p v-if="usersLoading" class="loading-copy">Memuat daftar peserta…</p>
              <button v-for="user in filteredUsers" v-else :key="user.id" type="button" :class="{ active: selectedUserId === user.id }" @click="selectUser(user.id)">
                <span class="user-avatar">{{ userInitials(user) }}</span><span><strong>{{ user.full_name || 'Nama belum diisi' }}</strong><small>{{ user.email }}</small></span>
              </button>
              <p v-if="!usersLoading && !filteredUsers.length" class="loading-copy">Peserta tidak ditemukan.</p>
            </div>
          </aside>

          <div class="glass-card preference-panel">
            <div v-if="!selectedUser" class="empty-state compact"><strong>Pilih seorang peserta</strong><span>Pengaturan khusus peserta akan tampil di sini.</span></div>
            <template v-else>
              <header class="selected-user">
                <span class="user-avatar large">{{ userInitials(selectedUser) }}</span>
                <div><p class="step-label">Pengaturan untuk</p><h2>{{ selectedUser.full_name || 'Nama belum diisi' }}</h2><p>{{ selectedUser.email }}</p></div>
              </header>

              <div class="preference-guide">
                <span><i class="dot default" />Ikuti aturan umum <small>Disarankan</small></span>
                <span><i class="dot off" />Jangan kirim <small>Pengecualian</small></span>
              </div>

              <p v-if="preferencesLoading" class="loading-copy padded">Memuat pengaturan peserta…</p>
              <div v-else class="preference-list">
                <article v-for="preference in accountPreferences" :key="preference.trigger" class="preference-row">
                  <div class="preference-copy"><strong>{{ triggerInfo(preference.trigger).title }}</strong><small>{{ triggerInfo(preference.trigger).description }}</small></div>
                  <div class="preference-control">
                    <label :for="`preference-${preference.trigger}`">Aturan untuk peserta ini</label>
                    <select :id="`preference-${preference.trigger}`" v-model="preferenceDraft[preference.trigger]">
                      <option value="default">Ikuti aturan umum (disarankan)</option>
                      <option value="enabled">Kirim jika aturan umum aktif</option>
                      <option value="disabled">Jangan kirim email ini</option>
                    </select>
                    <p class="effective-status" :class="effectiveFor(preference) ? 'on' : 'off'">{{ effectiveFor(preference) ? 'Email akan dikirim' : 'Email tidak akan dikirim' }}</p>
                    <small v-if="!preference.global_enabled">Aturan umum sedang nonaktif, sehingga email ini tetap tidak dikirim.</small>
                  </div>
                </article>
              </div>

              <div class="preference-actions">
                <p>{{ changedPreferenceCount ? `${changedPreferenceCount} perubahan belum disimpan` : 'Semua pengaturan sudah tersimpan' }}</p>
                <button class="primary" type="button" :disabled="preferencesSaving || !changedPreferenceCount" @click="savePreferences">{{ preferencesSaving ? 'Menyimpan…' : 'Simpan pengaturan peserta' }}</button>
              </div>
            </template>
          </div>
        </div>
      </section>

      <section v-else class="section-content">
        <div class="section-intro">
          <div><p class="step-label">Langkah 3</p><h2>Periksa riwayat pengiriman</h2><p>Lihat email terbaru, penerima, dan apakah pengirimannya berhasil.</p></div>
          <button type="button" class="secondary" :disabled="historyLoading" @click="loadHistory">{{ historyLoading ? 'Memuat…' : 'Perbarui riwayat' }}</button>
        </div>

        <div class="history-summary">
          <div><strong>{{ deliveryCounts.sent }}</strong><span>Berhasil dikirim</span></div>
          <div><strong>{{ deliveryCounts.failed }}</strong><span>Gagal dikirim</span></div>
          <div><strong>{{ deliveries.length }}</strong><span>Total ditampilkan</span></div>
        </div>

        <div class="glass-card history-table">
          <div class="table-scroll data-table-shell"><table><thead><tr><th>Penerima</th><th>Jenis email</th><th>Status</th><th>Waktu</th></tr></thead><tbody><tr v-for="item in deliveries" :key="item.id"><td data-label="Penerima"><strong>{{ item.recipient }}</strong><small>{{ item.subject }}</small></td><td data-label="Jenis email">{{ triggerInfo(item.trigger).title }}</td><td data-label="Status"><span class="delivery-status" :class="item.status">{{ deliveryStatusLabel(item.status) }}</span><small v-if="item.error_message" class="error-text">{{ item.error_message }}</small></td><td data-label="Waktu">{{ formatDate(item.sent_at || item.created_at) }}</td></tr><tr v-if="!historyLoading && !deliveries.length"><td colspan="4" class="empty-cell">Belum ada riwayat pengiriman.</td></tr></tbody></table></div>
        </div>
      </section>
    </template>

    <Teleport to="body">
      <div v-if="previewOpen" class="backdrop" @click.self="previewOpen=false">
        <article class="preview-modal">
          <header><div><p class="eyebrow">Contoh email</p><h2>{{ previewData?.subject }}</h2></div><button type="button" aria-label="Tutup contoh email" @click="previewOpen=false">×</button></header>
          <pre>{{ previewData?.body }}</pre>
        </article>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { useAdminOperations, type AdminUserItem } from '~/composables/useAdminOperations';
import { useEmailNotifications, type EmailAccountPreference, type EmailDeliveryItem, type EmailNotificationTemplate, type EmailPreview } from '~/composables/useEmailNotifications';
import { useEvent, type EventItem } from '~/composables/useEvent';

definePageMeta({ middleware: ['auth', 'admin'] });
useSeoMeta({ title: 'Pengaturan Email Otomatis | IWBIF 2026' });

type Section = 'general' | 'account' | 'history';
type PreferenceChoice = 'default' | 'enabled' | 'disabled';

const TRIGGER_CONTENT: Record<string, { title: string; description: string }> = {
  account_registered: { title: 'Akun berhasil dibuat', description: 'Dikirim setelah peserta selesai membuat akun.' },
  registration_submitted: { title: 'Pendaftaran diterima', description: 'Dikirim setelah formulir pendaftaran diserahkan.' },
  delegate_package_selected: { title: 'Paket delegate dipilih', description: 'Dikirim ketika peserta memilih paket delegate.' },
  exhibitor_package_selected: { title: 'Paket exhibitor dipilih', description: 'Dikirim ketika peserta memilih paket exhibitor.' },
  payment_confirmed: { title: 'Pembayaran berhasil', description: 'Dikirim setelah pembayaran dikonfirmasi oleh sistem.' },
  business_matching_profile_saved: { title: 'Profil business matching tersimpan', description: 'Dikirim setelah peserta menyimpan profil business matching.' },
  meeting_requested: { title: 'Permintaan pertemuan baru', description: 'Dikirim ketika peserta menerima permintaan pertemuan.' },
  meeting_accepted: { title: 'Pertemuan diterima', description: 'Dikirim ketika permintaan pertemuan diterima.' },
  meeting_confirmed: { title: 'Jadwal pertemuan dikonfirmasi', description: 'Dikirim ketika waktu dan lokasi pertemuan sudah pasti.' },
  meeting_declined: { title: 'Pertemuan ditolak', description: 'Dikirim ketika permintaan pertemuan ditolak.' },
  meeting_cancelled: { title: 'Pertemuan dibatalkan', description: 'Dikirim ketika pertemuan yang sudah dibuat dibatalkan.' },
  meeting_reschedule_requested: { title: 'Permintaan perubahan jadwal', description: 'Dikirim ketika ada permintaan untuk mengubah jadwal.' }
};
const VARIABLE_LABELS: Record<string, string> = {
  participant_name: 'Nama peserta', event_name: 'Nama acara', login_url: 'Tautan masuk', registration_number: 'Nomor pendaftaran',
  package_name: 'Nama paket', package_code: 'Kode paket', amount: 'Nominal', currency: 'Mata uang', order_number: 'Nomor pesanan',
  paid_at: 'Waktu pembayaran', counterparty_name: 'Nama lawan pertemuan', meeting_topic: 'Topik pertemuan', meeting_schedule: 'Jadwal pertemuan', meeting_venue: 'Lokasi pertemuan'
};

const emailApi = useEmailNotifications();
const adminApi = useAdminOperations();
const { getEvents } = useEvent();
const { data: eventResponse } = await useAsyncData('email-notification-events', () => getEvents(1, 100));
const events = computed<EventItem[]>(() => eventResponse.value?.data || []);
const eventId = ref(events.value[0]?.id || '');
const activeSection = ref<Section>('general');
const templates = ref<EmailNotificationTemplate[]>([]);
const selectedType = ref('');
const deliveries = ref<EmailDeliveryItem[]>([]);
const users = ref<AdminUserItem[]>([]);
const selectedUserId = ref('');
const userSearch = ref('');
const accountPreferences = ref<EmailAccountPreference[]>([]);
const preferenceDraft = reactive<Record<string, PreferenceChoice>>({});
const loading = ref(false), saving = ref(false), testing = ref(false), historyLoading = ref(false), usersLoading = ref(false), preferencesLoading = ref(false), preferencesSaving = ref(false);
const feedback = ref(''), feedbackTone = ref<'success' | 'error'>('success');
const testEmail = ref('');
const previewOpen = ref(false), previewData = ref<EmailPreview | null>(null);
const form = reactive({ subject_template: '', body_template: '', is_enabled: true });

const selected = computed(() => templates.value.find(item => item.trigger === selectedType.value));
const selectedUser = computed(() => users.value.find(user => user.id === selectedUserId.value));
const activeTemplateCount = computed(() => templates.value.filter(template => template.is_enabled).length);
const filteredUsers = computed(() => {
  const query = userSearch.value.toLowerCase();
  return users.value.filter(user => !query || `${user.full_name || ''} ${user.email}`.toLowerCase().includes(query)).slice(0, 60);
});
const templateDirty = computed(() => Boolean(selected.value && (
  selected.value.subject_template !== form.subject_template
  || selected.value.body_template !== form.body_template
  || selected.value.is_enabled !== form.is_enabled
)));
const deliveryCounts = computed(() => ({
  sent: deliveries.value.filter(item => ['sent', 'success'].includes(item.status.toLowerCase())).length,
  failed: deliveries.value.filter(item => ['failed', 'error'].includes(item.status.toLowerCase())).length
}));
const changedPreferenceCount = computed(() => accountPreferences.value.filter(preference => preferenceDraft[preference.trigger] !== preferenceChoice(preference.override_enabled)).length);

const triggerInfo = (trigger: string) => TRIGGER_CONTENT[trigger] || { title: trigger.replaceAll('_', ' '), description: 'Email otomatis untuk aktivitas peserta.' };
const variableLabel = (variable: string) => VARIABLE_LABELS[variable] || variable.replaceAll('_', ' ');
const preferenceChoice = (value: boolean | null): PreferenceChoice => value === null ? 'default' : value ? 'enabled' : 'disabled';
const choiceValue = (value: PreferenceChoice): boolean | null => value === 'default' ? null : value === 'enabled';
const effectiveFor = (preference: EmailAccountPreference) => preference.global_enabled && preferenceDraft[preference.trigger] !== 'disabled';
const selectedEventName = () => events.value.find(event => event.id === eventId.value)?.name || 'IWBIF 2026';
const sampleVariables = () => ({
  participant_name: 'Siti Rahma', event_name: selectedEventName(), login_url: 'https://iwbif.id/auth/login', registration_number: 'IWBIF-2026-001',
  package_name: 'Package A', package_code: 'A', amount: '10.000', currency: 'IDR', order_number: 'ORD-IWBIF-001', paid_at: '23 Agustus 2026, 14.30',
  counterparty_name: 'Maya Putri', meeting_topic: 'Peluang kerja sama', meeting_schedule: '16 Oktober 2026, 10.00', meeting_venue: 'Meeting Room A'
});
const renderSample = (value: string) => value.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => sampleVariables()[key as keyof ReturnType<typeof sampleVariables>] || `[${variableLabel(key)}]`);
const payload = () => ({ subject_template: form.subject_template, body_template: form.body_template, is_enabled: form.is_enabled });
const apiError = (error: unknown) => {
  const value = error as { status?: number; statusCode?: number; response?: { status?: number; _data?: { message?: string; errors?: Array<{ message: string }> } }; data?: { message?: string; errors?: Array<{ message: string }> } };
  const status = value.status || value.statusCode || value.response?.status;
  const data = value.data || value.response?._data;
  if (status === 404 && activeSection.value === 'account') return 'Pengaturan per peserta belum tersedia di server. Pastikan backend terbaru dan migration database sudah dijalankan.';
  return data?.errors?.[0]?.message || data?.message || (error instanceof Error ? error.message : 'Pengaturan tidak dapat diproses.');
};
const showFeedback = (message: string, tone: 'success' | 'error' = 'success') => {
  feedback.value = message;
  feedbackTone.value = tone;
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' });
};

const selectTemplate = (item: EmailNotificationTemplate) => {
  selectedType.value = item.trigger;
  Object.assign(form, { subject_template: item.subject_template, body_template: item.body_template, is_enabled: item.is_enabled });
};
const loadTemplates = async () => {
  if (!eventId.value) return;
  loading.value = true;
  try {
    templates.value = (await emailApi.getTemplates(eventId.value)).data || [];
    const next = templates.value.find(item => item.trigger === selectedType.value) || templates.value[0];
    if (next) selectTemplate(next);
  } catch (error) { showFeedback(apiError(error), 'error'); templates.value = []; }
  finally { loading.value = false; }
};
const loadHistory = async () => {
  if (!eventId.value) return;
  historyLoading.value = true;
  try { deliveries.value = (await emailApi.getDeliveryHistory(eventId.value)).data || []; }
  catch (error) { showFeedback(apiError(error), 'error'); }
  finally { historyLoading.value = false; }
};
const loadUsers = async () => {
  usersLoading.value = true;
  try {
    const first = await adminApi.getUsers(1, 100, 'participant', 'active');
    const pages = Math.max(first.meta?.pages || 1, 1);
    const remaining = pages > 1 ? await Promise.all(Array.from({ length: pages - 1 }, (_, index) => adminApi.getUsers(index + 2, 100, 'participant', 'active'))) : [];
    users.value = [first, ...remaining].flatMap(response => response.data || []).sort((a, b) => (a.full_name || a.email).localeCompare(b.full_name || b.email));
  } catch (error) { showFeedback(apiError(error), 'error'); }
  finally { usersLoading.value = false; }
};
const loadPreferences = async () => {
  if (!eventId.value || !selectedUserId.value) return;
  preferencesLoading.value = true;
  accountPreferences.value = [];
  for (const trigger of Object.keys(preferenceDraft)) Reflect.deleteProperty(preferenceDraft, trigger);
  try {
    accountPreferences.value = (await emailApi.getAccountPreferences(eventId.value, selectedUserId.value)).data || [];
    for (const preference of accountPreferences.value) preferenceDraft[preference.trigger] = preferenceChoice(preference.override_enabled);
  } catch (error) { showFeedback(apiError(error), 'error'); }
  finally { preferencesLoading.value = false; }
};
const selectUser = async (userId: string) => { selectedUserId.value = userId; await loadPreferences(); };
const saveTemplate = async () => {
  if (!selected.value || !templateDirty.value) return;
  saving.value = true;
  try {
    const result = await emailApi.updateTemplate(eventId.value, selected.value.trigger, payload());
    const index = templates.value.findIndex(item => item.trigger === result.data.trigger);
    if (index >= 0) templates.value[index] = result.data;
    selectTemplate(result.data);
    showFeedback('Pengaturan email berhasil disimpan.');
  } catch (error) { showFeedback(apiError(error), 'error'); }
  finally { saving.value = false; }
};
const previewTemplate = () => {
  previewData.value = { subject: renderSample(form.subject_template), body: renderSample(form.body_template) };
  previewOpen.value = true;
};
const testSend = async () => {
  if (!selected.value || templateDirty.value) return;
  testing.value = true;
  try {
    const result = await emailApi.sendTest(eventId.value, selected.value.trigger, testEmail.value, sampleVariables());
    showFeedback(result.data.sent ? `Email percobaan berhasil dikirim ke ${testEmail.value}.` : 'Email tidak terkirim. Periksa status template dan konfigurasi SMTP.', result.data.sent ? 'success' : 'error');
    await loadHistory();
  } catch (error) { showFeedback(apiError(error), 'error'); }
  finally { testing.value = false; }
};
const savePreferences = async () => {
  if (!selectedUser.value || !changedPreferenceCount.value) return;
  preferencesSaving.value = true;
  try {
    const changed = accountPreferences.value.filter(preference => preferenceDraft[preference.trigger] !== preferenceChoice(preference.override_enabled));
    for (const preference of changed) {
      const choice = preferenceDraft[preference.trigger] ?? preferenceChoice(preference.override_enabled);
      await emailApi.updateAccountPreference(eventId.value, selectedUser.value.id, preference.trigger, choiceValue(choice));
    }
    await loadPreferences();
    showFeedback(`Pengaturan email untuk ${selectedUser.value.full_name || selectedUser.value.email} berhasil disimpan.`);
  } catch (error) { showFeedback(apiError(error), 'error'); }
  finally { preferencesSaving.value = false; }
};
const appendVariable = (variable: string) => {
  const separator = form.body_template.endsWith(' ') || form.body_template.endsWith('\n') ? '' : ' ';
  form.body_template += `${separator}{{ ${variable} }}`;
};
const userInitials = (user: AdminUserItem) => (user.full_name || user.email).split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('');
const deliveryStatusLabel = (status: string) => ['sent', 'success'].includes(status.toLowerCase()) ? 'Berhasil' : ['failed', 'error'].includes(status.toLowerCase()) ? 'Gagal' : 'Menunggu';
const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';

watch(eventId, async () => {
  selectedType.value = '';
  accountPreferences.value = [];
  await Promise.all([loadTemplates(), loadHistory()]);
  if (selectedUserId.value) await loadPreferences();
});
await Promise.all([loadTemplates(), loadHistory(), loadUsers()]);
</script>

<style scoped>
.notification-page{max-width:82rem;margin:auto;padding:2.5rem .75rem 5rem}.page-header{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:1.5rem}.eyebrow,.step-label{font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.25em;color:#a5f3fc}.page-header h1{margin-top:.65rem;font-size:clamp(2rem,4vw,3.25rem);font-weight:900}.page-header>div>p:last-child{max-width:46rem;margin-top:.75rem;color:#94a3b8;line-height:1.7}.field span{display:block;margin-bottom:.5rem;font-size:.8rem;font-weight:700;color:#cbd5e1}.field input,.field select,.field textarea,.input,.preference-control select{width:100%;border:1px solid #ffffff1f;border-radius:1rem;background:#020617cc;padding:.8rem 1rem;color:white;outline:none}.field input:focus,.field select:focus,.field textarea:focus,.input:focus,.preference-control select:focus{border-color:#67e8f980;box-shadow:0 0 0 3px #67e8f91a}.event-picker{min-width:min(100%,20rem)}.notice{margin-top:1.5rem;border:1px solid;border-radius:1rem;padding:1rem}.notice.success{border-color:#6ee7b74d;background:#064e3b4d;color:#d1fae5}.notice.error{border-color:#fca5a54d;background:#7f1d1d4d;color:#fee2e2}.section-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-top:2rem}.section-tabs button{display:flex;align-items:center;gap:.8rem;border:1px solid #ffffff17;border-radius:1.25rem;background:#ffffff08;padding:1rem;text-align:left;color:#94a3b8}.section-tabs button.active{border-color:#67e8f966;background:#22d3ee14;color:white}.section-tabs strong,.section-tabs small{display:block}.section-tabs small{margin-top:.2rem;font-size:.72rem;color:#64748b}.tab-number{display:grid;width:2rem;height:2rem;flex:none;place-items:center;border-radius:999px;background:#ffffff12;font-weight:900}.section-tabs .active .tab-number{background:#67e8f9;color:#083344}.section-content{margin-top:1.5rem}.section-intro{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:1rem;border:1px solid #ffffff12;border-radius:1.5rem;background:linear-gradient(135deg,#ffffff0a,#22d3ee08);padding:1.25rem 1.5rem}.section-intro h2{margin-top:.4rem;font-size:1.5rem;font-weight:900}.section-intro p:last-child{max-width:50rem;margin-top:.5rem;color:#94a3b8;line-height:1.6}.summary-card{display:flex;align-items:baseline;gap:.55rem;border-radius:1rem;background:#02061799;padding:.8rem 1rem}.summary-card strong{font-size:1.5rem;color:#a5f3fc}.summary-card span{font-size:.78rem;color:#94a3b8}.template-layout{display:grid;grid-template-columns:21rem 1fr;gap:1.25rem;margin-top:1.25rem}.glass-card{border:1px solid #ffffff17;background:#ffffff08}.template-list{height:fit-content;border-radius:1.5rem;padding:.75rem}.list-title{padding:.6rem .75rem;font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#64748b}.template-button{display:flex;width:100%;align-items:center;justify-content:space-between;gap:.75rem;border-radius:1rem;padding:.85rem;text-align:left}.template-button:hover,.template-button.active{background:#67e8f912}.template-button span{min-width:0}.template-button strong,.template-button small{display:block}.template-button strong{font-size:.84rem}.template-button small{margin-top:.25rem;color:#64748b;font-size:.68rem;line-height:1.4}.template-button i{flex:none;border-radius:999px;padding:.25rem .5rem;font-style:normal;font-size:.62rem;font-weight:900}.template-button i.enabled{background:#34d39920;color:#a7f3d0}.template-button i.disabled{background:#f8717120;color:#fecaca}.editor-stack{display:grid;gap:1.25rem}.editor-card,.test-card,.preference-panel,.account-picker,.history-table{border-radius:1.5rem;padding:1.4rem}.editor-head{display:flex;flex-wrap:wrap;align-items:start;justify-content:space-between;gap:1rem}.editor-head h2,.selected-user h2{margin-top:.35rem;font-size:1.5rem;font-weight:900}.editor-head p:last-child,.selected-user p:last-child{margin-top:.35rem;color:#94a3b8}.switch-control{display:flex;align-items:center;gap:.65rem;cursor:pointer}.switch-control input{position:absolute;opacity:0}.switch-control span{position:relative;width:2.8rem;height:1.55rem;border-radius:999px;background:#475569;transition:.2s}.switch-control span:after{position:absolute;top:.2rem;left:.2rem;width:1.15rem;height:1.15rem;border-radius:999px;background:white;content:'';transition:.2s}.switch-control input:checked+span{background:#34d399}.switch-control input:checked+span:after{transform:translateX(1.25rem)}.switch-control strong{font-size:.8rem}.master-explanation{margin:1.25rem 0;border-radius:1rem;padding:.9rem 1rem}.master-explanation.enabled{background:#064e3b55;color:#d1fae5}.master-explanation.disabled{background:#7f1d1d55;color:#fee2e2}.master-explanation p{margin-top:.25rem;font-size:.76rem;opacity:.75}.editor-card>.field{display:block;margin-top:1rem}.editor-card textarea{resize:vertical;line-height:1.65}.variable-box{margin-top:1rem;border:1px solid #ffffff12;border-radius:1rem;background:#02061799;padding:1rem}.variable-box p strong,.variable-box p small{display:block}.variable-box p small{margin-top:.25rem;color:#64748b;font-size:.72rem}.variable-list{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.8rem}.variable{border-radius:999px;background:#22d3ee1a;padding:.35rem .7rem;font-size:.72rem;color:#a5f3fc}.form-actions,.preference-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem;margin-top:1.25rem}.primary,.secondary{border-radius:999px;padding:.72rem 1.1rem;font-size:.82rem;font-weight:900}.primary{background:#67e8f9;color:#083344}.secondary{border:1px solid #ffffff26;color:white}.primary:disabled,.secondary:disabled{cursor:not-allowed;opacity:.4}.test-card{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem}.test-card h3{font-weight:900}.test-card p,.test-card>small{margin-top:.25rem;color:#64748b;font-size:.75rem}.test-card form{display:flex;min-width:min(100%,27rem);gap:.6rem}.account-grid{display:grid;grid-template-columns:22rem 1fr;gap:1.25rem;margin-top:1.25rem}.account-picker{height:fit-content}.user-results{max-height:38rem;margin-top:.75rem;overflow:auto}.user-results>button{display:flex;width:100%;align-items:center;gap:.7rem;border-radius:1rem;padding:.75rem;text-align:left}.user-results>button:hover,.user-results>button.active{background:#67e8f912}.user-results strong,.user-results small{display:block}.user-results strong{font-size:.82rem}.user-results small{margin-top:.2rem;color:#64748b;font-size:.7rem}.user-avatar{display:grid;width:2.2rem;height:2.2rem;flex:none;place-items:center;border-radius:999px;background:#164e63;color:#a5f3fc;font-size:.7rem;font-weight:900}.user-avatar.large{width:3.25rem;height:3.25rem;font-size:.9rem}.selected-user{display:flex;align-items:center;gap:1rem;border-bottom:1px solid #ffffff12;padding-bottom:1.25rem}.preference-guide{display:flex;flex-wrap:wrap;gap:1rem;margin-top:1rem;border-radius:1rem;background:#02061799;padding:.75rem 1rem;font-size:.75rem;color:#cbd5e1}.preference-guide span{display:flex;align-items:center;gap:.4rem}.preference-guide small{color:#64748b}.dot{width:.55rem;height:.55rem;border-radius:99px}.dot.default{background:#67e8f9}.dot.off{background:#f87171}.preference-list{display:grid;margin-top:1rem}.preference-row{display:grid;grid-template-columns:minmax(12rem,1fr) minmax(17rem,1fr);gap:1rem;border-top:1px solid #ffffff10;padding:1rem 0}.preference-row:first-child{border-top:0}.preference-copy strong,.preference-copy small{display:block}.preference-copy small{margin-top:.35rem;color:#64748b;font-size:.72rem;line-height:1.5}.preference-control label{display:block;margin-bottom:.35rem;font-size:.68rem;color:#94a3b8}.preference-control select{padding:.65rem .8rem;font-size:.78rem}.effective-status{margin-top:.45rem;font-size:.72rem;font-weight:900}.effective-status.on{color:#6ee7b7}.effective-status.off{color:#fca5a5}.preference-control>small{display:block;margin-top:.3rem;color:#fbbf24;font-size:.68rem}.preference-actions{border-top:1px solid #ffffff12;padding-top:1rem}.preference-actions p{font-size:.78rem;color:#94a3b8}.history-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-top:1.25rem}.history-summary div{display:flex;align-items:baseline;gap:.5rem;border:1px solid #ffffff12;border-radius:1rem;background:#ffffff08;padding:1rem}.history-summary strong{font-size:1.5rem;color:#a5f3fc}.history-summary span{font-size:.75rem;color:#94a3b8}.history-table{margin-top:1rem;padding:0;overflow:hidden}.table-scroll{overflow-x:auto}table{width:100%;min-width:720px;text-align:left}th,td{padding:1rem 1.25rem}th{background:#ffffff08;font-size:.68rem;text-transform:uppercase;letter-spacing:.13em;color:#94a3b8}td{border-top:1px solid #ffffff10;font-size:.8rem;color:#cbd5e1}td strong,td small{display:block}td small{margin-top:.25rem;color:#64748b}.delivery-status{display:inline-flex;border-radius:999px;background:#ffffff12;padding:.3rem .6rem;font-size:.67rem;font-weight:900}.delivery-status.sent,.delivery-status.success{background:#34d39920;color:#a7f3d0}.delivery-status.failed,.delivery-status.error{background:#f8717120;color:#fecaca}.error-text{color:#fca5a5}.empty-state{margin-top:1.5rem;border:1px solid #ffffff12;border-radius:1.5rem;background:#ffffff08;padding:2rem;text-align:center;color:#94a3b8}.empty-state.compact{display:grid;min-height:22rem;place-content:center;gap:.35rem;margin:0}.empty-state strong{color:white}.loading-copy{padding:1.25rem;text-align:center;color:#64748b;font-size:.78rem}.loading-copy.padded{padding:4rem}.empty-cell{padding:3rem;text-align:center;color:#64748b}.backdrop{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:1rem;background:#020617dc;backdrop-filter:blur(10px)}.preview-modal{width:min(100%,48rem);max-height:90vh;overflow:auto;border-radius:1.5rem;background:white;color:#0f172a;box-shadow:0 35px 100px #0009}.preview-modal header{display:flex;align-items:start;justify-content:space-between;gap:1rem;border-bottom:1px solid #e2e8f0;padding:1.25rem 1.5rem}.preview-modal h2{margin-top:.4rem;font-size:1.15rem;font-weight:900}.preview-modal header button{font-size:1.75rem}.preview-modal pre{padding:2rem;white-space:pre-wrap;font-family:inherit;line-height:1.7}
@media(max-width:900px){.template-layout,.account-grid{grid-template-columns:1fr}.template-list{display:grid;grid-template-columns:repeat(2,1fr)}.list-title,.loading-copy{grid-column:1/-1}.user-results{max-height:22rem}.section-tabs small{display:none}}
@media(max-width:640px){
  .notification-page{padding-top:1.5rem}
  .page-header{flex-direction:column;align-items:flex-start}
  .page-header h1{font-size:clamp(1.8rem,8vw,2.6rem)}
  .page-header>div>p:last-child{font-size:.92rem}
  .section-tabs{grid-template-columns:1fr}
  .section-tabs small{display:block}
  .section-intro{flex-direction:column;align-items:flex-start}
  .summary-card{width:100%}
  .template-layout,.account-grid{grid-template-columns:1fr}
  .template-list{grid-template-columns:1fr}
  .editor-head,.form-actions,.preference-actions,.selected-user,.preference-guide{flex-direction:column;align-items:flex-start}
  .switch-control{width:100%}
  .switch-control strong{font-size:.75rem}
  .test-card form{min-width:100%;flex-direction:column}
  .test-card button,.preference-actions button,.form-actions button,.primary,.secondary{width:100%}
  .account-picker,.preference-panel{padding:1rem}
  .preference-row{grid-template-columns:1fr}
  .history-summary{grid-template-columns:1fr}
  .event-picker{width:100%}
  .preview-modal{width:min(100vw - 1rem,42rem)}
  .data-table-shell{overflow:visible}
  .data-table-shell table,.data-table-shell thead,.data-table-shell tbody,.data-table-shell tr,.data-table-shell th,.data-table-shell td{display:block;width:100%;box-sizing:border-box}
  .data-table-shell thead{display:none}
  .data-table-shell tbody{display:grid;gap:.7rem;padding:.7rem}
  .data-table-shell tr{border:1px solid rgba(255,255,255,.08);border-radius:1rem;background:rgba(15,23,42,.72);padding:.8rem}
  .data-table-shell td{border:0;padding:.35rem 0;display:flex;justify-content:space-between;gap:.75rem}
  .data-table-shell td::before{content:attr(data-label);color:#94a3b8;font-size:.64rem;letter-spacing:.14em;text-transform:uppercase;width:36%;flex-shrink:0}
  .data-table-shell td > *{flex:1;min-width:0}
  .field input,.field select,.field textarea,.input,.preference-control select{padding:.72rem .85rem}
}
</style>
