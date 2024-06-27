import { ICON_GROUPS as AcronisGroups } from '../../vue/acronis/public.ts';
import { ICON_GROUPS as ConstructorGroups } from '../../vue/constructor/public.ts';

export const ICON_TYPES_MAP = {
  acronis: AcronisGroups,
  constructor: ConstructorGroups
};

export type IconType = typeof AcronisGroups[keyof typeof AcronisGroups] | typeof ConstructorGroups[keyof typeof ConstructorGroups];
