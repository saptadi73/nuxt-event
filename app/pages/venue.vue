<template>
  <main class="venue-page overflow-hidden">
    <section class="venue-hero relative border-b border-white/10">
      <div class="venue-glow venue-glow-one" aria-hidden="true" />
      <div class="venue-glow venue-glow-two" aria-hidden="true" />
      <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <p class="text-xs font-bold uppercase tracking-[.34em] text-[#e6c477]">{{ copy.eyebrow }}</p>
        <div class="mt-5 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <h1 class="max-w-4xl font-serif text-4xl font-black leading-[1.05] text-white sm:text-6xl lg:text-7xl">{{ copy.title }}</h1>
          <p class="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">{{ copy.intro }}</p>
        </div>
        <div class="mt-10 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[.18em] text-sky-100">
          <span class="rounded-full border border-[#e6c477]/30 bg-[#e6c477]/10 px-4 py-2">IWBIF 2026</span>
          <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">{{ copy.eventDate }}</span>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
        <div>
          <p class="section-label">{{ copy.eventVenue }}</p>
          <p class="mt-4 text-sm font-bold uppercase tracking-[.2em] text-sky-200">{{ copy.fiveStar }}</p>
          <h2 class="mt-3 font-serif text-3xl font-black leading-tight text-white sm:text-5xl">Hotel Indonesia Kempinski Jakarta</h2>
          <p class="mt-5 max-w-xl text-sm leading-7 text-slate-300">{{ copy.kempinskiVenueAddress }}</p>
          <a class="map-link mt-6" href="https://maps.app.goo.gl/ygxvhhDAHYbcxwyE8" target="_blank" rel="noopener noreferrer">{{ copy.openMap }} <span aria-hidden="true">↗</span></a>
        </div>
        <figure class="venue-feature group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
          <img :src="ballroomSetup" :alt="copy.ballroom" class="aspect-[16/9] h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]">
          <figcaption class="p-5 text-sm font-bold uppercase tracking-[.18em] text-[#e6c477]">{{ copy.ballroom }}</figcaption>
        </figure>
      </div>

      <div class="mt-8 grid gap-5 sm:grid-cols-3">
        <VenueImage :src="ballroomEmpty" :alt="copy.ballroom" :label="copy.ballroom" />
        <VenueImage :src="ballroomLayout" :alt="copy.ballroomLayout" :label="copy.ballroomLayout" contain />
        <VenueImage :src="ballroomFoyer" :alt="copy.ballroomFoyer" :label="copy.ballroomFoyer" />
      </div>
    </section>

    <section class="border-y border-white/10 bg-white/[.025]">
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p class="section-label">{{ copy.jakartaAccommodation }}</p>
        <h2 class="mt-3 text-3xl font-bold text-white sm:text-4xl">{{ copy.stayInJakarta }}</h2>
        <div class="mt-10 grid gap-6 lg:grid-cols-2">
          <VenueHotelCard
            name="Hotel Indonesia Kempinski Jakarta"
            :rating="copy.fiveStar"
            :address="copy.kempinskiStayAddress"
            map-url="https://maps.app.goo.gl/Bh6Mcoyqh5Qgebky9"
            :map-label="copy.openMap"
            :images="kempinskiRooms"
          />
          <VenueHotelCard
            name="Hotel Grand Sahid Jaya"
            :rating="copy.fourStar"
            :address="copy.sahidAddress"
            map-url="https://maps.app.goo.gl/5foLhpHU6C7TZSUQA"
            :map-label="copy.openMap"
            :images="sahidRooms"
          />
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <p class="section-label">{{ copy.bandungAccommodation }}</p>
      <div class="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p class="text-sm font-bold uppercase tracking-[.2em] text-sky-200">{{ copy.fourStar }}</p><h2 class="mt-3 font-serif text-3xl font-black text-white sm:text-5xl">Mercure Bandung City Centre</h2></div>
        <div class="max-w-xl lg:text-right"><p class="text-sm leading-7 text-slate-300">{{ copy.mercureAddress }}</p><a class="map-link mt-4 lg:ml-auto" href="https://maps.app.goo.gl/Lzwbxe8N8w3mM8rQA" target="_blank" rel="noopener noreferrer">{{ copy.openMap }} <span aria-hidden="true">↗</span></a></div>
      </div>
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <VenueImage v-for="image in mercureImages" :key="image.label" :src="image.src" :alt="image.label" :label="image.label" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import ballroomFoyer from '~/assets/images/venue/Kempinski Grand Ballroom Foyer.jpeg';
import ballroomEmpty from '~/assets/images/venue/Kempinski Grand Ballroom_No Setup.jpeg';
import ballroomSetup from '~/assets/images/venue/Kempinski Grand Ballroom_Setup.jpg.jpeg';
import ballroomLayout from '~/assets/images/venue/Grand Ballroom Layout.png';
import kempinskiRoom from '~/assets/images/venue/JKT1_Deluxe Room B.jpg.jpeg';
import kempinskiTwinSharing from '~/assets/images/Kempinski Deluxe Room – Twin Bed (Sharing).png';
import mercureLobby from '~/assets/images/venue/MERCURE BANDUNG - LOBBY.png';
import mercureRoof from '~/assets/images/venue/MERCURE BANDUNG - ROOF TOP.png';
import mercureSharing from '~/assets/images/venue/MERCURE BANDUNG - SUPERIOR SHARING.png';
import mercureSingle from '~/assets/images/venue/MERCURE BANDUNG - SUPERIOR SINGLE.png';
import sahidSingle from '~/assets/images/venue/SAHID HOTEL - SINGLE (4 STAR).png';
import sahidSharing from '~/assets/images/venue/SAHID HOTEL - TWIN SHARING (4 STAR).png';

