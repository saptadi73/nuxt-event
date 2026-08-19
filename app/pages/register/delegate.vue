<template>
  <section class="register-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-amber-200">Delegate Registration</p>
    <h1 class="mt-4 text-4xl font-black sm:text-5xl">Register for IWBIF 2026</h1>
    <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Complete every required section after your package purchase is confirmed. The backend links the paid delegate order to your registration automatically.</p>

    <div v-if="pending" class="mt-10 h-60 animate-pulse rounded-[2rem] bg-white/5" />
    <div v-else-if="optionsError" class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ optionsError.message }}</div>

    <form v-else class="mt-10 space-y-7" @submit.prevent="submit">
      <fieldset class="card"><legend>1. Personal and company information</legend>
        <div class="grid gap-4 md:grid-cols-2">
          <label v-for="field in identityFields" :key="field.key" class="label">
            <span>{{ field.label }}{{ field.required === false ? '' : ' *' }}</span>
            <select v-if="field.options" v-model="form[field.key]" required class="field">
              <option value="" disabled>Select {{ field.label.toLowerCase() }}</option>
              <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
            </select>
            <input v-else v-model.trim="form[field.key]" :type="field.type || 'text'" :autocomplete="field.autocomplete" :required="field.required !== false" class="field" />
          </label>
          <label class="label"><span>Office phone</span><input v-model.trim="form.office_phone" type="tel" class="field" /></label>
          <label class="label md:col-span-2"><span>Company address *</span><textarea v-model.trim="form.company_address" required class="field" rows="3" /></label>
        </div>
      </fieldset>

      <fieldset class="card"><legend>2. Delegate package *</legend>
        <div class="grid gap-4 md:grid-cols-2"><label v-for="item in packages" :key="item.id" class="choice" :class="form.delegate_package_id===item.id?'selected':''"><input v-model="form.delegate_package_id" class="sr-only" type="radio" :value="item.id" required /><span class="text-xs uppercase tracking-widest text-amber-200">{{ item.code }}</span><strong class="mt-2 block text-xl">{{ item.name }}</strong><span class="mt-2 block">{{ money(item.amount ?? item.price,item.currency) }}</span></label></div>
      </fieldset>

      <fieldset class="card"><legend>3. Participation and activities</legend>
        <span class="label">Participation categories *</span>
        <div class="mt-3 grid gap-3 md:grid-cols-2"><label v-for="option in participationCategoryOptions" :key="option" class="choice flex gap-3"><input v-model="form.participation_categories" type="checkbox" :value="option" class="accent-amber-300" /><span>{{ option }}</span></label></div>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label v-if="form.participation_categories.includes('Speaker')" class="label md:col-span-2"><span>Presentation topic</span><textarea v-model.trim="form.presentation_topic" class="field" rows="3" /></label>
          <label v-if="form.participation_categories.includes('Buyer')" class="label md:col-span-2"><span>Products interested</span><textarea v-model.trim="form.products_interested" class="field" rows="3" /></label>
          <label v-if="form.participation_categories.includes('Investor')" class="label md:col-span-2"><span>Investment interest</span><textarea v-model.trim="form.investment_interest" class="field" rows="3" /></label>
        </div>
        <div class="mt-5 grid gap-3 md:grid-cols-2"><label v-for="item in activities" :key="item.id" class="choice flex gap-3"><input v-model="form.activity_ids" type="checkbox" :value="item.id" class="accent-amber-300" /><span>{{ item.name }}</span></label></div>
        <p v-if="!activities.length" class="mt-3 text-sm text-slate-400">No active activities are currently published.</p>
      </fieldset>

      <fieldset class="card"><legend>4. Business matching</legend>
        <label class="label"><span>Products / services *</span><textarea v-model.trim="form.products_services" required class="field" rows="3" /></label>
        <span class="label mt-5">Looking for *</span>
        <div class="mt-3 grid gap-3 md:grid-cols-2"><label v-for="option in lookingForOptions" :key="option" class="choice flex gap-3"><input v-model="form.looking_for" type="checkbox" :value="option" class="accent-amber-300" /><span>{{ option }}</span></label></div>
        <span class="label mt-5">Preferred countries *</span>
        <div class="mt-3 grid gap-3 md:grid-cols-2"><label v-for="option in preferredCountryOptions" :key="option" class="choice flex gap-3"><input v-model="form.preferred_countries" type="checkbox" :value="option" class="accent-amber-300" /><span>{{ option }}</span></label></div>
        <label class="label mt-5"><span>Business objectives *</span><textarea v-model.trim="form.business_objectives" required class="field" rows="3" /></label>
      </fieldset>

      <fieldset class="card"><legend>5. Travel and delegate requirements</legend>
        <div class="grid gap-4 md:grid-cols-2"><label class="label"><span>Room preference *</span><select v-model="form.room_preference" required class="field"><option value="Twin Sharing">Twin Sharing</option><option value="Single Room (+Supplement)">Single Room (+Supplement)</option></select></label><label class="label"><span>Preferred roommate</span><input v-model.trim="form.preferred_roommate" class="field" /></label><label class="label"><span>Arrival date *</span><input v-model="form.arrival_date" type="date" required class="field" /></label><label class="label"><span>Departure date *</span><input v-model="form.departure_date" type="date" :min="form.arrival_date" required class="field" /></label><label class="label"><span>Airport *</span><select v-model="form.airport" required class="field"><option value="" disabled>Select airport</option><option v-for="option in airportOptions" :key="option" :value="option">{{ option }}</option></select></label><label class="label"><span>Flight number</span><input v-model.trim="form.flight_number" class="field" /></label><div class="label"><span>Need airport pickup? *</span><div class="flex gap-5"><label class="check"><input v-model="form.need_airport_pickup" type="radio" :value="true" /> Yes</label><label class="check"><input v-model="form.need_airport_pickup" type="radio" :value="false" /> No</label></div></div><label class="label"><span>Dietary restrictions</span><input v-model.trim="form.dietary_restrictions" class="field" /></label><label class="label"><span>Medical condition</span><input v-model.trim="form.medical_condition" class="field" /></label><label class="label"><span>Special assistance</span><input v-model.trim="form.special_assistance" class="field" /></label></div>
      </fieldset>

      <fieldset class="card"><legend>6. Invoice and consent</legend>
        <div class="grid gap-4 md:grid-cols-2"><label class="label"><span>Tax ID</span><input v-model.trim="form.tax_id" class="field" /></label><div class="label"><span>Need official invoice? *</span><div class="flex gap-5"><label class="check"><input v-model="form.need_official_invoice" type="radio" :value="true" /> Yes</label><label class="check"><input v-model="form.need_official_invoice" type="radio" :value="false" /> No</label></div></div></div>
        <div class="mt-5 space-y-3"><label class="check"><input v-model="form.information_accuracy_confirmed" required type="checkbox" /> I confirm that the information is accurate *</label><label class="check"><input v-model="form.terms_accepted" required type="checkbox" /> I accept the Terms and Conditions *</label><label class="check"><input v-model="form.business_matching_data_consent" required type="checkbox" /> I consent to business matching data processing *</label></div>
      </fieldset>

      <div v-if="feedback" class="rounded-2xl border p-5" :class="success?'border-emerald-300/30 bg-emerald-950/30':'border-red-300/30 bg-red-950/30'">{{ feedback }}</div>

      <div class="submit-row">
        <button class="rounded-full bg-amber-300 px-7 py-3 font-semibold text-slate-950 disabled:opacity-50" :disabled="submitting||!form.delegate_package_id||!form.activity_ids.length||!form.participation_categories.length||!form.looking_for.length||!form.preferred_countries.length||form.need_airport_pickup===null||form.need_official_invoice===null">{{ submitting?'Submitting…':'Create Registration' }}</button>
      </div>
    </form>
  </section>
