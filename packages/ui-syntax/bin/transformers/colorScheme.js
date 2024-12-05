/**
 * Transformer for color scheme tokens.
 * This transformer converts color-theme tokens to a light-dark format.
 *
 * Example tokens.yml:
 * ```
 * global-background:
 *  type: color-theme
 *  value:
 *  light: "#fff"
 *  dark: "#000"
 *  ```
 *  This will be transformed to:
 *  ```
 *  global-background: light-dark(#fff, #000)
 *  ```
 */
export const colorSchemeTransform = {
    type: `value`,
    name: `color-theme`,
    /**
     * Filter function to identify color-theme tokens.
     * @param {Object} token - The token to be filtered.
     * @returns {boolean} - Returns true if the token is of type 'color-theme'.
     */
    filter: function (token) {
        return token.type === 'color-theme';
    },
    /**
     * Transform function to convert color-theme tokens to light-dark format.
     * @param {Object} token - The token to be transformed.
     * @returns {string} - The transformed token in light-dark format.
     */
    transform: (token) => {
        return `light-dark(${token.value.light}, ${token.value.dark})`;
    },
};
