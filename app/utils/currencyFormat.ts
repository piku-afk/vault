export function formatCurrency(value: string | number | bigint): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
  });

  return formatter.format(Number(value));
}
