<template>
  <section class="contact-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-amber-200">Contact</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">Connect with the IWBIF team</h1>
    <p class="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">Partnerships, media inquiries, speaking opportunities, and registration assistance for IWBIF 2026 can be directed to the event operations desk.</p>

    <div class="support-banner mt-8 rounded-[2rem] border border-amber-200/20 bg-amber-300/10 p-5 sm:p-6">
      <div>
        <p class="text-xs uppercase tracking-[.3em] text-amber-200">Need assistance?</p>
        <p class="mt-3 text-lg font-semibold text-white sm:text-xl">We can help with registration, partnerships, and event logistics.</p>
      </div>
      <a href="mailto:hello@iwbif-event.example" class="mt-5 inline-flex rounded-full bg-amber-300 px-5 py-3 font-semibold text-slate-950 sm:mt-0">Email the team</a>
    </div>

    <div class="mt-10 grid gap-5 md:grid-cols-3">
      <article class="info-card rounded-[1.75rem] p-5 sm:p-6">
        <p class="text-xs uppercase tracking-[.2em] text-cyan-200">General</p>
        <h2 class="mt-3 text-xl font-bold text-white">General Inquiry</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300">hello@iwbif-event.example</p>
        <span class="mt-5 inline-flex text-xs uppercase tracking-[.2em] text-slate-400">Support desk</span>
      </article>
      <article class="info-card rounded-[1.75rem] p-5 sm:p-6">
        <p class="text-xs uppercase tracking-[.2em] text-cyan-200">Partnerships</p>
        <h2 class="mt-3 text-xl font-bold text-white">Partnership &amp; Sponsors</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300">partners@iwbif-event.example</p>
        <span class="mt-5 inline-flex text-xs uppercase tracking-[.2em] text-slate-400">Visibility and collaboration</span>
      </article>
      <article class="info-card rounded-[1.75rem] p-5 sm:p-6">
        <p class="text-xs uppercase tracking-[.2em] text-cyan-200">Media</p>
        <h2 class="mt-3 text-xl font-bold text-white">Press &amp; Media</h2>
        <p class="mt-3 text-sm leading-7 text-slate-300">media@iwbif-event.example</p>
        <span class="mt-5 inline-flex text-xs uppercase tracking-[.2em] text-slate-400">Announcements and coverage</span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Contact | IWBIF 2026',
  description: 'Contact IWBIF 2026 for media, partnership, and participant support.'
})
</script>

<style scoped>
.contact-shell { position: relative; }
.support-banner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(216, 172, 89, 0.28);
  background: linear-gradient(135deg, rgba(216, 172, 89, 0.08), rgba(255, 255, 255, 0.02));
}
.info-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(11, 36, 71, 0.74), rgba(11, 36, 71, 0.42));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.04);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.info-card:hover {
  transform: translateY(-4px);
  border-color: rgba(216, 172, 89, 0.38);
}
@media (min-width: 640px) {
  .support-banner { flex-direction: row; align-items: center; }
}
</style>
