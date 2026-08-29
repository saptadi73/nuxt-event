export interface PackageScheduleDay {
  date: string;
  location: string;
  activities: string[];
}

export interface PackageScheduleDetail {
  key: 'main' | 'additional';
  eyebrow: string;
  title: string;
  subtitle: string;
  days: PackageScheduleDay[];
  highlights?: string[];
  notes?: string[];
}

export const delegatePackageSchedules: Record<'main' | 'additional', PackageScheduleDetail> = {
  main: {
    key: 'main',
    eyebrow: 'Main Package · Jakarta',
    title: 'Delegate Package Jakarta',
    subtitle: 'IWBIF 2026 · Jakarta, Indonesia · 14–17 October 2026',
    days: [
      { date: '14 October 2026', location: 'Arrival · Jakarta', activities: ['Airport transfer from Soekarno-Hatta International Airport to the hotel', 'Overnight stay at hotel in Jakarta'] },
      { date: '15 October 2026', location: 'Jakarta', activities: ['Visit to TEI – Trade Expo Indonesia', 'Exhibition and talk show', 'Lunch', 'Dinner at Dreamville PIK 2', 'Overnight stay at hotel in Jakarta'] },
      { date: '16 October 2026', location: 'Jakarta', activities: ['Opening event, Business Matching and Conference', 'Buffet lunch and two coffee breaks at the hotel', 'Welcome Dinner hosted by the Governor of DKI Jakarta (subject to confirmation)', 'Overnight stay at hotel in Jakarta'] },
      { date: '17 October 2026', location: 'Jakarta · Departure', activities: ['Breakfast at hotel', 'Hotel check-out', 'Jakarta trip to Jababeka', 'Airport transfer to Soekarno-Hatta International Airport'] }
    ],
    highlights: ['Business Matching Sessions', 'Conference and Networking Forum', 'Governor Dinner Reception', 'Trade Expo Visit'],
    notes: ['Flight tickets are not included.', 'Passport must be valid for at least six months.', 'The program is subject to minor adjustments.', 'Hotel check-in and check-out follow hotel policy.']
  },
  additional: {
    key: 'additional',
    eyebrow: 'Additional Package · Bandung',
    title: 'Additional Trip to Bandung',
    subtitle: 'IWBIF 2026 · Jakarta–Bandung, Indonesia · 17–19 October 2026',
    days: [
      { date: '17 October 2026', location: 'Jakarta → Bandung', activities: ['Check out from the Jakarta hotel', 'Visit Jababeka Industry', 'Transfer to Bandung by bus', 'Dinner at Atmosphere Restaurant', 'Overnight stay at hotel in Bandung'] },
      { date: '18 October 2026', location: 'Bandung', activities: ['Breakfast at hotel', 'Lunch at Aroem or Kapulaga Restaurant', 'Cultural visit to Saung Angklung Udjo', 'City tour: Gedung Sate and Gedung Merdeka', 'Lunch at Braga Permai Restaurant', 'Shopping visit', 'Return to hotel'] },
      { date: '19 October 2026', location: 'Bandung → Jakarta', activities: ['Breakfast at hotel', 'Hotel check-out', 'Transfer back to Jakarta', 'Transfer to Soekarno-Hatta International Airport'] }
    ],
    notes: ['The itinerary follows the organizer’s current program and may be adjusted when operational details are finalized.']
  }
};

export const delegatePackageSchedulesZh: Record<'main' | 'additional', PackageScheduleDetail> = {
  main: {
    key: 'main',
    eyebrow: '主套餐 · 雅加达',
    title: '雅加达代表套餐',
    subtitle: 'IWBIF 2026 · 印度尼西亚雅加达 · 2026年10月14日至17日',
    days: [
      { date: '2026年10月14日', location: '抵达 · 雅加达', activities: ['从苏加诺－哈达国际机场接送至酒店', '入住雅加达酒店'] },
      { date: '2026年10月15日', location: '雅加达', activities: ['参观 TEI 印度尼西亚贸易博览会', '展览与访谈节目', '午餐', '在 Dreamville PIK 2 享用晚餐', '入住雅加达酒店'] },
      { date: '2026年10月16日', location: '雅加达', activities: ['开幕活动、商务配对与会议', '酒店自助午餐及两次茶歇', '由雅加达首都特区省长举办的欢迎晚宴（待确认）', '入住雅加达酒店'] },
      { date: '2026年10月17日', location: '雅加达 · 离境', activities: ['酒店早餐', '酒店退房', '前往 Jababeka 参访', '送往苏加诺－哈达国际机场'] }
    ],
    highlights: ['商务配对会议', '会议与交流论坛', '省长晚宴招待会', '贸易博览会参访'],
    notes: ['套餐不包含机票。', '护照有效期必须至少为六个月。', '活动安排可能会有小幅调整。', '酒店入住与退房时间遵循酒店政策。']
  },
  additional: {
    key: 'additional',
    eyebrow: '附加套餐 · 万隆',
    title: '万隆附加行程',
    subtitle: 'IWBIF 2026 · 印度尼西亚雅加达—万隆 · 2026年10月17日至19日',
    days: [
      { date: '2026年10月17日', location: '雅加达 → 万隆', activities: ['从雅加达酒店退房', '参观 Jababeka 工业园', '乘坐巴士前往万隆', '在 Atmosphere Restaurant 享用晚餐', '入住万隆酒店'] },
      { date: '2026年10月18日', location: '万隆', activities: ['酒店早餐', '在 Aroem 或 Kapulaga Restaurant 享用午餐', '参观 Saung Angklung Udjo 文化中心', '城市游览：Gedung Sate 与 Gedung Merdeka', '在 Braga Permai Restaurant 享用午餐', '购物参访', '返回酒店'] },
      { date: '2026年10月19日', location: '万隆 → 雅加达', activities: ['酒店早餐', '酒店退房', '返回雅加达', '送往苏加诺－哈达国际机场'] }
    ],
    notes: ['行程以主办方当前计划为准，并可能在运营细节最终确定后进行调整。']
  }
};
