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
      { date: '14 October 2026', location: 'Arrival · Jakarta', activities: ['Airport transfer from Soekarno-Hatta International Airport', 'Overnight stay at hotel in Jakarta'] },
      { date: '15 October 2026', location: 'Jakarta', activities: ['Visit to TEI – Trade Expo Indonesia', 'Exhibition and talk show', 'Lunch', 'Dinner at Dreamville PIK 2', 'Overnight stay at hotel in Jakarta'] },
      { date: '16 October 2026', location: 'Jakarta', activities: ['Opening event, Business Matching and Conference', 'Buffet lunch and two coffee breaks at the hotel', 'Welcome Dinner hosted by the Governor of DKI Jakarta', 'Overnight stay at hotel in Jakarta'] },
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
