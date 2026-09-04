<template>
  <section class="dashboard-shell mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
    <p class="text-sm uppercase tracking-[.35em] text-cyan-200">{{ canViewSalesReport ? 'Organizer Dashboard' : copy.eyebrow }}</p>
    <div class="mt-3 flex flex-wrap items-end justify-between gap-5">
      <div>
        <h1 class="text-3xl font-black sm:text-4xl">{{ copy.title }}</h1>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{{ copy.description }}</p>
      </div>
      <div class="glass-card rounded-2xl px-4 py-3 text-left sm:text-right">
        <p class="text-[10px] uppercase tracking-[.25em] text-slate-400 sm:text-xs">{{ copy.startsIn }}</p>
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
      </div>
      <div class="organizer-actions mt-4 flex flex-wrap gap-2.5">
        <NuxtLink to="/admin/packages" class="inline-flex items-center justify-center rounded-full bg-amber-300 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110 sm:px-5 sm:text-sm">Manage packages</NuxtLink>
        <NuxtLink to="/admin/speakers" class="inline-flex items-center justify-center rounded-full border border-amber-300/40 px-4 py-2.5 text-xs font-bold text-amber-100 transition hover:bg-amber-300/10 sm:px-5 sm:text-sm">Manage speakers</NuxtLink>
        <NuxtLink to="/admin/hosts" class="inline-flex items-center justify-center rounded-full border border-amber-300/40 px-4 py-2.5 text-xs font-bold text-amber-100 transition hover:bg-amber-300/10 sm:px-5 sm:text-sm">Manage hosts</NuxtLink>
        <NuxtLink to="/admin/program" class="inline-flex items-center justify-center rounded-full border border-amber-300/40 px-4 py-2.5 text-xs font-bold text-amber-100 transition hover:bg-amber-300/10 sm:px-5 sm:text-sm">Program & agenda</NuxtLink>
        <NuxtLink to="/admin/users" class="inline-flex items-center justify-center rounded-full border border-amber-300/40 px-4 py-2.5 text-xs font-bold text-amber-100 transition hover:bg-amber-300/10 sm:px-5 sm:text-sm">Manage users</NuxtLink>
        <NuxtLink to="/admin/announcements" class="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:border-white/40 sm:px-5 sm:text-sm">Announcements</NuxtLink>
        <NuxtLink to="/admin/certificates" class="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:border-white/40 sm:px-5 sm:text-sm">Certificates</NuxtLink>
        <NuxtLink to="/admin/email-notifications" class="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:border-white/40 sm:px-5 sm:text-sm">Email notifications</NuxtLink>
        <NuxtLink to="/admin/attendance" class="inline-flex items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2.5 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/20 sm:px-5 sm:text-sm">Attendance scanner</NuxtLink>
        <NuxtLink to="/admin/business-matching" class="inline-flex items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2.5 text-xs font-bold text-amber-100 transition hover:bg-amber-300/20 sm:px-5 sm:text-sm">Matching operations</NuxtLink>
        <NuxtLink to="/admin/transactions" class="inline-flex items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10 px-4 py-2.5 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/20 sm:px-5 sm:text-sm">Manage transactions</NuxtLink>
        <NuxtLink to="/admin/reports" class="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:border-white/40 sm:px-5 sm:text-sm">Payment report</NuxtLink>
        <NuxtLink to="/admin/participants-report" class="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:border-white/40 sm:px-5 sm:text-sm">Participants report</NuxtLink>
      </div>
    </div>

    <h2 class="mt-10 text-2xl font-bold">{{ copy.quickAccess }}</h2>
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
.dashboard-shell {
  padding-inline: 0.75rem;
  font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
}

.organizer-actions {
  display: flex;
  flex-wrap: wrap;
}

.organizer-actions a {
  min-width: fit-content;
}

@media (max-width: 639px) {
  .dashboard-shell {
    padding-top: 2.5rem;
  }

  .dashboard-shell h1 {
    font-size: clamp(2rem, 8vw, 2.5rem);
    line-height: 1.1;
  }

  .dashboard-shell h2 {
    font-size: clamp(1.5rem, 6vw, 2rem);
  }

  .dashboard-shell .grid {
    grid-template-columns: 1fr;
  }

  .organizer-actions {
    gap: 0.6rem;
  }

  .organizer-actions a {
    flex: 1 1 100%;
    width: 100%;
    min-height: 2.9rem;
  }

  .glass-card {
    padding: 1rem;
  }
}
</style>

