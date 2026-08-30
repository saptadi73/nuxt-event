<template>
  <section class="register-shell mx-auto max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-amber-200">{{ copy.eyebrow }}</p>
    <h1 class="mt-4 text-4xl font-black sm:text-5xl">{{ copy.title }}</h1>
    <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{{ copy.description }}</p>
    <div v-if="offlinePayment" class="mt-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4 text-sm leading-7 text-emerald-100"><strong>Offline payment selected.</strong> Complete and submit this registration. After the organizer receives your cash, transfer, EDC, or other approved offline payment, an admin will create the payment using your registration ID and issue the ticket only after full settlement.</div>

    <div v-if="pending" class="mt-10 h-60 animate-pulse rounded-[2rem] bg-white/5" />
    <div v-else-if="optionsError" class="mt-10 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100">{{ optionsError.message }}</div>

    <form v-else class="mt-10 space-y-7" novalidate @submit.prevent="submit">
      <fieldset class="card"><legend>{{ copy.personalSection }}</legend>
        <div class="grid gap-4 md:grid-cols-2">
          <label v-for="field in identityFields" :key="field.key" class="label">
            <span>{{ field.label }}{{ field.required === false ? '' : ' *' }}</span>
            <select v-if="field.options" v-model="form[field.key]" required class="field">
              <option value="" disabled>{{ copy.select }} {{ field.label }}</option>
              <option v-for="option in field.options" :key="option" :value="option">{{ optionLabel(option) }}</option>
            </select>
            <input v-else v-model.trim="form[field.key]" :type="field.type || 'text'" :autocomplete="field.autocomplete" :required="field.required !== false" class="field" />
          </label>
          <label class="label"><span>{{ copy.officePhone }}</span><input v-model.trim="form.office_phone" type="tel" class="field" /></label>
          <label class="label md:col-span-2"><span>{{ copy.companyAddress }} *</span><textarea v-model.trim="form.company_address" required class="field" rows="3" /></label>
        </div>
      </fieldset>

      <fieldset class="card"><legend>{{ copy.participationSection }}</legend>
        <span class="label">{{ copy.participationCategories }} *</span>
        <div class="mt-3 grid gap-3 md:grid-cols-2"><label v-for="option in participationCategoryOptions" :key="option" class="choice flex gap-3"><input v-model="form.participation_categories" type="checkbox" :value="option" class="accent-amber-300" /><span>{{ optionLabel(option) }}</span></label></div>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label v-if="form.participation_categories.includes('Speaker')" class="label md:col-span-2"><span>{{ copy.presentationTopic }}</span><textarea v-model.trim="form.presentation_topic" class="field" rows="3" /></label>
          <label v-if="form.participation_categories.includes('Buyer')" class="label md:col-span-2"><span>{{ copy.productsInterested }}</span><textarea v-model.trim="form.products_interested" class="field" rows="3" /></label>
          <label v-if="form.participation_categories.includes('Investor')" class="label md:col-span-2"><span>{{ copy.investmentInterest }}</span><textarea v-model.trim="form.investment_interest" class="field" rows="3" /></label>
        </div>
        <div class="mt-5 grid gap-3 md:grid-cols-2"><label v-for="item in activities" :key="item.id" class="choice flex gap-3"><input v-model="form.activity_ids" type="checkbox" :value="item.id" class="accent-amber-300" /><span>{{ item.name }}</span></label></div>
        <p v-if="!activities.length" class="mt-3 text-sm text-slate-400">{{ copy.noActivities }}</p>
      </fieldset>

      <fieldset class="card"><legend>{{ copy.matchingSection }}</legend>
        <label class="label"><span>{{ copy.productsServices }} *</span><textarea v-model.trim="form.products_services" required class="field" rows="3" /></label>
        <span class="label mt-5">{{ copy.lookingFor }} *</span>
        <div class="mt-3 grid gap-3 md:grid-cols-2"><label v-for="option in lookingForOptions" :key="option" class="choice flex gap-3"><input v-model="form.looking_for" type="checkbox" :value="option" class="accent-amber-300" /><span>{{ optionLabel(option) }}</span></label></div>
        <span class="label mt-5">{{ copy.preferredCountries }} *</span>
        <div class="mt-3 grid gap-3 md:grid-cols-2"><label v-for="option in preferredCountryOptions" :key="option" class="choice flex gap-3"><input v-model="form.preferred_countries" type="checkbox" :value="option" class="accent-amber-300" /><span>{{ optionLabel(option) }}</span></label></div>
        <label class="label mt-5"><span>{{ copy.businessObjectives }} *</span><textarea v-model.trim="form.business_objectives" required class="field" rows="3" /></label>
      </fieldset>

      <fieldset class="card"><legend>{{ copy.travelSection }}</legend>
        <div class="grid gap-4 md:grid-cols-2"><label class="label"><span>{{ copy.roomPreference }} *</span><select v-model="form.room_preference" required class="field"><option value="Twin Sharing">{{ optionLabel('Twin Sharing') }}</option><option value="Single Room (+Supplement)">{{ optionLabel('Single Room (+Supplement)') }}</option></select></label><label class="label"><span>{{ copy.preferredRoommate }}</span><input v-model.trim="form.preferred_roommate" class="field" /></label><label class="label"><span>{{ copy.arrivalDate }} *</span><input v-model="form.arrival_date" type="date" required class="field" /></label><label class="label"><span>{{ copy.departureDate }} *</span><input v-model="form.departure_date" type="date" :min="form.arrival_date" required class="field" /></label><label class="label"><span>{{ copy.airport }} *</span><select v-model="form.airport" required class="field"><option value="" disabled>{{ copy.selectAirport }}</option><option v-for="option in airportOptions" :key="option" :value="option">{{ optionLabel(option) }}</option></select></label><label class="label"><span>{{ copy.flightNumber }}</span><input v-model.trim="form.flight_number" class="field" /></label><div class="label"><span>{{ copy.needPickup }} *</span><div class="flex flex-wrap gap-3 sm:gap-5"><label class="check"><input v-model="form.need_airport_pickup" type="radio" :value="true" /> {{ copy.yes }}</label><label class="check"><input v-model="form.need_airport_pickup" type="radio" :value="false" /> {{ copy.no }}</label></div></div><label class="label"><span>{{ copy.dietary }}</span><input v-model.trim="form.dietary_restrictions" class="field" /></label><label class="label"><span>{{ copy.medical }}</span><input v-model.trim="form.medical_condition" class="field" /></label><label class="label"><span>{{ copy.assistance }}</span><input v-model.trim="form.special_assistance" class="field" /></label></div>
      </fieldset>

      <fieldset class="card"><legend>{{ copy.invoiceSection }}</legend>
        <div class="grid gap-4 md:grid-cols-2"><label class="label"><span>{{ copy.taxId }}</span><input v-model.trim="form.tax_id" class="field" /></label><div class="label"><span>{{ copy.needInvoice }} *</span><div class="flex flex-wrap gap-3 sm:gap-5"><label class="check"><input v-model="form.need_official_invoice" type="radio" :value="true" /> {{ copy.yes }}</label><label class="check"><input v-model="form.need_official_invoice" type="radio" :value="false" /> {{ copy.no }}</label></div></div></div>
        <div class="mt-5 space-y-3"><label class="check"><input v-model="form.information_accuracy_confirmed" required type="checkbox" /> {{ copy.accuracy }} *</label><label class="check"><input v-model="form.terms_accepted" required type="checkbox" /> {{ copy.acceptTerms }} *</label><label class="check"><input v-model="form.business_matching_data_consent" required type="checkbox" /> {{ copy.dataConsent }} *</label></div>
      </fieldset>

      <div v-if="feedback" class="rounded-2xl border p-5" :class="success?'border-emerald-300/30 bg-emerald-950/30':'border-red-300/30 bg-red-950/30'">{{ feedback }}</div>

      <div class="submit-row">
        <button class="rounded-full bg-amber-300 px-7 py-3 font-semibold text-slate-950 disabled:opacity-50" :disabled="submitting">{{ submitting ? copy.saving : editingRegistrationId ? copy.update : copy.create }}</button>
      </div>
    </form>
  </section>
