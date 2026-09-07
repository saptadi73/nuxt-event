/** Only navigate to the HTTPS checkout URL issued by DOKU. */
export function validateDokuCheckoutUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password ||
      (url.hostname !== 'doku.com' && !url.hostname.endsWith('.doku.com'))) {
    throw new Error('Invalid DOKU checkout URL. Please check your payment status and try again.');
  }
  return url.href;
}