</template>
<script setup lang="ts">
import {useEvent} from '~/composables/useEvent';
import {useParticipant} from '~/composables/useParticipant';
import {useRegistration} from '~/composables/useRegistration';

definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Delegate Registration | IWBIF 2026', description: 'Complete the official IWBIF 2026 delegate registration.' });

const route = useRoute();
const { getEvents, getEventDelegatePackages, getEventActivities } = useEvent();
const { upsertMyProfile } = useParticipant();
const { createRegistration } = useRegistration();

type TextKey = 'full_name' | 'job_title' | 'company_organization' | 'nationality' | 'title' | 'business_sector' | 'country' | 'email' | 'mobile_whatsapp' | 'company_website' | 'linkedin';
type IdentityField = { key: TextKey; label: string; type?: string; autocomplete?: string; options?: readonly string[]; required?: boolean };

const titleOptions = ['Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Mr.', 'Others'] as const;
const businessSectorOptions = [
  'Agriculture',
  'Food & Beverage',
  'Fashion & Textile',
  'Beauty',
  'Healthcare',
  'Tourism',
  'Education',
  'Technology',
  'Manufacturing',
  'Creative Industry',
  'Trading',
  'Finance',
  'Professional Services',
  'Others'
] as const;
const countryOptions = ['Malaysia', 'China', 'Indonesia', 'Singapore', 'Thailand', 'Cambodia', 'Vietnam', 'Philippines', 'Brunei', 'Laos', 'Myanmar', 'Other'] as const;
const participationCategoryOptions = ['Delegate', 'Speaker', 'Buyer', 'Investor', 'Government', 'Association', 'Media', 'Exhibitor', 'Sponsor', 'Other'] as const;
const lookingForOptions = ['Buyer', 'Distributor', 'Importer', 'Retailer', 'Investor', 'Technology Partner', 'Joint Venture', 'Government', 'Others'] as const;
const preferredCountryOptions = ['Indonesia', 'Malaysia', 'China', 'Singapore', 'Thailand', 'Vietnam', 'Cambodia', 'Philippines', 'Others'] as const;
const airportOptions = ['CGK', 'HLP', 'Other'] as const;
const identityFields: IdentityField[] = [
  { key: 'full_name', label: 'Full name', autocomplete: 'name' },
  { key: 'title', label: 'Title', options: titleOptions },
  { key: 'job_title', label: 'Job title' },
  { key: 'company_organization', label: 'Company / organization', autocomplete: 'organization' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'country', label: 'Country', options: countryOptions },
  { key: 'business_sector', label: 'Business sector', options: businessSectorOptions },
  { key: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
  { key: 'mobile_whatsapp', label: 'Mobile / WhatsApp', type: 'tel' },
  { key: 'company_website', label: 'Company website', type: 'url', required: false },
  { key: 'linkedin', label: 'LinkedIn', type: 'url', required: false }
];

const form = reactive({
  event_id: '',
  delegate_package_id: typeof route.query.package === 'string' ? route.query.package : '',
  full_name: '',
  job_title: '',
  company_organization: '',
  nationality: '',
  title: '',
  business_sector: '',
  country: '',
  email: '',
  mobile_whatsapp: '',
  office_phone: '',
  company_website: '',
  linkedin: '',
  company_address: '',
  participation_categories: [] as string[],
  presentation_topic: '',
  products_interested: '',
  investment_interest: '',
  products_services: '',
  looking_for: [] as string[],
  preferred_countries: [] as string[],
  business_objectives: '',
  activity_ids: [] as string[],
  room_preference: 'Twin Sharing',
  preferred_roommate: '',
  arrival_date: '2026-10-14',
  departure_date: '2026-10-17',
  flight_number: '',
  airport: '',
  need_airport_pickup: null as boolean | null,
  dietary_restrictions: '',
  medical_condition: '',
  special_assistance: '',
  need_official_invoice: null as boolean | null,
  tax_id: '',
  information_accuracy_confirmed: false,
  terms_accepted: false,
  business_matching_data_consent: false
});

const { data: options, pending, error: optionsError } = await useAsyncData('iwbif-registration-options', async () => {
  const response = await getEvents(1, 1);
  const event = response.data[0];
  if (!event) throw new Error('No IWBIF event is currently published.');
  const [packageResponse, activityResponse] = await Promise.all([
    getEventDelegatePackages(event.id),
    getEventActivities(event.id)
  ]);
  return {
    event,
    packages: packageResponse.data.filter(item => item.is_active),
    activities: activityResponse.data.filter(item => item.is_active !== false)
  };
});

watchEffect(() => {
  if (options.value?.event.id) form.event_id = options.value.event.id;
});

const packages = computed(() => options.value?.packages ?? []);
const activities = computed(() => options.value?.activities ?? []);
const submitting = ref(false);
const feedback = ref('');
const success = ref(false);

const nullable = (value: string) => value || null;
const money = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

const submit = async () => {
  submitting.value = true;
  feedback.value = '';
  success.value = false;

  try {
    await upsertMyProfile({
      full_name: form.full_name,
      organization_name: form.company_organization,
      biography: form.business_objectives
    });

    if (!form.delegate_package_id) {
      throw new Error('Please choose and pay for a delegate package before completing registration.');
    }

    const payload = {
      ...form,
      company_website: nullable(form.company_website),
      linkedin: nullable(form.linkedin),
      office_phone: nullable(form.office_phone),
      presentation_topic: nullable(form.presentation_topic),
      products_interested: nullable(form.products_interested),
      investment_interest: nullable(form.investment_interest),
      preferred_roommate: nullable(form.preferred_roommate),
      flight_number: nullable(form.flight_number),
      dietary_restrictions: nullable(form.dietary_restrictions),
      medical_condition: nullable(form.medical_condition),
      special_assistance: nullable(form.special_assistance),
      tax_id: nullable(form.tax_id),
      terms_version: '2026-08-14',
      consent_version: '2026-08-14'
    };

    const result = await createRegistration(payload as any);
    success.value = true;
    feedback.value = `Registration ${result.data.registration_number} created successfully.`;
    await navigateTo('/dashboard');
  } catch (error) {
    feedback.value = error instanceof Error ? error.message : 'Registration could not be created.';
  } finally {
    submitting.value = false;
  }
};
</script>
<style scoped>
.register-shell { padding-inline: 0.75rem; }
.card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(11, 36, 71, 0.8), rgba(11, 36, 71, 0.52));
  box-shadow:
    0 30px 80px rgba(2, 10, 24, 0.45),
    inset 0 1px rgba(255, 255, 255, 0.04),
    0 0 0 1px rgba(216, 172, 89, 0.04);
  backdrop-filter: blur(16px);
  border-radius: 1.5rem;
  padding: 1.25rem;
}
.card legend { @apply px-2 text-lg font-bold sm:text-xl; }
.label { @apply grid gap-2 text-sm text-slate-300; }
.field { @apply rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300; }
.field option {
  background-color: #0b2447;
  color: #f8fafc;
}
.field option:disabled {
  color: #94a3b8;
}
.choice { @apply cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5; }
.choice.selected { @apply border-amber-300 bg-amber-300/10; }
.check { @apply flex items-center gap-3 text-sm text-slate-300; }
.check input { @apply accent-amber-300; }
.submit-row { display: flex; justify-content: flex-end; }
.submit-row button { width: 100%; }

@media (min-width: 640px) {
  .submit-row button { width: auto; }
}

@media (max-width: 639px) {
  .card { border-radius: 1.3rem; }
  .field,
  .choice,
  .check {
    font-size: 1rem;
  }
  .label {
    gap: 0.55rem;
  }
  .submit-row {
    justify-content: stretch;
  }
}
</style>