</template>
<script setup lang="ts">
import {useEvent} from '~/composables/useEvent';
import {useParticipant} from '~/composables/useParticipant';
import {useRegistration,type RegistrationPayload} from '~/composables/useRegistration';

definePageMeta({ middleware: 'auth' });
const { locale } = useI18n();
const route = useRoute();
const offlinePayment = computed(() => route.query.payment === 'offline');

const messages = {
  en: {
    eyebrow: 'Delegate Registration', title: 'Register for IWBIF 2026', description: 'Complete every required section after your package purchase is confirmed. The backend links the paid delegate order to your registration automatically.',
    personalSection: '1. Personal and company information', participationSection: '2. Participation and activities', matchingSection: '3. Business matching', travelSection: '4. Travel and delegate requirements', invoiceSection: '5. Invoice and consent',
    select: 'Select', officePhone: 'Office phone', companyAddress: 'Company address', participationCategories: 'Participation categories', presentationTopic: 'Presentation topic', productsInterested: 'Products interested', investmentInterest: 'Investment interest', noActivities: 'No active activities are currently published.',
    productsServices: 'Products / services', lookingFor: 'Looking for', preferredCountries: 'Preferred countries', businessObjectives: 'Business objectives', roomPreference: 'Room preference', preferredRoommate: 'Preferred roommate', arrivalDate: 'Arrival date', departureDate: 'Departure date', airport: 'Airport', selectAirport: 'Select airport', flightNumber: 'Flight number', needPickup: 'Need airport pickup?', dietary: 'Dietary restrictions', medical: 'Medical condition', assistance: 'Special assistance',
    taxId: 'Tax ID', needInvoice: 'Need official invoice?', yes: 'Yes', no: 'No', accuracy: 'I confirm that the information is accurate', acceptTerms: 'I accept the Terms and Conditions', dataConsent: 'I consent to business matching data processing', saving: 'Saving…', update: 'Update Registration', create: 'Create Registration',
    fields: ['Full name', 'Title', 'Job title', 'Company / organization', 'Nationality', 'Business sector', 'Email', 'Company website', 'LinkedIn'], noEvent: 'No IWBIF event is currently published.', loadError: 'Existing delegate profile could not be loaded.', saveError: 'Registration could not be saved.', saved: 'Registration {number} saved successfully.'
  },
  zh: {
    eyebrow: '代表注册', title: '注册参加 IWBIF 2026', description: '请在套餐付款确认后填写所有必填信息。系统会自动将已付款的代表订单关联到您的注册资料。',
    personalSection: '1. 个人及公司信息', participationSection: '2. 参与类别与活动', matchingSection: '3. 商务配对', travelSection: '4. 行程及代表需求', invoiceSection: '5. 发票与同意事项',
    select: '请选择', officePhone: '办公电话', companyAddress: '公司地址', participationCategories: '参与类别', presentationTopic: '演讲主题', productsInterested: '感兴趣的产品', investmentInterest: '投资意向', noActivities: '目前尚未发布任何有效活动。',
    productsServices: '产品／服务', lookingFor: '希望寻找', preferredCountries: '意向国家', businessObjectives: '商务目标', roomPreference: '房型偏好', preferredRoommate: '首选室友', arrivalDate: '抵达日期', departureDate: '离开日期', airport: '机场', selectAirport: '请选择机场', flightNumber: '航班号', needPickup: '是否需要机场接送？', dietary: '饮食限制', medical: '健康状况', assistance: '特殊协助需求',
    taxId: '税务识别号', needInvoice: '是否需要正式发票？', yes: '是', no: '否', accuracy: '我确认所填写的信息准确无误', acceptTerms: '我接受条款与条件', dataConsent: '我同意处理用于商务配对的数据', saving: '正在保存…', update: '更新注册资料', create: '提交注册',
    fields: ['姓名', '称谓', '职位', '公司／机构', '国籍', '行业领域', '电子邮箱', '公司网站', 'LinkedIn'], noEvent: '目前没有已发布的 IWBIF 活动。', loadError: '无法加载现有代表资料。', saveError: '无法保存注册资料。', saved: '注册资料 {number} 已成功保存。'
  }
} as const;
const copy = computed(() => locale.value === 'zh-CN' ? messages.zh : messages.en);
const validationCopy = computed(() => locale.value === 'zh-CN'
  ? { required: '请填写所有必填字段并选择所需选项。', email: '请输入有效的电子邮箱地址。', url: '请输入包含 http:// 或 https:// 的有效网站地址。', dates: '离开日期不得早于抵达日期。', consent: '请确认信息准确性、接受条款并同意商务配对数据处理。' }
  : { required: 'Complete all required fields and selections.', email: 'Enter a valid email address.', url: 'Enter a valid website address beginning with http:// or https://.', dates: 'The departure date cannot be earlier than the arrival date.', consent: 'Confirm the information accuracy, accept the terms, and provide business matching consent.' });
