/**
 * Custom media formatter for style dictionary.
 * https://github.com/amzn/style-dictionary/issues/431#issuecomment-673642953
 *
 * This converts our viewport tokens to the very specific `@custom-media`
 * variable definition format.
 * Some of our tokens are named using underscores.
 * Convert to hyphens.
 *
 * @type {Object}
 * @property {string} name - The name of the custom formatter.
 * @property {Function} formatter - The function that formats the dictionary properties.
 */
export const customMediaFormatter = {
    name: 'custom/format/custom-media',

    /**
     * Formatter function to convert dictionary properties to custom media queries.
     *
     * @param {Object} dictionary - The style dictionary object.
     * @returns {string} - The formatted custom media queries.
     */
    formatter(dictionary) {
        return dictionary.allProperties
            .map((prop) => {
                const { attributes, value } = prop;
                const size = attributes.type.replace(/_/g, "-"); // 1
                return `@custom-media --${size}-viewport (${value});`;
            })
            .join("\n");
    },
}
