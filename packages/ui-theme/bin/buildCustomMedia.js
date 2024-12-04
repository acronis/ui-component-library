import StyleDictionary from "style-dictionary";

const styleDictionaryConfig = {
    source: ["src/tokens/**/*.+(js|json)"],
    platforms: {
        css: {
            transformGroup: "css",
            buildPath: "src/styles/compiled/",
            files: [
                {
                    destination: `custom-media.css`,
                    format: "custom/format/custom-media",
                    filter: { attributes: { category: "viewport" } },
                },
            ],
        },
    },
};

const StyleDictionaryExtended = StyleDictionary.extend(styleDictionaryConfig);

StyleDictionaryExtended.buildAllPlatforms();