useSeoMeta({ title: () => `${copy.value.eyebrow} | IWBIF 2026`, description: () => copy.value.description });

const { getEvents, getEventActivities } = useEvent();
const { upsertMyProfile } = useParticipant();
const { createRegistration, getMyRegistrations, getRegistration, updateRegistration } = useRegistration();

type TextKey = 'full_name' | 'job_title' | 'company_organization' | 'nationality' | 'title' | 'business_sector' | 'email' | 'company_website' | 'linkedin';
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
const participationCategoryOptions = ['Delegate', 'Speaker', 'Buyer', 'Investor', 'Government', 'Association', 'Media', 'Exhibitor', 'Sponsor', 'Other'] as const;
const lookingForOptions = ['Buyer', 'Distributor', 'Importer', 'Retailer', 'Investor', 'Technology Partner', 'Joint Venture', 'Government', 'Others'] as const;
const preferredCountryOptions = ['Indonesia', 'Malaysia', 'China', 'Singapore', 'Thailand', 'Vietnam', 'Cambodia', 'Philippines', 'Others'] as const;
const airportOptions = ['CGK', 'HLP', 'Other'] as const;
const identityFields = computed<IdentityField[]>(() => [
  { key: 'full_name', label: copy.value.fields[0], autocomplete: 'name' },
  { key: 'title', label: copy.value.fields[1], options: titleOptions },
  { key: 'job_title', label: copy.value.fields[2] },
  { key: 'company_organization', label: copy.value.fields[3], autocomplete: 'organization' },
  { key: 'nationality', label: copy.value.fields[4] },
  { key: 'business_sector', label: copy.value.fields[5], options: businessSectorOptions },
  { key: 'email', label: copy.value.fields[6], type: 'email', autocomplete: 'email' },
  { key: 'company_website', label: copy.value.fields[7], type: 'url', required: false },
  { key: 'linkedin', label: copy.value.fields[8], type: 'url', required: false }
]);

