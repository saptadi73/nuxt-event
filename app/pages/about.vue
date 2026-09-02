<template>
  <main class="about-page overflow-hidden">
    <section class="about-hero relative mx-auto max-w-[94rem] px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24">
      <div class="about-glow" aria-hidden="true" />
      <div class="about-hero-composition relative">
        <div class="about-hero-copy relative z-10">
          <p class="eyebrow">{{ copy.eyebrow }}</p>
          <h1 class="about-hero-title mt-5 text-4xl font-black leading-[1.08] text-[#f8f6f1] sm:text-5xl lg:text-6xl">
            {{ copy.heroLead }} <span class="hero-highlight">{{ copy.heroHighlight }}</span>
          </h1>
          <p class="about-hero-intro mt-6 text-base leading-8 text-[#cbd2dc] sm:text-lg">
            {{ copy.intro }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3" aria-label="IWBIF focus areas">
            <span v-for="focus in focusAreas" :key="focus" class="focus-pill">{{ focus }}</span>
          </div>
        </div>

        <figure class="image-stage">
          <div class="image-frame">
            <img src="/images/about-iwbif.png" :alt="copy.heroAlt" class="h-full w-full object-cover" width="1536" height="1024" fetchpriority="high">
            <div class="image-overlay" aria-hidden="true" />
          </div>
          <figcaption class="image-caption">
            <span class="caption-mark" aria-hidden="true">01</span>
            <span><strong>{{ copy.indonesiaWorld }}</strong><small>{{ copy.trade }}</small></span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="vision-section border-y border-white/10">
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div class="mb-9 max-w-3xl">
          <p class="eyebrow">{{ copy.visionLabel }}</p>
          <h2 class="mt-4 text-3xl font-black leading-tight text-[#f8f6f1] sm:text-4xl lg:text-5xl">{{ copy.visionLead }} <span class="vision-highlight">{{ copy.visionHighlight }}</span></h2>
        </div>

        <div class="vision-composition">
          <figure class="vision-image-frame">
            <img src="/images/our-vision.png" :alt="copy.visionAlt" width="1672" height="941" loading="lazy">
            <div class="vision-image-shade" aria-hidden="true" />
            <figcaption><span>{{ copy.sharedVision }}</span><strong>{{ copy.borderless }}</strong></figcaption>
          </figure>

          <div class="vision-panel">
            <span class="vision-quote" aria-hidden="true">“</span>
            <p class="relative text-xl font-semibold leading-9 text-[#f8f6f1] sm:text-2xl">{{ copy.visionText }}</p>
            <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div v-for="outcome in outcomes" :key="outcome" class="outcome-item"><span class="outcome-dot" aria-hidden="true" /><span>{{ outcome }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="max-w-2xl">
        <p class="eyebrow">{{ copy.impactLabel }}</p>
        <h2 class="mt-4 text-3xl font-black text-[#f8f6f1] sm:text-4xl">{{ copy.impactTitle }}</h2>
      </div>
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        <article v-for="(item, index) in mission" :key="item.title" class="mission-card">
          <div class="mission-card-top">
            <span class="mission-number">0{{ index + 1 }}</span>
            <div class="mission-icon" aria-hidden="true">
              <svg v-if="index === 0" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="16" r="8" />
                <circle cx="14" cy="43" r="7" />
                <circle cx="50" cy="43" r="7" />
                <path d="M27 23 18 36M37 23l9 13M21 43h22" />
              </svg>
              <svg v-else-if="index === 1" viewBox="0 0 64 64" fill="none">
                <path d="m7 25 10-9 13 6-8 8 5 5 9-8 11 2 10 10-15 15a8 8 0 0 1-11 0L7 31v-6Z" />
                <path d="m17 16 8-5 13 7M42 54l-7-7M49 47l-8-8M56 40l-8-8" />
              </svg>
              <svg v-else viewBox="0 0 64 64" fill="none">
                <path d="M10 52h44M15 47V35h9v12M28 47V25h9v22M41 47V15h9v32" />
                <path d="m13 28 13-10 10 3L51 8M43 8h8v8" />
              </svg>
            </div>
          </div>
          <h3 class="mt-8 text-2xl font-bold text-[#e6c477]">{{ item.title }}</h3>
          <p class="mt-4 leading-7 text-[#cbd2dc]">{{ item.text }}</p>
        </article>
      </div>

      <div class="mt-20">
        <div class="max-w-3xl">
          <p class="eyebrow">{{ copy.whyLabel }}</p>
          <h2 class="mt-4 text-3xl font-black text-[#f8f6f1] sm:text-4xl lg:text-5xl">{{ copy.whyTitle }}</h2>
          <p class="mt-5 max-w-2xl leading-7 text-[#cbd2dc]">{{ copy.whyIntro }}</p>
        </div>

        <figure class="about-why-visual">
          <div class="about-why-frame">
            <img src="/images/why-indonesia.png" :alt="copy.whyAlt" width="1672" height="941" loading="lazy">
            <div class="about-why-overlay" aria-hidden="true" />
          </div>
          <figcaption class="about-why-caption">
            <span>{{ copy.indonesia }}</span>
            <strong>{{ copy.gateway }}</strong>
          </figcaption>
          <div class="about-why-grid">
            <article v-for="(item, index) in why" :key="item.title" class="why-card">
              <span class="why-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </figure>
      </div>
    </section>

    <section class="awec-section border-t border-white/10">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <figure class="awec-image-wrap">
          <img src="/images/about-awec.png" :alt="copy.awecAlt" width="1536" height="864" loading="lazy">
          <div class="awec-image-shade" aria-hidden="true" />
          <figcaption>
            <span>AWEC</span>
            <strong>{{ copy.awecImageCaption }}</strong>
          </figcaption>
        </figure>

        <div class="awec-content">
          <div class="awec-heading">
            <p class="eyebrow">{{ copy.awecEyebrow }}</p>
            <h2>{{ copy.awecTitle }}</h2>
          </div>
          <div class="awec-story">
            <p v-for="paragraph in copy.awecParagraphs" :key="paragraph">{{ paragraph }}</p>
            <a class="awec-link" href="https://www.nvqiyejia.com/" target="_blank" rel="noopener noreferrer">
              <span>{{ copy.awecWebsite }}</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="iwapi-section border-t border-white/10">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <figure class="iwapi-main-photo">
          <img src="/images/about-iwapi-main.png" :alt="copy.iwapiAlt" width="1536" height="864" loading="lazy">
          <div aria-hidden="true" />
          <figcaption><span>Since</span><strong>1975</strong></figcaption>
        </figure>

        <div class="iwapi-profile">
          <div>
            <p class="eyebrow">{{ copy.iwapiEyebrow }}</p>
            <h2>{{ copy.iwapiTitle }}</h2>
          </div>
          <p v-html="copy.iwapiBody" />
        </div>

        <div class="iwapi-events-heading">
          <div><p class="eyebrow">{{ copy.iwapiEventsLabel }}</p><h3>{{ copy.iwapiEventsTitle }}</h3></div>
          <span>{{ copy.iwapiEventsCaption }}</span>
        </div>
        <figure class="iwapi-events-photo">
          <img src="/images/iwapi-events.png" :alt="copy.iwapiEventsAlt" width="1536" height="864" loading="lazy">
        </figure>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const {locale}=useI18n();
const messages={en:{eyebrow:'About IWBIF 2026',heroLead:'Where women-led businesses build',heroHighlight:'global momentum.',intro:'The International Women Business & Investment Forum is a curated ecosystem where women entrepreneurs, investors, buyers, governments, and international partners turn meaningful connections into measurable growth.',heroAlt:'Women business leaders building international partnerships across Indonesia and Asia',indonesiaWorld:'Indonesia to the world',trade:'Trade · Investment · Partnership',visionLabel:'Our vision',visionLead:'More than a forum.',visionHighlight:'A pathway to opportunity.',visionAlt:'Women leaders representing Indonesia and Asia driving global business, technology, manufacturing, and sustainable growth',sharedVision:'One shared vision',borderless:'Women-led growth without borders',visionText:'Position Indonesia as a regional hub where women-led businesses build bridges, unlock investments, and accelerate sustainable cross-border partnerships.',impactLabel:'How we create impact',impactTitle:'Connection with a clear business purpose.',whyLabel:'Why Indonesia?',whyTitle:'A strategic home for regional growth.',whyIntro:'Scale, connectivity, and convening power make Indonesia a natural meeting point for ambitious businesses.',whyAlt:"Indonesia's infrastructure, manufacturing, cultural heritage, tourism, renewable energy, and international trade",indonesia:'Indonesia',gateway:'Gateway to ASEAN & Asia',focus:['Women-led growth','Cross-border trade','Strategic investment'],outcomes:['Qualified business leads','Buyer and seller connections','Investment discussions','Strategic partnerships and MoUs'],mission:[{title:'Connect',text:'Bring entrepreneurs, buyers, investors, and ecosystem leaders together across borders.'},{title:'Collaborate',text:'Shape practical solutions for market entry, access to capital, and procurement opportunities.'},{title:'Create',text:'Turn conversations into qualified leads, tangible business deals, and lasting partnerships.'}],why:[{title:'A market of significant scale',text:'A domestic market of more than 283 million people with strong regional relevance.'},{title:'Gateway to ASEAN & Asia',text:'A strategic location connecting dynamic markets and cross-border opportunity.'},{title:'Global convening power',text:'A G20 economy suited to public-private dialogue and practical deal-making.'},{title:'Business meets diplomacy',text:'Corporations, investors, embassies, and decision-makers meet in one city.'}]},'zh-CN':{eyebrow:'关于 IWBIF 2026',heroLead:'女性主导企业在此汇聚',heroHighlight:'全球发展动能。',intro:'国际女性商业与投资论坛是一个精心构建的生态系统，女性企业家、投资者、买家、政府和国际合作伙伴在此将有价值的连接转化为可量化的增长。',heroAlt:'女性商业领袖在印度尼西亚与亚洲建立国际合作',indonesiaWorld:'从印度尼西亚走向世界',trade:'贸易 · 投资 · 合作',visionLabel:'我们的愿景',visionLead:'不止于论坛。',visionHighlight:'通往机遇的道路。',visionAlt:'印度尼西亚与亚洲女性领袖推动全球商业、科技、制造与可持续增长',sharedVision:'共同愿景',borderless:'女性主导的无界增长',visionText:'将印度尼西亚打造成区域枢纽，让女性主导企业搭建桥梁、释放投资潜力，并加速可持续的跨境合作。',impactLabel:'我们如何创造影响',impactTitle:'以明确商业目标建立连接。',whyLabel:'为什么选择印度尼西亚？',whyTitle:'区域增长的战略枢纽。',whyIntro:'市场规模、互联能力和召集力，使印度尼西亚成为雄心企业的天然汇聚点。',whyAlt:'印度尼西亚的基础设施、制造业、文化遗产、旅游、可再生能源与国际贸易',indonesia:'印度尼西亚',gateway:'通往东盟与亚洲的门户',focus:['女性主导增长','跨境贸易','战略投资'],outcomes:['优质商业线索','买卖双方对接','投资洽谈','战略合作与谅解备忘录'],mission:[{title:'连接',text:'跨越国界汇聚企业家、买家、投资者和生态系统领袖。'},{title:'协作',text:'为市场准入、资本获取和采购机遇制定务实解决方案。'},{title:'创造',text:'将对话转化为优质线索、实质性交易和长久合作。'}],why:[{title:'规模庞大的市场',text:'超过2.83亿人的国内市场，对区域发展具有重要意义。'},{title:'通往东盟与亚洲的门户',text:'连接活力市场与跨境机遇的战略位置。'},{title:'全球召集力',text:'适合公私对话和务实交易的 G20 经济体。'},{title:'商业与外交交汇',text:'企业、投资者、使馆和决策者在同一城市汇聚。'}]}} as const;
const aboutOverview={
  en:{
    eyebrow:'About IWBIF 2026',
    heroLead:'Empowering Women Entrepreneurs through',
    heroHighlight:'Finance, Global Collaboration & Digital Transformation',
    intro:'The 4th Asian Women Entrepreneurs Conference & International Women in Business & Investment Forum (IWBIF) 2026 is a premier international platform connecting women entrepreneurs, investors, business leaders, governments, and strategic partners to foster cross-border trade, investment, innovation, and sustainable economic growth. Guided by the theme “Empowering Women Entrepreneurs through Finance, Global Collaboration & Digital Transformation,” the forum creates meaningful opportunities for business matching, investment partnerships, market access, and international collaboration across Asia and beyond.',
    heroAlt:'Women entrepreneurs connecting through finance, global collaboration, and digital transformation at IWBIF 2026',
    indonesiaWorld:'Connecting Asia to Global Opportunities',
    trade:'Trade · Investment · Innovation',
    focus:["Women's Economic Empowerment",'Global Collaboration','Digital Transformation'],
    awecEyebrow:'About AWEC',
    awecTitle:'Asian Women Entrepreneurs Conference',
    awecAlt:'Asian Women Entrepreneurs Conference delegates gathered at an international conference',
    awecImageCaption:'Connecting women entrepreneurs across Asia',
    awecWebsite:'Visit the official AWEC website',
    awecParagraphs:[
      'The Asian Women Entrepreneurs Conference is a premier international platform dedicated to advancing economic, trade, and business cooperation among women entrepreneurs across Asia.',
      'Initiated by the Hainan Women Entrepreneurs Association, the Conference evolved from the East Asian Women Entrepreneurs Conference. Its inaugural edition was held in Hainan, followed by the second edition in Kuala Lumpur, Malaysia, and the third in Guiyang, Guizhou, China. Through these successive editions, the Conference has developed into a significant platform connecting women entrepreneurs, business leaders, policymakers, and innovators from across Asia.',
      'The Conference serves as a bridge for women entrepreneurs’ associations across China and the wider Asian region, fostering stronger networks, cross-regional cooperation, and cross-border partnerships. It provides a dynamic platform for participants to exchange knowledge and experience, showcase innovative achievements, explore new markets and investment opportunities, and establish meaningful business connections.',
      'At its heart, the Conference is committed to empowering women, connecting markets, and creating opportunities. By bringing together accomplished women entrepreneurs and influential leaders from diverse industries and economies, it encourages the sharing of ideas, expertise, resources, and innovative solutions to address emerging opportunities and challenges.',
      'Through dialogue, collaboration, and strategic partnerships, the Asian Women Entrepreneurs Conference seeks to strengthen the role of women in Asia’s economic development, facilitate greater regional and international cooperation, and create an enduring ecosystem in which women entrepreneurs can grow, innovate, and succeed together.',
      'Ultimately, the Conference aspires to become a powerful catalyst for women-led innovation, cross-border collaboration, and sustainable economic growth, contributing to a more connected, inclusive, and prosperous future for Asia.'
    ],
    iwapiEyebrow:'About IWAPI',
    iwapiTitle:'The Indonesian Women Entrepreneurs Association',
    iwapiAlt:'IWAPI women entrepreneurs gathered together in Indonesia',
    iwapiBody:'<strong>IWAPI (The Indonesian Women Entrepreneurs Association)</strong> is an organization for women entrepreneurs that was established on February 10, 1975. IWAPI has a nationwide presence across 36 provinces, as well as regencies, cities, and districts throughout Indonesia, with more than 40,000 members.',
    iwapiEventsLabel:'IWAPI Events',
    iwapiEventsTitle:'Connections that move business forward.',
    iwapiEventsCaption:'National leadership · International collaboration · Women-led enterprise',
    iwapiEventsAlt:'IWAPI leaders participating in national and international business events and strategic meetings'
  },
  'zh-CN':{
    eyebrow:'关于 IWBIF 2026',
    heroLead:'以金融、全球协作与数字化转型',
    heroHighlight:'赋能女性企业家',
    intro:'第四届亚洲女性企业家大会暨2026国际女性商业与投资论坛（IWBIF 2026），是连接女性企业家、投资者、商业领袖、政府机构及战略合作伙伴的国际高端平台，致力于推动跨境贸易、投资、创新与可持续经济增长。论坛以“以金融、全球协作与数字化转型赋能女性企业家”为主题，为亚洲及全球各地的参与者创造高价值的商务配对、投资合作、市场拓展与国际协作机遇。',
    heroAlt:'女性企业家在 IWBIF 2026 通过金融、全球协作与数字化转型连接全球机遇',
    indonesiaWorld:'连接亚洲，共享全球机遇',
    trade:'贸易 · 投资 · 创新',
    focus:['女性经济赋权','全球协作','数字化转型'],
    awecEyebrow:'关于 AWEC',
    awecTitle:'亚洲女性企业家大会',
    awecAlt:'来自亚洲各地的女性企业家代表齐聚亚洲女性企业家大会',
    awecImageCaption:'连接亚洲女性企业家',
    awecWebsite:'访问 AWEC 官方网站',
    awecParagraphs:[
      '亚洲女性企业家大会是一个致力于推动亚洲各国女性企业家在经济、贸易与商业领域开展合作的国际高端平台。',
      '大会由海南省女企业家协会发起，并由东亚女企业家大会发展演变而来。首届大会在海南举行，第二届在马来西亚吉隆坡举行，第三届在中国贵州贵阳举行。经过历届大会的持续发展，该会议已成为连接亚洲各地女性企业家、商业领袖、政策制定者与创新者的重要平台。',
      '大会为中国及亚洲其他地区的女性企业家协会搭建沟通桥梁，推动构建更加紧密的合作网络，深化跨区域协作与跨境伙伴关系。大会为参会者提供充满活力的交流平台，促进知识与经验分享、创新成果展示、新市场与投资机会探索，并助力建立富有价值的商业联系。',
      '大会始终以赋能女性、连接市场、创造机遇为核心使命。通过汇聚来自不同产业和经济体的杰出女性企业家与具有影响力的领袖，大会鼓励各方分享理念、专业知识、资源与创新解决方案，共同把握新兴机遇并应对未来挑战。',
      '亚洲女性企业家大会通过对话、协作与战略伙伴关系，致力于提升女性在亚洲经济发展中的作用，促进更广泛的区域及国际合作，并构建一个让女性企业家共同成长、创新与成功的长效生态系统。',
      '最终，大会期望成为推动女性引领创新、跨境协作与可持续经济增长的重要催化力量，为亚洲建设更加互联、包容与繁荣的未来作出贡献。'
    ],
    iwapiEyebrow:'关于 IWAPI',
    iwapiTitle:'印度尼西亚女企业家协会',
    iwapiAlt:'印度尼西亚女企业家协会成员合影',
    iwapiBody:'<strong>IWAPI（印度尼西亚女企业家协会）</strong>是服务于女性企业家的全国性组织，成立于1975年2月10日。IWAPI 的组织网络覆盖印度尼西亚全国36个省，并深入各县、市及地区，现拥有超过40,000名会员。',
    iwapiEventsLabel:'IWAPI 活动',
    iwapiEventsTitle:'以连接推动商业向前发展。',
    iwapiEventsCaption:'全国领导力 · 国际协作 · 女性引领企业发展',
    iwapiEventsAlt:'IWAPI 领导者参与国内外商业活动及战略交流会议'
  }
} as const;
const copy=computed(()=>{
  const language=locale.value==='zh-CN'?'zh-CN':'en';
  return {...messages[language],...aboutOverview[language]};
});
const focusAreas=computed(()=>copy.value.focus); const outcomes=computed(()=>copy.value.outcomes); const mission=computed(()=>copy.value.mission); const why=computed(()=>copy.value.why);
useSeoMeta({title:()=>`${copy.value.eyebrow} | IWBIF 2026`,description:()=>copy.value.intro,ogImage:'/images/about-iwbif.png'});
</script>

<style scoped>
.about-page { background: radial-gradient(circle at 82% 7%, rgba(230,196,119,.12), transparent 25rem), radial-gradient(circle at 8% 42%, rgba(11,36,71,.74), transparent 34rem), linear-gradient(180deg,#031127 0%,#061a35 52%,#020e21 100%); }
.about-glow { position:absolute; right:-8rem; top:-10rem; width:34rem; height:34rem; border-radius:999px; background:rgba(216,172,89,.1); filter:blur(86px); }
.about-hero-composition { display:grid; align-items:center; gap:2rem; }
.about-hero-copy { min-width:0; }
.about-hero-title { max-width:48rem; text-wrap:balance; }
.about-hero-intro { max-width:43rem; }
.eyebrow { color:#e6c477; font-size:.75rem; font-weight:700; letter-spacing:.3em; text-transform:uppercase; }
.hero-highlight,
.vision-highlight {
  display:inline-block;
  color:#e6c477;
  font-family:'Playfair Display','Times New Roman',serif;
  letter-spacing:-0.05em;
  text-shadow:0 0 22px rgba(230,196,119,.18);
}

.hero-highlight {
  font-size:clamp(2.55rem, 5vw, 5.12rem);
  line-height:0.9;
  font-weight:700;
  margin-top:.08em;
}

.vision-highlight {
  font-size:clamp(2.1rem, 4vw, 4.2rem);
  line-height:0.94;
  font-weight:700;
}

.focus-pill { border:1px solid rgba(216,172,89,.32); border-radius:999px; background:rgba(216,172,89,.07); padding:.65rem .9rem; color:#f8f6f1; font-size:.78rem; font-weight:600; }
.image-stage { position:relative; min-width:0; padding:.75rem .75rem 2.5rem; }
.image-stage::before { content:''; position:absolute; inset:0 3rem 1rem 0; border:1px solid rgba(230,196,119,.35); border-radius:2rem; }
.image-frame { position:relative; aspect-ratio:3/2; overflow:hidden; border:1px solid rgba(230,196,119,.2); border-radius:1.6rem; box-shadow:0 32px 90px rgba(0,0,0,.56),0 0 52px rgba(216,172,89,.1); }
.image-frame img { transition:transform 700ms ease; }
.image-stage:hover .image-frame img { transform:scale(1.025); }
.image-overlay { position:absolute; inset:0; background:linear-gradient(90deg,rgba(3,17,39,.18),transparent 30%,rgba(230,196,119,.04)),linear-gradient(180deg,transparent 48%,rgba(2,14,33,.76) 100%); box-shadow:inset 0 0 55px rgba(1,8,20,.22); pointer-events:none; }
.image-caption { position:absolute; right:0; bottom:0; display:flex; align-items:center; gap:.9rem; min-width:17rem; border:1px solid rgba(216,172,89,.28); border-radius:1rem; background:rgba(4,21,45,.94); padding:.9rem 1rem; box-shadow:0 16px 40px rgba(0,0,0,.3); backdrop-filter:blur(16px); }
.caption-mark,.why-index,.mission-number { color:#d8ac59; font-size:.72rem; font-weight:800; letter-spacing:.18em; }
.image-caption strong,.image-caption small { display:block; }
.image-caption strong { color:#f8f6f1; font-size:.83rem; }
.image-caption small { margin-top:.2rem; color:#aeb9c8; font-size:.65rem; letter-spacing:.08em; text-transform:uppercase; }
.vision-panel,.mission-card,.why-card { border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.035); box-shadow:inset 0 1px rgba(255,255,255,.04); }
.vision-section { position:relative; background:radial-gradient(circle at 12% 40%,rgba(216,172,89,.08),transparent 27rem),rgba(7,29,58,.75); }
.vision-composition { display:grid; gap:1rem; }
.vision-image-frame { position:relative; min-height:0; overflow:hidden; aspect-ratio:1672/941; border:1px solid rgba(230,196,119,.22); border-radius:1.75rem; box-shadow:0 32px 85px rgba(0,0,0,.46),0 0 48px rgba(216,172,89,.07); }
.vision-image-frame img { width:100%; height:100%; object-fit:cover; transition:transform 900ms cubic-bezier(.2,.7,.2,1); }
.vision-image-frame:hover img { transform:scale(1.018); }
.vision-image-shade { position:absolute; inset:0; background:linear-gradient(180deg,transparent 48%,rgba(2,12,29,.78) 100%); box-shadow:inset 0 0 55px rgba(2,10,24,.14); pointer-events:none; }
.vision-image-frame figcaption { position:absolute; left:1.5rem; bottom:1.4rem; display:flex; flex-direction:column; gap:.3rem; border-left:2px solid #d8ac59; padding-left:1rem; text-shadow:0 3px 18px rgba(0,0,0,.8); }
.vision-image-frame figcaption span { color:#e6c477; font-size:.65rem; font-weight:800; letter-spacing:.24em; text-transform:uppercase; }
.vision-image-frame figcaption strong { color:#f8f6f1; font-family:'Playfair Display',serif; font-size:clamp(1.15rem,2vw,1.75rem); }
.vision-panel { position:relative; overflow:hidden; border-color:rgba(216,172,89,.22); border-radius:1.75rem; background:linear-gradient(145deg,rgba(5,24,51,.97),rgba(2,14,33,.98)); padding:1.75rem; box-shadow:0 28px 70px rgba(0,0,0,.36),inset 0 1px rgba(255,255,255,.05); }
.vision-quote { position:absolute; right:1rem; top:-1.5rem; color:rgba(216,172,89,.09); font-family:'Playfair Display',serif; font-size:10rem; line-height:1; }
.outcome-item { display:flex; align-items:center; gap:.75rem; color:#cbd2dc; font-size:.9rem; }
.outcome-dot { width:.42rem; height:.42rem; flex:0 0 auto; border-radius:999px; background:#d8ac59; box-shadow:0 0 0 5px rgba(216,172,89,.1); }
.mission-card { position:relative; min-height:20rem; overflow:hidden; border-radius:1.6rem; padding:1.75rem; transition:transform 250ms ease,border-color 250ms ease,background 250ms ease; }
.mission-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; }
.mission-icon { display:grid; width:6.5rem; height:6.5rem; place-items:center; border:1px solid rgba(216,172,89,.2); border-radius:1.5rem; background:linear-gradient(145deg,rgba(216,172,89,.1),rgba(216,172,89,.025)); color:#e6c477; box-shadow:inset 0 1px rgba(255,255,255,.04),0 14px 35px rgba(0,0,0,.2); transform:rotate(2deg); transition:transform 300ms ease,border-color 300ms ease,background 300ms ease; }
.mission-icon svg { width:4.2rem; height:4.2rem; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; filter:drop-shadow(0 0 12px rgba(216,172,89,.22)); }
.mission-card:nth-child(2) .mission-icon { transform:rotate(-2deg); }
.mission-card:hover .mission-icon { transform:rotate(0) scale(1.05); border-color:rgba(230,196,119,.45); background:rgba(216,172,89,.12); }
.mission-card::after { content:''; position:absolute; right:-4rem; bottom:-4rem; width:9rem; height:9rem; border:1px solid rgba(216,172,89,.18); border-radius:999px; }
.mission-card:hover { transform:translateY(-5px); border-color:rgba(216,172,89,.35); background:rgba(216,172,89,.055); }
.why-card { min-width:0; border-color:rgba(255,255,255,.13); border-radius:1rem; background:rgba(3,15,34,.78); padding:1.15rem; backdrop-filter:blur(14px); }
.why-card h3 { margin-top:.7rem; color:#f8f6f1; font-size:1rem; font-weight:700; line-height:1.35; }
.why-card p { margin-top:.55rem; color:#cbd2dc; font-size:.76rem; line-height:1.65; }
.about-why-visual { position:relative; margin-top:2.25rem; }
.about-why-visual::before { content:''; position:absolute; inset:-.65rem 2.5rem .65rem -.65rem; border:1px solid rgba(216,172,89,.28); border-radius:2rem; }
.about-why-frame { position:relative; overflow:hidden; aspect-ratio:1672/941; border:1px solid rgba(230,196,119,.2); border-radius:1.75rem; box-shadow:0 35px 90px rgba(0,0,0,.5),0 0 50px rgba(216,172,89,.08); }
.about-why-frame img { width:100%; height:100%; object-fit:cover; transition:transform 900ms cubic-bezier(.2,.7,.2,1); }
.about-why-visual:hover img { transform:scale(1.018); }
.about-why-overlay { position:absolute; inset:0; background:linear-gradient(180deg,rgba(2,14,33,.06) 25%,rgba(2,14,33,.24) 52%,rgba(2,10,24,.92) 100%); box-shadow:inset 0 0 55px rgba(2,10,24,.16); pointer-events:none; }
.about-why-caption { position:absolute; left:1.5rem; top:1.5rem; display:flex; flex-direction:column; gap:.25rem; border-left:2px solid #d8ac59; padding-left:1rem; text-shadow:0 3px 18px rgba(0,0,0,.75); }
.about-why-caption span { color:#e6c477; font-size:.65rem; font-weight:800; letter-spacing:.28em; text-transform:uppercase; }
.about-why-caption strong { color:#f8f6f1; font-family:'Playfair Display',serif; font-size:clamp(1.2rem,2.5vw,2rem); }
.about-why-grid { position:absolute; z-index:2; right:1rem; bottom:1rem; left:1rem; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.7rem; }
.awec-section { position:relative; background:radial-gradient(circle at 85% 8%,rgba(216,172,89,.1),transparent 30rem),linear-gradient(180deg,rgba(5,24,51,.86),#020e21); }
.awec-image-wrap { position:relative; overflow:hidden; aspect-ratio:16/9; border:1px solid rgba(230,196,119,.25); border-radius:2rem; box-shadow:0 38px 100px rgba(0,0,0,.52),0 0 55px rgba(216,172,89,.08); }
.awec-image-wrap::before { content:''; position:absolute; z-index:2; inset:.8rem; border:1px solid rgba(230,196,119,.24); border-radius:1.35rem; pointer-events:none; }
.awec-image-wrap img { width:100%; height:100%; object-fit:cover; transition:transform 900ms cubic-bezier(.2,.7,.2,1); }
.awec-image-wrap:hover img { transform:scale(1.015); }
.awec-image-shade { position:absolute; inset:0; background:linear-gradient(180deg,transparent 45%,rgba(2,12,29,.82) 100%); pointer-events:none; }
.awec-image-wrap figcaption { position:absolute; z-index:3; right:2rem; bottom:1.8rem; left:2rem; display:flex; align-items:end; justify-content:space-between; gap:1rem; text-shadow:0 4px 20px rgba(0,0,0,.9); }
.awec-image-wrap figcaption span { color:#e6c477; font-size:.72rem; font-weight:800; letter-spacing:.35em; }
.awec-image-wrap figcaption strong { max-width:34rem; color:#f8f6f1; font-family:'Playfair Display',serif; font-size:clamp(1.15rem,2.5vw,2rem); text-align:right; }
.awec-content { display:grid; gap:2.5rem; margin-top:3.5rem; }
.awec-heading h2 { margin-top:1rem; max-width:34rem; color:#f8f6f1; font-family:'Playfair Display','Times New Roman',serif; font-size:clamp(2.35rem,5vw,4.7rem); font-weight:700; line-height:.98; letter-spacing:-.045em; text-wrap:balance; }
.awec-heading::after { content:''; display:block; width:5rem; height:1px; margin-top:2rem; background:linear-gradient(90deg,#d8ac59,transparent); }
.awec-story { max-width:49rem; }
.awec-story p { color:#cbd2dc; font-size:1rem; line-height:1.9; }
.awec-story p + p { margin-top:1.3rem; }
.awec-story p:first-child { color:#f8f6f1; font-size:1.18rem; font-weight:600; line-height:1.75; }
.awec-link { display:inline-flex; align-items:center; gap:.8rem; margin-top:2rem; border:1px solid rgba(216,172,89,.38); border-radius:999px; background:rgba(216,172,89,.08); padding:.85rem 1.15rem; color:#e6c477; font-size:.8rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; transition:background 200ms ease,border-color 200ms ease,transform 200ms ease; }
.awec-link:hover { transform:translateY(-2px); border-color:rgba(230,196,119,.7); background:rgba(216,172,89,.14); }
.awec-link svg { width:1.15rem; height:1.15rem; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
.iwapi-section { position:relative; background:radial-gradient(circle at 10% 18%,rgba(45,95,177,.17),transparent 32rem),linear-gradient(180deg,#020e21,#061a35 55%,#020e21); }
.iwapi-main-photo { position:relative; overflow:hidden; aspect-ratio:16/9; border:1px solid rgba(122,160,224,.25); border-radius:2rem; box-shadow:0 38px 100px rgba(0,0,0,.5),0 0 60px rgba(54,104,190,.09); }
.iwapi-main-photo img { width:100%; height:100%; object-fit:cover; transition:transform 900ms cubic-bezier(.2,.7,.2,1); }
.iwapi-main-photo:hover img { transform:scale(1.012); }
.iwapi-main-photo > div { position:absolute; inset:0; background:linear-gradient(180deg,transparent 60%,rgba(2,12,29,.74)); pointer-events:none; }
.iwapi-main-photo figcaption { position:absolute; right:1.6rem; bottom:1.5rem; display:flex; align-items:baseline; gap:.7rem; border-left:2px solid #d8ac59; padding-left:1rem; color:#f8f6f1; text-shadow:0 3px 16px rgba(0,0,0,.8); }
.iwapi-main-photo figcaption span { color:#e6c477; font-size:.65rem; font-weight:800; letter-spacing:.25em; text-transform:uppercase; }
.iwapi-main-photo figcaption strong { font-family:'Playfair Display',serif; font-size:2rem; }
.iwapi-profile { display:grid; gap:2rem; margin-top:3.5rem; align-items:start; }
.iwapi-profile h2 { margin-top:1rem; max-width:38rem; color:#f8f6f1; font-family:'Playfair Display','Times New Roman',serif; font-size:clamp(2.35rem,5vw,4.6rem); font-weight:700; line-height:.98; letter-spacing:-.045em; text-wrap:balance; }
.iwapi-profile > p { max-width:46rem; border-left:1px solid rgba(216,172,89,.4); padding-left:1.5rem; color:#cbd2dc; font-size:1.08rem; line-height:1.9; }
.iwapi-profile > p :deep(strong) { color:#f8f6f1; font-weight:700; }
.iwapi-events-heading { display:flex; align-items:end; justify-content:space-between; gap:2rem; margin-top:6rem; border-bottom:1px solid rgba(255,255,255,.11); padding-bottom:1.4rem; }
.iwapi-events-heading h3 { margin-top:.65rem; color:#f8f6f1; font-family:'Playfair Display',serif; font-size:clamp(1.8rem,3vw,2.8rem); }
.iwapi-events-heading > span { max-width:28rem; color:#9eacbf; font-size:.72rem; font-weight:700; letter-spacing:.13em; line-height:1.7; text-align:right; text-transform:uppercase; }
.iwapi-events-photo { overflow:hidden; margin-top:1.5rem; aspect-ratio:16/9; border:1px solid rgba(216,172,89,.22); border-radius:1.6rem; background:#031127; box-shadow:0 28px 70px rgba(0,0,0,.4); }
.iwapi-events-photo img { width:100%; height:100%; object-fit:cover; transition:transform 800ms ease; }
.iwapi-events-photo:hover img { transform:scale(1.01); }
@media (min-width:640px) { .vision-panel { padding:2.25rem; } }
@media (min-width:1024px) {
  .about-hero-composition { grid-template-columns:minmax(0,5.2fr) minmax(0,6.8fr); gap:0; min-height:42rem; }
  .about-hero-copy { z-index:3; padding:3rem 0 2.5rem; }
  .about-hero-copy::after { content:''; position:absolute; z-index:-1; top:-5rem; right:-15rem; bottom:-5rem; left:-6rem; background:linear-gradient(90deg,#031127 0%,rgba(3,17,39,.97) 48%,rgba(3,17,39,.76) 70%,transparent 100%); pointer-events:none; }
  .about-hero-title { width:calc(100% + 12rem); max-width:55rem; }
  .about-hero-intro { max-width:40rem; font-size:1rem; line-height:1.75; }
  .image-stage { z-index:1; width:calc(100% + 7rem); margin-left:-7rem; padding:.5rem .5rem 2.75rem; }
  .image-stage::before { inset:-1.2rem 2.5rem .8rem 3.5rem; border-radius:2.5rem; }
  .image-frame { aspect-ratio:auto; height:42rem; border-radius:2.4rem; }
  .image-frame img { object-position:center; }
  .image-caption { right:1.25rem; bottom:.25rem; min-width:24rem; padding:1.1rem 1.25rem; }
  .image-caption strong { font-size:1rem; }
  .image-caption small { margin-top:.35rem; color:#e6c477; font-size:.72rem; letter-spacing:.14em; }
  .vision-composition { grid-template-columns:minmax(0,1.55fr) minmax(20rem,.65fr); align-items:stretch; }
  .vision-image-frame { aspect-ratio:auto; min-height:36rem; }
  .vision-panel { display:flex; flex-direction:column; justify-content:center; }
  .awec-content { grid-template-columns:minmax(18rem,.72fr) minmax(0,1.28fr); gap:5rem; align-items:start; }
  .iwapi-profile { grid-template-columns:minmax(20rem,.85fr) minmax(0,1.15fr); gap:5rem; }
}
@media (max-width:1023px) { .about-why-frame { aspect-ratio:auto; overflow:visible; background:#04152d; } .about-why-frame img { display:block; aspect-ratio:1672/941; border-radius:1.7rem 1.7rem 0 0; } .about-why-overlay { bottom:auto; height:min(56vw,32rem); border-radius:1.7rem 1.7rem 0 0; background:linear-gradient(180deg,rgba(2,14,33,.05),rgba(2,14,33,.48)); } .about-why-grid { position:relative; right:auto; bottom:auto; left:auto; grid-template-columns:repeat(2,minmax(0,1fr)); padding:1rem; background:linear-gradient(180deg,rgba(3,17,39,.98),#031127); } }
@media (max-width:639px) { .image-stage { padding:.4rem .4rem 2rem; } .image-stage::before { inset:0 1.5rem .75rem 0; border-radius:1.5rem; } .image-frame { border-radius:1.25rem; } .image-caption { min-width:auto; max-width:calc(100% - 1.25rem); } .about-why-visual::before { inset:-.4rem 1.25rem .5rem -.4rem; border-radius:1.4rem; } .about-why-frame,.about-why-frame img { border-radius:1.2rem 1.2rem 0 0; } .about-why-caption { left:1rem; top:1rem; } .about-why-grid { grid-template-columns:1fr; border-radius:0 0 1.2rem 1.2rem; } .awec-image-wrap { aspect-ratio:4/3; border-radius:1.25rem; } .awec-image-wrap::before { inset:.45rem; border-radius:.9rem; } .awec-image-wrap figcaption { right:1rem; bottom:1rem; left:1rem; align-items:start; flex-direction:column; } .awec-image-wrap figcaption strong { text-align:left; } .awec-content { margin-top:2.5rem; } .iwapi-main-photo { aspect-ratio:4/3; border-radius:1.25rem; } .iwapi-profile { margin-top:2.5rem; } .iwapi-events-heading { align-items:start; flex-direction:column; margin-top:4rem; } .iwapi-events-heading > span { text-align:left; } .iwapi-events-photo { aspect-ratio:4/3; border-radius:1.15rem; } }
@media (prefers-reduced-motion:reduce) { .image-frame img,.vision-image-frame img,.about-why-frame img,.mission-card { transition:none; } }
</style>
