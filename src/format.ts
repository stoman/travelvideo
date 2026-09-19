/** Renders an ISO `YYYY-MM-DD` date (the storage format, see data-model.md) as `DD.MM.YYYY`. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}