const zhOptionLabels: Record<string, string> = {
  'Mrs.': '夫人', 'Ms.': '女士', 'Dr.': '博士', 'Prof.': '教授', 'Mr.': '先生', Others: '其他', Other: '其他',
  Agriculture: '农业', 'Food & Beverage': '食品与饮料', 'Fashion & Textile': '时尚与纺织', Beauty: '美容', Healthcare: '医疗保健', Tourism: '旅游', Education: '教育', Technology: '科技', Manufacturing: '制造业', 'Creative Industry': '创意产业', Trading: '贸易', Finance: '金融', 'Professional Services': '专业服务',
  Delegate: '代表', Speaker: '演讲嘉宾', Buyer: '买家', Investor: '投资者', Government: '政府机构', Association: '协会', Media: '媒体', Exhibitor: '参展商', Sponsor: '赞助商',
  Distributor: '经销商', Importer: '进口商', Retailer: '零售商', 'Technology Partner': '技术合作伙伴', 'Joint Venture': '合资伙伴',
  Indonesia: '印度尼西亚', Malaysia: '马来西亚', China: '中国', Singapore: '新加坡', Thailand: '泰国', Vietnam: '越南', Cambodia: '柬埔寨', Philippines: '菲律宾',
  'Twin Sharing': '双人合住房', 'Single Room (+Supplement)': '单人房（需补差价）', CGK: '苏加诺－哈达国际机场（CGK）', HLP: '哈利姆·珀达纳库苏马机场（HLP）'
};
const optionLabel = (value: string) => locale.value === 'zh-CN' ? (zhOptionLabels[value] || value) : value;

