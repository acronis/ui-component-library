import { camelCase, startCase } from 'lodash-es';

export function toPascalCase(str: string) {
  return startCase(camelCase(str)).replace(/ /g, '');
}