<script setup lang="ts">
definePageMeta({middleware:'auth'});
const {locale}=useI18n();
const messages={
  en:{eyebrow:'Participant Dashboard',title:'Welcome to IWBIF 2026',description:'Your ticket, schedule, profile, networking, payment, and event updates in one place.',startsIn:'Event starts in',days:'{count} days',eventDay:'Event day',quickAccess:'Quick access',statuses:[['Registration','Check your status','Complete all required participant details.'],['Payment','Payment center','Review transaction and confirmation status.'],['My Ticket','Digital QR pass','Keep your personal QR code secure.'],['Profile','Build your network','Complete your professional information.']],menu:[['Purchase','Shopping Cart','Review selected packages and create your checkout order.'],['Access','My Ticket & QR Code','Open your event pass and check-in information.'],['Identity','My Profile','Update professional details, expertise, and interests.'],['Networking','Participant Directory','Discover potential collaborators across IWBIF.'],['Agenda','My Schedule','Review the forum agenda and sessions.'],['Transaction','Payment','Create or continue your payment transaction.'],['Document','Invoice','Review invoice and registration details.'],['Recognition','Certificate','Access your certificate after attendance eligibility.'],['Updates','Announcements','Read important information from the organizing team.'],['Privacy','Directory Consent','Understand and manage profile visibility.'],['Account','Change Password','Update the password used to sign in to your account.']],seo:'Participant Dashboard'},
  zh:{eyebrow:'参与者控制面板',title:'欢迎参加 IWBIF 2026',description:'在一个页面中查看您的门票、日程、个人资料、商务联系、付款和活动更新。',startsIn:'距离活动开始',days:'{count} 天',eventDay:'活动当天',quickAccess:'快速访问',statuses:[['注册','查看注册状态','请填写所有必需的参与者资料。'],['付款','付款中心','查看交易与确认状态。'],['我的门票','电子二维码通行证','请妥善保管您的个人二维码。'],['个人资料','拓展商务网络','完善您的专业信息。']],menu:[['购买','购物车','核对所选套餐并创建结账订单。'],['入场','我的门票与二维码','查看活动通行证和签到信息。'],['身份资料','我的个人资料','更新专业信息、专长与兴趣。'],['商务联系','参与者名录','在 IWBIF 寻找潜在合作伙伴。'],['议程','我的日程','查看论坛议程和会议安排。'],['交易','付款','创建或继续您的付款交易。'],['文件','发票','查看发票和注册详情。'],['荣誉','证书','满足出席资格后获取证书。'],['更新','公告','阅读主办团队发布的重要信息。'],['隐私','名录授权','了解并管理个人资料的可见性。'],['账户','修改密码','更新用于登录账户的密码。']],seo:'参与者控制面板'}
} as const;
const copy=computed(()=>locale.value==='zh-CN'?messages.zh:messages.en);
useSeoMeta({title:()=>`${copy.value.seo} | IWBIF 2026`});

const authStore = useAuthStore();
const canViewSalesReport = computed(() => authStore.isAdminOrOrganizer);

const eventDate=new Date('2026-10-14T09:00:00+07:00');
const days=Math.max(0,Math.ceil((eventDate.getTime()-Date.now())/86400000));
const countdown=computed(()=>days>0?copy.value.days.replace('{count}',String(days)):copy.value.eventDay);

const statuses=computed(()=>copy.value.statuses.map(([label,value,note])=>({label,value,note})));

const menuRoutes=['/dashboard/cart','/dashboard/ticket','/dashboard/profile','/dashboard/directory','/dashboard/schedule','/dashboard/payment','/dashboard/invoice','/dashboard/certificate','/dashboard/announcements','/directory-consent','/dashboard/security'] as const;
const menu=computed(()=>copy.value.menu.map(([label,title,text],index)=>({to:menuRoutes[index]!,label,title,text})));
</script>
