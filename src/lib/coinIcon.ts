const CDN_BASE = 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color';
const FALLBACK_ICON = `${CDN_BASE}/generic.svg`;

export function getCoinIconUrl(symbol: string): string {
  const base = symbol.replace(/USDT$/i, '').toLowerCase();
  return `${CDN_BASE}/${base}.svg`;
}

export { FALLBACK_ICON };