const form = reactive({
  event_id: '',
  full_name: '',
  job_title: '',
  company_organization: '',
  nationality: '',
  title: '',
  business_sector: '',
  email: '',
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
  if (!event) throw new Error(copy.value.noEvent);
  const activityResponse = await getEventActivities(event.id);
  return {
    event,
    activities: activityResponse.data.filter(item => item.is_active !== false)
  };
}, { watch: [locale] });

watchEffect(() => {
  if (options.value?.event.id) form.event_id = options.value.event.id;
});

const activities = computed(() => options.value?.activities ?? []);
const submitting = ref(false);
const feedback = ref('');
const success = ref(false);
const editingRegistrationId = ref('');

if (options.value?.event.id) {
  try {
    const registrations = (await getMyRegistrations(options.value.event.id)).data || [];
    const draft = registrations.find(item => item.status === 'draft');
    if (draft) {
      const registration = (await getRegistration(draft.id)).data;
      const detail = registration.detail || (registration as unknown as Record<string, unknown>);
      for (const key of Object.keys(form) as Array<keyof typeof form>) {
        if (key === 'event_id' || detail[key] === undefined || detail[key] === null) continue;
        (form[key] as unknown) = detail[key];
      }
      editingRegistrationId.value = draft.id;
    }
  } catch (error) {
    const value = error as { data?: { message?: string } };
    feedback.value = value.data?.message || (error instanceof Error ? error.message : copy.value.loadError);
  }
}

const nullable = (value: string) => value || null;
const isValidEmail = (value: string) => { const parts = value.split('@'); return parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]?.includes('.')) && !value.includes(' '); };
const isValidOptionalUrl = (value: string) => { if (!value) return true; try { const parsed = new URL(value); return parsed.protocol === 'http:' || parsed.protocol === 'https:'; } catch { return false; } };

const submit = async () => {
  feedback.value = '';
  success.value = false;
  const requiredText = [form.full_name, form.title, form.job_title, form.company_organization, form.nationality, form.business_sector, form.email, form.company_address, form.products_services, form.business_objectives, form.room_preference, form.arrival_date, form.departure_date, form.airport];
  const requiredSelections = [form.participation_categories, form.looking_for, form.preferred_countries, form.activity_ids];
  if (requiredText.some(value => !value.trim()) || requiredSelections.some(values => !values.length) || form.need_airport_pickup === null || form.need_official_invoice === null) {
    feedback.value = validationCopy.value.required;
    return;
  }
  if (!isValidEmail(form.email)) {
    feedback.value = validationCopy.value.email;
    return;
  }
  if (!isValidOptionalUrl(form.company_website) || !isValidOptionalUrl(form.linkedin)) {
    feedback.value = validationCopy.value.url;
    return;
  }
  if (form.departure_date < form.arrival_date) {
    feedback.value = validationCopy.value.dates;
    return;
  }
  if (!form.information_accuracy_confirmed || !form.terms_accepted || !form.business_matching_data_consent) {
    feedback.value = validationCopy.value.consent;
    return;
  }
  submitting.value = true;

  try {
    await upsertMyProfile({
      full_name: form.full_name,
      organization_name: form.company_organization,
      biography: form.business_objectives
    });

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
      terms_version: '2026-01',
      consent_version: '2026-01'
    };

    const result = editingRegistrationId.value
      ? await updateRegistration(form.event_id, editingRegistrationId.value, payload as RegistrationPayload)
      : await createRegistration(payload as RegistrationPayload);
    success.value = true;
    feedback.value = copy.value.saved.replace('{number}', result.data.registration_number);
    await navigateTo(offlinePayment.value ? '/dashboard/payment-status' : '/dashboard');
  } catch (error) {
    const value = error as { data?: { message?: string; errors?: Array<{ message: string }> } };
    feedback.value = value.data?.errors?.[0]?.message || value.data?.message || (error instanceof Error ? error.message : copy.value.saveError);
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
