const COLUMN_ICON_WIDTH = 64;
const COLUMN_MIN_WIDTH = 128;
const COLUMN_MAX_WIDTH = 1200;
const ROW_HEIGHTS = {
  default: 48,
  medium: 40,
  compact: 32
};
// TODO remove as unusable
const CELL_PADDINGS = {
  default: 48,
  medium: 32,
  compact: 24
};
const CELL_BORDER_WIDTH = 1;
export const APPEND_LOADER_HEIGHT = 96;
export const VIRTUAL_SCROLL_RENDER_TIMEOUT = 100;

const COLUMN_TYPES = {
  INDEX: 'index',
  SELECTION: 'selection',
  ACTIONS: 'action'
};

const BACKGROUND_PRESETS = [
  'transparent-color',
  'solid-brand-lightest',
  'fixed-white'
];

export {
  BACKGROUND_PRESETS,
  CELL_BORDER_WIDTH,
  CELL_PADDINGS,
  COLUMN_ICON_WIDTH,
  COLUMN_MAX_WIDTH,
  COLUMN_MIN_WIDTH,
  COLUMN_TYPES,
  ROW_HEIGHTS
};

export const SAVED_COLUMN_PROPS = ['width', 'hidden'];
