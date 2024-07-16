import { camelCase, startCase } from 'lodash-es';

export function toPascalCase(str: string) {
  return startCase(camelCase(str)).replace(/ /g, '');
}

export function toTitleCase(str: string) {
  return str
    // Split the string into words considering spaces, underscores, and camelCase as boundaries
    .split(' ')
    // Convert each word to title case
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    // Join the words with a space
    .join(' ');
}

export function customAcvTitleCase(str: string) {
  // Check if the string starts with 'ACV' (case-insensitive)
  const match = str.match(/^(ACV)/i);
  let prefix = '';
  let rest = str;

  if (match) {
    prefix = 'ACV'; // Always use 'ACV' in uppercase
    rest = str.slice(match[0].length);
  }

  // Insert a space before each capital letter, except the first one
  const formatted = rest.replace(/([A-Z])/g, ' $1').trim();

  // Split into words, removing any extra spaces
  const words = formatted.split(/\s+/);

  // Capitalize the first letter of each word and lowercase the rest
  const result = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Combine the prefix (if any) and the formatted part
  return (prefix ? `${prefix} ` : '') + result;
}
