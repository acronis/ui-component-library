import { camelCase, startCase } from 'lodash-es';

export function toPascalCase(str) {
  return startCase(camelCase(str)).replace(/ /g, '');
}
