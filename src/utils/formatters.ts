export function formatCurrency(
  val: number | undefined | null,
  currency: 'EUR' | 'USD' | 'GBP' = 'EUR',
  decimals = 0
): string {
  if (val === undefined || val === null || isNaN(val)) return '—';
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const formatted = absVal.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return isNegative ? `-${sym}${formatted}` : `${sym}${formatted}`;
}

export function formatCompactCurrency(
  val: number | undefined | null,
  currency: 'EUR' | 'USD' | 'GBP' = 'EUR'
): string {
  if (val === undefined || val === null || isNaN(val)) return '—';
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  let numStr = '';
  if (absVal >= 1e9) {
    numStr = `${(absVal / 1e9).toFixed(1)}B`;
  } else if (absVal >= 1e6) {
    numStr = `${(absVal / 1e6).toFixed(1)}M`;
  } else if (absVal >= 1e3) {
    numStr = `${(absVal / 1e3).toFixed(0)}k`;
  } else {
    numStr = absVal.toFixed(0);
  }

  return isNegative ? `-${sym}${numStr}` : `${sym}${numStr}`;
}

export function formatPct(
  val: number | undefined | null,
  decimals = 1,
  isAlreadyPercentage = false
): string {
  if (val === undefined || val === null || isNaN(val)) return '—';
  const pct = isAlreadyPercentage ? val : val * 100;
  return `${pct.toFixed(decimals)}%`;
}

export function formatNumber(
  val: number | undefined | null,
  decimals = 0
): string {
  if (val === undefined || val === null || isNaN(val)) return '—';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatMultiple(
  val: number | undefined | null,
  decimals = 2
): string {
  if (val === undefined || val === null || isNaN(val)) return '—';
  return `${val.toFixed(decimals)}x`;
}
