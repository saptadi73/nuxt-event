<template>
  <section class="dashboard-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">Participant Dashboard</p>
    <div class="mt-3 flex flex-wrap items-end justify-between gap-5">
      <div>
        <h1 class="text-3xl font-black sm:text-4xl">Welcome to IWBIF 2026</h1>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Your ticket, schedule, profile, networking, payment, and event updates in one place.</p>
      </div>
      <div class="glass-card rounded-2xl px-4 py-3 text-left sm:text-right">
        <p class="text-[10px] uppercase tracking-[.25em] text-slate-400 sm:text-xs">Event starts in</p>
        <p class="mt-1 text-lg font-bold text-cyan-200 sm:text-xl">{{ countdown }}</p>
      </div>
    </div>

    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article v-for="status in statuses" :key="status.label" class="glass-card rounded-3xl p-5">
        <p class="text-xs uppercase tracking-[.2em] text-slate-400">{{ status.label }}</p>
        <p class="mt-3 text-xl font-bold">{{ status.value }}</p>
        <p class="mt-2 text-sm text-slate-400">{{ status.note }}</p>
      </article>
    </div>

    <div v-if="canViewSalesReport" class="mt-8 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[.25em] text-amber-200">Organizer view</p>
          <h2 class="mt-2 text-2xl font-bold">Ticket sales & revenue report</h2>
        </div>
        <NuxtLink to="/admin/reports" class="inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110">Open report</NuxtLink>
      </div>
    </div>

    <h2 class="mt-10 text-2xl font-bold">Quick access</h2>
    <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="item in menu" :key="item.to" :to="item.to" class="glass-card rounded-3xl p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 sm:p-6">
        <p class="text-xs uppercase tracking-[.25em] text-cyan-200">{{ item.label }}</p>
        <h3 class="mt-3 text-xl font-bold">{{ item.title }}</h3>
        <p class="mt-2 text-sm leading-6 text-slate-400">{{ item.text }}</p>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.dashboard-shell { padding-inline: 0.75rem; }

@media (max-width: 639px) {
  .dashboard-shell {
    padding-top: 2.5rem;
  }
}
</style>

<script setup lang="ts">
definePageMeta({middleware:'auth'});
useSeoMeta({title:'Participant Dashboard | IWBIF 2026'});

const authStore = useAuthStore();
const canViewSalesReport = computed(() => authStore.isAdminOrOrganizer);

const eventDate=new Date('2026-10-14T09:00:00+07:00');
const days=Math.max(0,Math.ceil((eventDate.getTime()-Date.now())/86400000));
const countdown=days>0?`${days} days`:'Event day';

const statuses=[
  {label:'Registration',value:'Check your status',note:'Complete all required participant details.'},
  {label:'Payment',value:'Payment center',note:'Review transaction and confirmation status.'},
  {label:'My Ticket',value:'Digital QR pass',note:'Keep your personal QR code secure.'},
  {label:'Profile',value:'Build your network',note:'Complete your professional information.'}
];

const menu=[
  {to:'/dashboard/ticket',label:'Access',title:'My Ticket & QR Code',text:'Open your event pass and check-in information.'},
  {to:'/dashboard/profile',label:'Identity',title:'My Profile',text:'Update professional details, expertise, and interests.'},
  {to:'/dashboard/directory',label:'Networking',title:'Participant Directory',text:'Discover potential collaborators across IWBIF.'},
  {to:'/dashboard/schedule',label:'Agenda',title:'My Schedule',text:'Review the forum agenda and sessions.'},
  {to:'/dashboard/payment',label:'Transaction',title:'Payment',text:'Create or continue your payment transaction.'},
  {to:'/dashboard/invoice',label:'Document',title:'Invoice',text:'Review invoice and registration details.'},
  {to:'/dashboard/certificate',label:'Recognition',title:'Certificate',text:'Access your certificate after attendance eligibility.'},
  {to:'/dashboard/announcements',label:'Updates',title:'Announcements',text:'Read important information from the organizing team.'},
  {to:'/directory-consent',label:'Privacy',title:'Directory Consent',text:'Understand and manage profile visibility.'}
];
</script>
