<template>
  <section class="mx-auto max-w-4xl px-3 py-10 sm:px-6">
    <div class="glass-card rounded-[2rem] p-5 sm:p-8">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[.3em] text-amber-200">Inbox</p>
          <h1 class="mt-3 text-3xl font-black sm:text-4xl">Messages & notifications</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Payment updates and Business Matching notifications are collected here.</p>
        </div>
        <button type="button" class="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/5" :disabled="loading" @click="loadNotifications">Refresh</button>
      </div>

      <p v-if="errorMessage" class="mt-6 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-100">{{ errorMessage }}</p>
      <div v-else-if="loading" class="mt-6 rounded-2xl border border-white/10 p-5 text-slate-300">Loading inbox...</div>
      <p v-else-if="!notifications.length" class="mt-6 rounded-2xl border border-white/10 p-5 text-slate-400">There are no notifications yet.</p>
      <div v-else class="mt-6 space-y-3">
        <button v-for="item in notifications" :key="item.id" type="button" class="w-full rounded-2xl border border-white/10 p-4 text-left transition hover:bg-white/5" :class="item.is_read ? 'bg-white/[0.03]' : 'bg-emerald-300/10'" @click="openNotification(item)">
          <div class="flex items-start justify-between gap-4"><div><p class="font-bold text-white">{{ item.title || 'Notification' }}</p><p class="mt-1 text-sm leading-6 text-slate-300">{{ item.message || item.body || 'Open to view details.' }}</p></div><span v-if="!item.is_read" class="rounded-full bg-emerald-300 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950">New</span></div>
          <p v-if="item.created_at" class="mt-3 text-xs text-slate-500">{{ formatDateTime(item.created_at) }}</p>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCommunication, type NotificationItem } from '~/composables/useCommunication';
import { useEvent } from '~/composables/useEvent';

definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Inbox | IWBIF 2026' });

const authStore = useAuthStore();
const communication = useCommunication();
const { getEvents } = useEvent();
const notifications = ref<NotificationItem[]>([]);
const loading = ref(true);
const errorMessage = ref('');
const eventId = ref('');

const errorText = (error: unknown) => {
  const value = error as { data?: { message?: string } };
  return value.data?.message || (error instanceof Error ? error.message : 'Unable to load inbox.');
};

const resolveAdminEvent = async () => {
  if (!authStore.isAdminOrOrganizer || eventId.value) return;
  const events = await getEvents(1, 100);
  eventId.value = events.data?.[0]?.id || '';
};

const loadNotifications = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await resolveAdminEvent();
    const response = authStore.isAdminOrOrganizer && eventId.value
      ? await communication.getAdminNotifications(eventId.value)
      : await communication.getNotifications();
    notifications.value = response.data || [];
  } catch (error) {
    notifications.value = [];
    errorMessage.value = errorText(error);
  } finally {
    loading.value = false;
  }
};

const destinationFor = (item: NotificationItem) => {
  const type = (item.type || item.entity_type || '').toLowerCase();
  if (type === 'payment_status_update') return '/admin/reports';
  if (['new_message', 'meeting_request', 'meeting_requested', 'meeting_accepted', 'meeting_declined', 'meeting_confirmed', 'meeting_reschedule', 'meeting_reschedule_requested', 'meeting_cancelled'].includes(type)) return '/business-matching';
  return '/dashboard';
};

const openNotification = async (item: NotificationItem) => {
  try {
    if (!item.is_read) {
      if (authStore.isAdminOrOrganizer && eventId.value) await communication.markAdminNotificationRead(item.id, eventId.value);
      else await communication.markNotificationRead(item.id);
    }
  } finally {
    await navigateTo(destinationFor(item));
  }
};

const formatDateTime = (value: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

onMounted(loadNotifications);
</script>
