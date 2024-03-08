import { darken, lighten, mix, rgba } from './color-utils';

const brandPrimaryKey = '--av-brand-primary';
// const brandSecondaryKey = '--av-brand-secondary';
// const fixedInfoKey = '--av-fixed-info';
const fixedPrimaryKey = '--av-fixed-primary';
// const fixedSecondaryKey = '--av-fixed-secondary';
const fixedWhiteKey = '--av-inversed-primary';
const navPrimaryKey = '--av-nav-primary';
const navSecondaryKey = '--av-nav-secondary';
// const solidBrandAccentKey = '--av-solid-brand-accent';


/**
 * Prepares additional theme color variables that aren't provide by Syntax UI
 *
 * @param {string} themeName Theme name
 * @param {Object<string,string>} SyntaxUIThemeColors Syntax UI Theme color variables
 * @param {Object<string,string>} overrides Overrides of Syntax UI Theme color variables or fallback of removed variables
 * @return {Object<string,string>}
 */
export default function prepareThemeColors(themeName, SyntaxUIThemeColors, overrides = {}) {
  const white = SyntaxUIThemeColors[fixedWhiteKey];

  return Object.assign({}, SyntaxUIThemeColors, {
    // Brand-primary
    '--av-brand-lighter': rgba(SyntaxUIThemeColors[brandPrimaryKey], 0.15), // removed, fallback

    // Nav
    '--av-nav-primary-hover': lighten(SyntaxUIThemeColors[navPrimaryKey], 7),
    '--av-nav-primary-active': lighten(SyntaxUIThemeColors[navPrimaryKey], 3),

    // Solid colors: Brand-primary
    '--av-solid-brand-light': mix(SyntaxUIThemeColors[brandPrimaryKey], white, 0.3), // removed, fallback
    '--av-solid-brand-lighter': mix(SyntaxUIThemeColors[brandPrimaryKey], white, 0.15), // removed, fallback

    // Solid colors: Status
    // @fixme: `mix` function produces results different from the SASS function
    //         also, `--av-fixed-info` color has the same value across all themes
    // '--av-solid-fixed-info-accent': mix(SyntaxUIThemeColors[fixedInfoKey], white, 0.05), // removed, fallback
    '--av-solid-fixed-info-accent': '#f5f9fe', // removed, fallback

    // Components: Common
    '--el-primary': SyntaxUIThemeColors[brandPrimaryKey],
    '--el-primary-hover': darken(SyntaxUIThemeColors[brandPrimaryKey], 7),
    '--el-primary-active': darken(SyntaxUIThemeColors[brandPrimaryKey], 12),
    '--el-secondary-hover': rgba(SyntaxUIThemeColors[brandPrimaryKey], 0.1),
    '--el-secondary-active': rgba(SyntaxUIThemeColors[brandPrimaryKey], 0.2),

    // Components: Alert, Notification
    '--el-status-progress-hover': 'var(--el-secondary-hover)',
    '--el-status-progress-active': 'var(--el-secondary-active)',
    '--el-status-hover': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.05),
    '--el-status-active': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.1),

    // Components: Nav Menu
    '--el-nav-primary-hover': rgba(SyntaxUIThemeColors[fixedWhiteKey], 0.2),
    '--el-nav-primary-active': SyntaxUIThemeColors[navSecondaryKey]
  },
    // Theme specific variable definitions
    ['light-gray', 'telstra', 'yellow-1c', 'dark'].includes(themeName) ? {
      // Components: Translucent buttons (removed) and Scrollbars
      '--el-translucent': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.2),
      '--el-translucent-hover': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.4),
      '--el-translucent-active': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.3),
      '--el-translucent-inverse': rgba(SyntaxUIThemeColors[fixedWhiteKey], 0.2),
      '--el-translucent-inverse-hover': rgba(SyntaxUIThemeColors[fixedWhiteKey], 0.4),
      '--el-translucent-inverse-active': rgba(SyntaxUIThemeColors[fixedWhiteKey], 0.3),
      '--el-translucent-text': SyntaxUIThemeColors[fixedPrimaryKey],
      // Components: Scrollbars
      '--el-scrollbar-thumb': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.2),
      '--el-scrollbar-thumb-inverse': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.2)
    } : {
      // Components: Translucent buttons (removed)
      '--el-translucent': rgba(SyntaxUIThemeColors[fixedWhiteKey], 0.2),
      '--el-translucent-hover': rgba(SyntaxUIThemeColors[fixedWhiteKey], 0.4),
      '--el-translucent-active': rgba(SyntaxUIThemeColors[fixedWhiteKey], 0.3),
      '--el-translucent-inverse': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.2),
      '--el-translucent-inverse-hover': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.4),
      '--el-translucent-inverse-active': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.3),
      '--el-translucent-text': SyntaxUIThemeColors[fixedWhiteKey],
      // Components: Scrollbars
      '--el-scrollbar-thumb': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.2),
      '--el-scrollbar-thumb-inverse': rgba(SyntaxUIThemeColors[fixedPrimaryKey], 0.2)
    },
    ['light-gray', 'telstra'].includes(themeName) ? {
      // Components: Tag
      '--el-tag-adaptive-bg': SyntaxUIThemeColors['--av-fixed-invisible'],
      '--el-tag-adaptive-border-clr': SyntaxUIThemeColors['--av-fixed-lighter'],
      '--el-tag-adaptive-fg': SyntaxUIThemeColors['--av-fixed-light']
    } : {
      // Components: Tag
      '--el-tag-adaptive-bg': SyntaxUIThemeColors[fixedWhiteKey],
      '--el-tag-adaptive-border-clr': SyntaxUIThemeColors[fixedWhiteKey],
      '--el-tag-adaptive-fg': SyntaxUIThemeColors[fixedPrimaryKey]
    },
    ['dark'].includes(themeName) ? {
      '--el-shadow-modal': 'var(--shadow-modal-dark)',
      '--el-shadow-regular': 'var(--shadow-regular-dark)',
      '--el-shadow-vertical': 'var(--shadow-vertical-dark)',
      '--el-toggle-solid': SyntaxUIThemeColors['--av-fixed-white']
    } : {
      '--el-shadow-modal': 'var(--shadow-modal)',
      '--el-shadow-regular': 'var(--shadow-regular)',
      '--el-shadow-vertical': 'var(--shadow-vertical)',
      '--el-toggle-solid': SyntaxUIThemeColors['--av-solid-brand-accent']
    },
    overrides);
}
