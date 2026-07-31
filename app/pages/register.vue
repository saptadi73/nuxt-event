<template>
  <section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="glass-card rounded-[2rem] p-6 sm:p-8">
      <p class="text-sm uppercase tracking-[0.35em] text-cyan-200/75">Quick Registration</p>
      <h1 class="mt-3 text-4xl font-bold text-white">Mulai profil peserta dan draft registrasi</h1>
      <p class="mt-3 max-w-2xl text-slate-300">
        Form ini disiapkan untuk alur awal sesuai API reference terbaru: simpan profil peserta dulu,
        lalu kirim draft registrasi ke backend.
      </p>

      <form class="mt-8 grid gap-5" @submit.prevent="submitRegistration">
        <div class="grid gap-5 md:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm text-slate-300">Nama Lengkap</span>
            <input v-model="form.full_name" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" required />
          </label>
          <label class="grid gap-2">
            <span class="text-sm text-slate-300">Organisasi</span>
            <input v-model="form.organization_name" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="text-sm text-slate-300">Biografi Singkat</span>
          <textarea v-model="form.biography" rows="4" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"></textarea>
        </label>

        <div class="grid gap-5 md:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm text-slate-300">Event ID</span>
            <input v-model="form.event_id" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" required />
          </label>
          <label class="grid gap-2">
            <span class="text-sm text-slate-300">Ticket Type ID</span>
            <input v-model="form.ticket_type_id" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Opsional" />
          </label>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm text-slate-300">Kontak Darurat</span>
            <input v-model="form.emergency_contact_name" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          </label>
          <label class="grid gap-2">
            <span class="text-sm text-slate-300">Nomor Darurat</span>
            <input v-model="form.emergency_contact_phone" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="text-sm text-slate-300">Dietary Preference</span>
          <input v-model="form.dietary_preference" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
        </label>

        <button
          type="submit"
          class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'Menyimpan...' : 'Simpan Draft Registrasi' }}
        </button>
      </form>

      <div v-if="feedback" class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
        {{ feedback }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { upsertMyProfile } = useParticipant();
const { createRegistration } = useRegistration();

const submitting = ref(false);
const feedback = ref('');

const form = reactive({
  full_name: '',
  organization_name: '',
  biography: '',
  event_id: '',
  ticket_type_id: '',
  dietary_preference: '',
  emergency_contact_name: '',
  emergency_contact_phone: ''
});

const submitRegistration = async () => {
  submitting.value = true;
  feedback.value = '';

  try {
    const profileResult = await upsertMyProfile({
      full_name: form.full_name,
      organization_name: form.organization_name || undefined,
      biography: form.biography || undefined
    });

    const registrationResult = await createRegistration({
      event_id: form.event_id,
      participant_id: profileResult.data.id,
      ticket_type_id: form.ticket_type_id || null,
      dietary_preference: form.dietary_preference || undefined,
      emergency_contact_name: form.emergency_contact_name || undefined,
      emergency_contact_phone: form.emergency_contact_phone || undefined,
      consent_snapshot: JSON.stringify({ privacy: true })
    });

    feedback.value = `Draft registrasi berhasil dibuat dengan nomor ${registrationResult.data.registration_number}.`;
  } catch (error) {
    feedback.value = error instanceof Error ? error.message : 'Terjadi kegagalan saat menyimpan registrasi.';
  } finally {
    submitting.value = false;
  }
};
</script>
