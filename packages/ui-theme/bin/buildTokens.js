import StyleDictionary from 'style-dictionary';
import * as fsExtra from "fs-extra";
import styleGuideFormat from "./styleGuide.js";
import copyDist from "./copyDist.js";
import {format, transform} from "./fontFace.js";

fsExtra.emptyDirSync('dist');

StyleDictionary.registerFormat(styleGuideFormat);
StyleDictionary.registerAction(copyDist);
StyleDictionary.registerTransform(transform);
StyleDictionary.registerFormat(format);

const COLOR_SCHEMES = [`light`, `dark`];
const BRANDS = [`acronis`, `constructor`, 'virtuozzo'];

function getStyleDictionaryConfig(brand, scheme) {
    return {
        hooks: {
            filters: {
                'only-colors': (token, options) => {
                    return token.type === 'color';
                },
            },
        },
        include:[
            'tokens/base/**/*.json'
        ],
        source: [
            `tokens/base/**/*.json`,
            `tokens/brands/${brand}/**/!(*.${COLOR_SCHEMES.join(`|*.`)}).json`,
            `tokens/brands/${brand}/**/*.${scheme}.json`,
            'tokens/globals/color/color.green.json',
            // 'tokens/globals/**/*.json'
        ],
        platforms: {
            css: {
                transformGroup: `css`,
                transforms: ["attribute/cti", "time/seconds", "size/rem", "cubicBezier/css", "color/hsl-4"],
                buildPath: `dist/css/${brand}/`,
                prefix: 'acv',
                files: [{
                    destination: `${brand}-${scheme}.css`,
                    format: `css/variables`,
                    options: {
                        outputReferences: true,
                        selector: `:where(:root:not([class^="acv-theme-"]), .acv-theme-${brand}):not(.acv-color-scheme-${scheme === "light" ? "dark" : "light"}),
:where(:root:not([class^="acv-theme-"]), .acv-theme-${brand}).acv-color-scheme-${scheme}`
                    },
                    filter: 'only-colors',
                }]
            },

            scss: {
                transformGroup: 'web',
                buildPath: `dist/scss/${brand}/`,
                prefix: 'acv',
                files: [
                    {
                        destination: `${brand}-${scheme}.scss`,
                        format: 'scss/variables',
                    },
                ],
            },

            js: {
                transformGroup: `web`,
                buildPath: `dist/js/${brand}/`,
                files: [{
                    destination: `tokens.json`,
                    format: `json/flat`
                }]
            },
        },
        log: {
            warnings: 'warn', // 'warn' | 'error' | 'disabled'
            verbosity: 'verbose', // 'default' | 'silent' | 'verbose'
            errors: {
                brokenReferences: 'console', // 'throw' | 'console'
            },
        },
    };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFERENT BRANDS AND PLATFORMS

// Build global tokens
function buildGlobalTokens() {
    const sd = new StyleDictionary({
        hooks: {
            filters: {
                'no-icons': (token, options) => {
                    return token.type !== 'asset';
                },
            },
        },
        source: [
            `tokens/assets/icons.json`,
            `tokens/base/**/*.json`,
            `tokens/brands/**/*.json`,
            `tokens/globals/**/*.json`
        ],
        platforms: {
            css: {
                transformGroup: `css`,
                transforms: ["attribute/cti", "time/seconds", "size/rem", "color/hsl-4"],
                buildPath: `dist/css/`,
                prefix: 'acv',
                files: [{
                    destination: `globals.css`,
                    format: `css/variables`,
                    options: {
                        outputReferences: true
                    },
                    filter: 'no-icons',
                }]
            },
            scss: {
                transformGroup: 'web',
                buildPath: `dist/scss/`,
                files: [
                    {
                        destination: 'globals.scss',
                        format: 'scss/variables',
                    },
                ],
            },
            styleGuide: {
                source: [
                    `tokens/base/**/*.json`,
                    `tokens/globals/test/**/*.json`
                ],
                transforms: ['attribute/cti', 'name/kebab', 'time/seconds', 'color/css'],
                buildPath: 'public/',
                files: [
                    {
                        destination: 'index.html',
                        format: 'styleguide/static',
                        options: {
                            templatesFolder: 'bin/views/',
                            configFile: 'style-guide-config.json'
                        }
                    }
                ],
                // actions: ['copy_dist'],
            }
        },
        log: {
            warnings: 'warn', // 'warn' | 'error' | 'disabled'
            verbosity: 'verbose', // 'default' | 'silent' | 'verbose'
            errors: {
                brokenReferences: 'console', // 'throw' | 'console'
            },
        },
    });

    sd.buildAllPlatforms();
}

buildGlobalTokens();

BRANDS.map(function (brand) {

    COLOR_SCHEMES.map(function (scheme) {
        console.log('\n==============================================');
        console.log(`\nProcessing: [${scheme}] [${brand}]`);

        const sd = new StyleDictionary(getStyleDictionaryConfig(brand, scheme));

        sd.buildAllPlatforms();
    });
});

console.log('\n==============================================');
console.log('\nBuild completed!');
