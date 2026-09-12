export interface ProfileField {
  key: string;
  label: string;
  value: string;
}

export const profileFieldLabel = (key: string) => key
  .replaceAll('_', ' ')
  .replace(/\b(id|ids|url|hs)\b/g, word => word.toUpperCase())
  .replace(/^./, letter => letter.toUpperCase());

// Preserve every field and every repeated record, including false and zero.
export const flattenProfileFields = (value: unknown, prefix = '', label = ''): ProfileField[] => {
  if (Array.isArray(value)) {
    if (value.every(item => item === null || typeof item !== 'object')) {
      return [{ key: prefix, label, value: value.map(item => String(item ?? '')).join(', ') }];
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
  return [{ key: prefix, label, value: value === null || value === undefined ? '' : String(value) }];
};

export const profileCsv = (fields: ProfileField[]) => {
  const cell = (value: string) => `"${(/^\s*[=+@-]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;
  return '\uFEFF' + [fields.map(field => field.key), fields.map(field => field.value)]
    .map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
};
