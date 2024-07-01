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
