import { camelCase, startCase } from 'lodash-es';

export function toPascalCase(str: string) {
  return startCase(camelCase(str)).replace(/ /g, '');
}

export function toTitleCase(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .map(s => s.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()))
    .join(' ');
}
