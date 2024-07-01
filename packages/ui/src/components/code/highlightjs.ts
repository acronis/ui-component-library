import 'highlight.js/styles/stackoverflow-light.css';
import type { LanguageFn } from 'highlight.js';
import hljsCore from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

export const hljs = hljsCore;

const languagesMap = {
  javascript: {
    load: () => import('highlight.js/lib/languages/javascript'),
    extensions: ['js', 'jsx'],
  },
  typescript: {
    load: () => import('highlight.js/lib/languages/typescript'),
    extensions: ['ts', 'tsx'],
  },
  python: {
    load: () => import('highlight.js/lib/languages/python'),
    extensions: ['py'],
  },
  ruby: {
    load: () => import('highlight.js/lib/languages/ruby'),
    extensions: ['rb'],
  },
  go: {
    load: () => import('highlight.js/lib/languages/go'),
    extensions: ['go'],
  },
  java: {
    load: () => import('highlight.js/lib/languages/java'),
    extensions: ['java'],
  },
  groovy: {
    load: () => import('highlight.js/lib/languages/groovy'),
    extensions: ['groovy'],
  },
  php: {
    load: () => import('highlight.js/lib/languages/php'),
    extensions: ['php'],
  },
  r: {
    load: () => import('highlight.js/lib/languages/r'),
    extensions: ['r'],
  },
  bash: {
    load: () => import('highlight.js/lib/languages/bash'),
    extensions: ['bash', 'sh'],
  },
  c: {
    load: () => import('highlight.js/lib/languages/c'),
    extensions: ['c', 'h'],
  },
  cpp: {
    load: () => import('highlight.js/lib/languages/cpp'),
    extensions: ['cpp', 'properties', 'types'],
  },
  yaml: {
    load: () => import('highlight.js/lib/languages/yaml'),
    extensions: ['yml', 'yaml'],
  },
  ini: {
    load: () => import('highlight.js/lib/languages/ini'),
    extensions: ['ini', 'toml', 'cfg'],
  },
  dos: {
    load: () => import('highlight.js/lib/languages/dos'),
    extensions: ['bat', 'btm', 'cmd'],
  },
  matlab: {
    load: () => import('highlight.js/lib/languages/matlab'),
    extensions: ['m', 'mat'],
  },
  xml: {
    load: () => import('highlight.js/lib/languages/xml'),
    extensions: ['html', 'xml'],
  },
  json: {
    load: () => import('highlight.js/lib/languages/json'),
    extensions: ['json'],
  },
} as const;

type HighlightLanguage = keyof typeof languagesMap;

const languages = Object.keys(languagesMap) as HighlightLanguage[];
const extensions = languages.flatMap(language => languagesMap[language].extensions);

function getLanguageByExtension(extension: string): HighlightLanguage | undefined {
  for (const language of languages) {
    // @ts-expect-error
    if (languagesMap[language].extensions.includes(extension.toLowerCase())) {
      return language;
    }
  }
}

function registerLanguage(language: HighlightLanguage, result: LanguageFn) {
  hljs.registerLanguage(language, result);
}

async function loadLanguage(language: HighlightLanguage): Promise<LanguageFn> {
  return (await languagesMap[language].load()).default;
}

export function isRegisteredLanguage(language: HighlightLanguage) {
  return hljs.listLanguages().includes(language);
}

export function isExtensionToRegister(extension: string) {
  const language = getLanguageByExtension(extension);

  return language ? !isRegisteredLanguage(language) : false;
}

export function getCodeExtensions() {
  return extensions;
}

export function isCodeExtension(extension: string) {
  // @ts-expect-error
  return getCodeExtensions().includes(extension.toLowerCase());
}

export async function initLanguage(extension: string) {
  const language = getLanguageByExtension(extension);

  if (!language || isRegisteredLanguage(language)) {
    return;
  }

  registerLanguage(language, await loadLanguage(language));
}

export function highlightText(code: string) {
  return hljsCore.highlightAuto(code).value;
}

registerLanguage('python', python);
