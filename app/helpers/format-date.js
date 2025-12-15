import { helper } from '@ember/component/helper';

export function formatDate([dateOrString]) {
  if (!dateOrString) {
    return '';
  }

  const date = new Date(dateOrString);

  if (isNaN(date.getTime())) {
    return '';
  }

  // Dates in fixtures are YYYY-MM-DD, which new Date() parses as UTC.
  // Use UTC methods to avoid timezone-related errors.
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
}

export default helper(formatDate);