const { locale } = useI18n();
const messages = {
  en: {
    eyebrow: 'Venue & accommodation', title: 'Where IWBIF 2026 comes to life.', intro: 'Discover the event venue in the heart of Jakarta and the selected accommodation options for delegates in Jakarta and Bandung.', eventDate: '14–17 October · Jakarta & Bandung', eventVenue: 'Event venue', fiveStar: '5-star hotel ★★★★★', fourStar: '4-star hotel ★★★★', openMap: 'Open in Google Maps', ballroom: 'Grand Ballroom', ballroomLayout: 'Grand Ballroom Layout', ballroomFoyer: 'Grand Ballroom Foyer', jakartaAccommodation: 'Accommodation · Jakarta', stayInJakarta: 'Selected stays in central Jakarta', bandungAccommodation: 'Accommodation · Bandung', kempinskiVenueAddress: 'Jl. Kebon Kacang Raya Blok D6, Kebon Kacang, Tanah Abang, Central Jakarta, DKI Jakarta 10230', kempinskiStayAddress: 'Jl. M.H. Thamrin No. 1, Menteng, Central Jakarta, DKI Jakarta 10310', sahidAddress: 'Jl. Jenderal Sudirman No. 86, Karet Tengsin, Tanah Abang, Central Jakarta, DKI Jakarta 10220', mercureAddress: 'Jl. Lengkong Besar No. 8, Cikawao, Lengkong, Bandung, West Java 40261', twinSharing: 'Deluxe Room · Twin Bed (Sharing)', singleRoom: 'Deluxe Room · King Bed (Single)', superiorSharing: 'Superior Room · Twin Bed (Sharing)', superiorSingle: 'Superior Room · Queen Bed (Single)', rooftop: 'Rooftop Swimming Pool', lobby: 'Hotel Lobby'
  },
  'zh-CN': {
    eyebrow: '场地与住宿', title: 'IWBIF 2026 精彩启幕之地。', intro: '探索位于雅加达市中心的活动场地，以及为代表们精心挑选的雅加达和万隆住宿选择。', eventDate: '10月14日至17日 · 雅加达与万隆', eventVenue: '活动场地', fiveStar: '五星级酒店 ★★★★★', fourStar: '四星级酒店 ★★★★', openMap: '在 Google 地图中查看', ballroom: '大宴会厅', ballroomLayout: '大宴会厅布局', ballroomFoyer: '大宴会厅前厅', jakartaAccommodation: '住宿 · 雅加达', stayInJakarta: '雅加达市中心精选住宿', bandungAccommodation: '住宿 · 万隆', kempinskiVenueAddress: '雅加达首都特区中雅加达市丹纳阿邦区 Kebon Kacang，Jl. Kebon Kacang Raya Blok D6，邮编 10230', kempinskiStayAddress: '雅加达首都特区中雅加达市 Menteng，Jl. M.H. Thamrin No. 1，邮编 10310', sahidAddress: '雅加达首都特区中雅加达市丹纳阿邦区 Karet Tengsin，Jl. Jenderal Sudirman No. 86，邮编 10220', mercureAddress: '西爪哇省万隆市 Lengkong 区 Cikawao，Jl. Lengkong Besar No. 8，邮编 40261', twinSharing: '豪华客房 · 双床（合住）', singleRoom: '豪华客房 · 特大床（单住）', superiorSharing: '高级客房 · 双床（合住）', superiorSingle: '高级客房 · 大床（单住）', rooftop: '屋顶游泳池', lobby: '酒店大堂'
  }
} as const;
const copy = computed(() => messages[locale.value === 'zh-CN' ? 'zh-CN' : 'en']);
const kempinskiRooms = computed(() => [{ src: kempinskiTwinSharing, label: copy.value.twinSharing }, { src: kempinskiRoom, label: copy.value.singleRoom }]);
const sahidRooms = computed(() => [{ src: sahidSharing, label: copy.value.twinSharing }, { src: sahidSingle, label: copy.value.singleRoom }]);
const mercureImages = computed(() => [{ src: mercureSharing, label: copy.value.superiorSharing }, { src: mercureSingle, label: copy.value.superiorSingle }, { src: mercureRoof, label: copy.value.rooftop }, { src: mercureLobby, label: copy.value.lobby }]);
useSeoMeta({ title: () => `${copy.value.eyebrow} | IWBIF 2026`, description: () => copy.value.intro });
</script>

<style scoped>
.venue-page{min-height:70vh;background:linear-gradient(180deg,#031127 0%,#061a35 50%,#020e21 100%)}
.venue-hero{background:radial-gradient(circle at 78% 25%,rgba(216,172,89,.15),transparent 29rem),linear-gradient(135deg,rgba(6,45,82,.72),transparent 62%)}
.venue-glow{position:absolute;border-radius:999px;filter:blur(90px);pointer-events:none}.venue-glow-one{right:3%;top:-11rem;width:29rem;height:29rem;background:rgba(216,172,89,.1)}.venue-glow-two{left:-10rem;bottom:-14rem;width:30rem;height:30rem;background:rgba(14,116,144,.18)}
.section-label{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.3em;color:#e6c477}.map-link{display:flex;width:max-content;align-items:center;gap:.55rem;border-radius:999px;border:1px solid rgba(125,211,252,.28);background:rgba(14,116,144,.12);padding:.7rem 1.1rem;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:#bae6fd;transition:.2s}.map-link:hover{border-color:rgba(230,196,119,.55);color:#fde9ad;background:rgba(230,196,119,.1)}
.venue-feature{box-shadow:0 28px 80px rgba(0,0,0,.28)}
@media (prefers-reduced-motion:reduce){.venue-feature img,.map-link{transition:none}}
</style>
