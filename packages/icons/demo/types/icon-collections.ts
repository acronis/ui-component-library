export const ICON_COLLECTIONS = [
  'acronis',
  'constructor',
  'virtuozzo',
  'acronis-web-icons',
] as const;
export type IconCollection = (typeof ICON_COLLECTIONS)[number];
