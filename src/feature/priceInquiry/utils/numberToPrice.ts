export function formatNumberWithComma(num: number | string): string {
  if (num === undefined || num === null) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
