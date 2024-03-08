export const ThemeColorTypes = {
    BRAND_ACCENT: 'brand-accent' as const,
    BRAND_LIGHT: 'brand-light' as const,
    BRAND_LIGHTER: 'brand-lighter' as const,
    BRAND_LIGHTEST: 'brand-lightest' as const,
    BRAND_PRIMARY: 'brand-primary' as const,
    FIXED_WHITE: 'fixed-white' as const,
    SOLID_BRAND_LIGHTEST: 'solid-brand-lightest' as const,
};

export type ThemeColor = (typeof ThemeColorTypes)[keyof typeof ThemeColorTypes];
