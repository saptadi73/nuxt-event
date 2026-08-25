export interface CountryOption {
  name: string;
  iso: string;
  dialCode: string;
}

export const priorityCountryNames = ['Indonesia', 'China', 'Malaysia'] as const;

const allCountries: CountryOption[] = [
  { name: 'Australia', iso: 'AU', dialCode: '+61' },
  { name: 'Bangladesh', iso: 'BD', dialCode: '+880' },
  { name: 'Belgium', iso: 'BE', dialCode: '+32' },
  { name: 'Brazil', iso: 'BR', dialCode: '+55' },
  { name: 'Brunei Darussalam', iso: 'BN', dialCode: '+673' },
  { name: 'Cambodia', iso: 'KH', dialCode: '+855' },
  { name: 'Canada', iso: 'CA', dialCode: '+1' },
  { name: 'China', iso: 'CN', dialCode: '+86' },
  { name: 'Egypt', iso: 'EG', dialCode: '+20' },
  { name: 'Ethiopia', iso: 'ET', dialCode: '+251' },
  { name: 'France', iso: 'FR', dialCode: '+33' },
  { name: 'Germany', iso: 'DE', dialCode: '+49' },
  { name: 'Hong Kong SAR', iso: 'HK', dialCode: '+852' },
  { name: 'India', iso: 'IN', dialCode: '+91' },
  { name: 'Indonesia', iso: 'ID', dialCode: '+62' },
  { name: 'Iran', iso: 'IR', dialCode: '+98' },
  { name: 'Italy', iso: 'IT', dialCode: '+39' },
  { name: 'Japan', iso: 'JP', dialCode: '+81' },
  { name: 'Kenya', iso: 'KE', dialCode: '+254' },
  { name: 'Lao PDR', iso: 'LA', dialCode: '+856' },
  { name: 'Malaysia', iso: 'MY', dialCode: '+60' },
  { name: 'Mexico', iso: 'MX', dialCode: '+52' },
  { name: 'Mongolia', iso: 'MN', dialCode: '+976' },
  { name: 'Myanmar', iso: 'MM', dialCode: '+95' },
  { name: 'Nepal', iso: 'NP', dialCode: '+977' },
  { name: 'Netherlands', iso: 'NL', dialCode: '+31' },
  { name: 'New Zealand', iso: 'NZ', dialCode: '+64' },
  { name: 'Nigeria', iso: 'NG', dialCode: '+234' },
  { name: 'Norway', iso: 'NO', dialCode: '+47' },
  { name: 'Pakistan', iso: 'PK', dialCode: '+92' },
  { name: 'Philippines', iso: 'PH', dialCode: '+63' },
  { name: 'Poland', iso: 'PL', dialCode: '+48' },
  { name: 'Portugal', iso: 'PT', dialCode: '+351' },
  { name: 'Qatar', iso: 'QA', dialCode: '+974' },
  { name: 'Russia', iso: 'RU', dialCode: '+7' },
  { name: 'Rwanda', iso: 'RW', dialCode: '+250' },
  { name: 'Saudi Arabia', iso: 'SA', dialCode: '+966' },
  { name: 'Singapore', iso: 'SG', dialCode: '+65' },
  { name: 'South Africa', iso: 'ZA', dialCode: '+27' },
  { name: 'South Korea', iso: 'KR', dialCode: '+82' },
  { name: 'Spain', iso: 'ES', dialCode: '+34' },
  { name: 'Sri Lanka', iso: 'LK', dialCode: '+94' },
  { name: 'Sweden', iso: 'SE', dialCode: '+46' },
  { name: 'Switzerland', iso: 'CH', dialCode: '+41' },
  { name: 'Taiwan', iso: 'TW', dialCode: '+886' },
  { name: 'Thailand', iso: 'TH', dialCode: '+66' },
  { name: 'Türkiye', iso: 'TR', dialCode: '+90' },
  { name: 'United Arab Emirates', iso: 'AE', dialCode: '+971' },
  { name: 'United Kingdom', iso: 'GB', dialCode: '+44' },
  { name: 'United States', iso: 'US', dialCode: '+1' },
  { name: 'Vietnam', iso: 'VN', dialCode: '+84' },
  { name: 'Zimbabwe', iso: 'ZW', dialCode: '+263' }
];

export const priorityCountries = priorityCountryNames.map(name => allCountries.find(country => country.name === name)!);
export const otherCountries = allCountries.filter(country => !priorityCountryNames.includes(country.name as typeof priorityCountryNames[number]));
export const countryOptions = [...priorityCountries, ...otherCountries];

export const countryFlag = (iso: string) => iso.toUpperCase().replace(/./g, character => String.fromCodePoint(127397 + character.charCodeAt(0)));
