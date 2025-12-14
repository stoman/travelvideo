import { helper } from '@ember/component/helper';

export function formatDate([dateString]) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export default helper(formatDate);
