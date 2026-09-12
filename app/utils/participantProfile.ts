export interface ProfileField {
  key: string;
  label: string;
  value: string;
}

export const profileFieldLabel = (key: string) => key
  .replaceAll('_', ' ')
  .replace(/\b(id|ids|url|hs)\b/g, word => word.toUpperCase())
  .replace(/^./, letter => letter.toUpperCase());

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (value: unknown) => typeof value === 'string' && uuidPattern.test(value.trim());
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
});
const jakartaDateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
});
const jakartaTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Jakarta'
});

export const formatProfileValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') return String(value);
  // Calendar dates (arrival/departure) are not instants: preserve their day.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
      ? dateFormatter.format(date) : value;
  }
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/i.test(value)) {
    // Backend timestamps without an explicit offset are interpreted as UTC.
    const normalized = value.replace(' ', 'T');
    const date = new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized) ? normalized : `${normalized}Z`);
    if (!Number.isNaN(date.getTime())) {
      return `${jakartaDateFormatter.format(date)} pukul ${jakartaTimeFormatter.format(date)} WIB`;
    }
  }
  return value;
};

// Hide technical identifiers even when empty; retain business identifiers such as tax_id.
const isIdentifierField = (key: string) => key !== 'tax_id' && (key === 'id' || key.endsWith('_id') || key.endsWith('_ids'));

// The detail view and both exports share these filtered, formatted fields.
export const flattenProfileFields = (value: unknown, prefix = '', label = ''): ProfileField[] => {
  if (isIdentifierField(prefix.split('.').at(-1) || '') || isUuid(value)) return [];
  if (Array.isArray(value)) {
    if (value.every(item => item === null || typeof item !== 'object')) {
      const items = value.filter(item => !isUuid(item));
      if (value.length && !items.length) return [];
      return [{ key: prefix, label, value: items.map(formatProfileValue).join(', ') }];
    }
    return value.flatMap((item, index) => flattenProfileFields(item, `${prefix}.${index + 1}`, `${label} ${index + 1}`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => flattenProfileFields(
      item,
      prefix ? `${prefix}.${key}` : key,
      label ? `${label} / ${profileFieldLabel(key)}` : profileFieldLabel(key)
    ));
  }
  return [{ key: prefix, label, value: formatProfileValue(value) }];
};

export const profileCsv = (fields: ProfileField[]) => {
  const cell = (value: string) => `"${(/^\s*[=+@-]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;
  return '\uFEFF' + [fields.map(field => field.key), fields.map(field => field.value)]
    .map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
};
