import StyleDictionary from 'style-dictionary';
import copyDist from "./copyDist.js";
import {format, transform} from "./fontFace.js";

StyleDictionary.registerAction(copyDist);
StyleDictionary.registerTransform(transform);
StyleDictionary.registerFormat(format);

console.log('Build fonts started...');

async function buildFonts() {
    const sd = new StyleDictionary({
        source: ["tokens/assets/font.json"],
        platforms: {
            "font-face": {
                transforms: ["attribute/font"],
                buildPath: "dist/",
                files: [
                    {
                        destination: "css/fonts.css",
                        format: "font-face",
                        filter: {
                            attributes: {
                                category: "asset",
                                type: "font",
                            },
                        },
                        options: {
                            fontPathPrefix: "../assets/fonts/",
                        },
                    },
                ],
            },
            assets: {
                transformGroup: ["assets"],
                buildPath: "dist/",
                files: [],
                actions: ["copy_assets"],
            }
        },
        // log: {
        //     warnings: 'warn', // 'warn' | 'error' | 'disabled'
        //     verbosity: 'verbose', // 'default' | 'silent' | 'verbose'
        //     errors: {
        //         brokenReferences: 'console', // 'throw' | 'console'
        //     },
        // }
    })

    await sd.buildAllPlatforms();
}

await buildFonts()


console.log('\n==============================================');
console.log('\nBuild fonts completed!');
