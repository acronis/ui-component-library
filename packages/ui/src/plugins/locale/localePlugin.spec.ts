import { createApp, h } from 'vue';
import localePlugin, { LOCALE_PLUGIN_INJECTION_KEY } from './localePlugin';

describe('localePlugin', () => {
  it('provides default locale to the app', () => {
    const app = createApp({
      render: () => h('div')
    });

    app.use(localePlugin, {
      locale: 'en',
      messages: {
        en: {
          hello: 'Hello'
        }
      }
    });

    const providedLocale = app._context.provides[LOCALE_PLUGIN_INJECTION_KEY];
    expect(providedLocale).toEqual({
      availableLocales: [
        'en',
      ],
      defaultLocale: 'en',
      messages: {
        en: {
          hello: 'Hello'
        }
      },
      selectedLocale: 'en',
    });
  });

  it('merges provided localMessages with default localMessages', () => {
    const app = createApp({
      render: () => h('div')
    });

    app.use(localePlugin, {
      locale: 'en',
      messages: {
        en: {
          hello: 'Hello',
          goodbye: 'Goodbye'
        }
      }
    });

    const providedLocale = app._context.provides[LOCALE_PLUGIN_INJECTION_KEY];
    expect(providedLocale).toEqual({
      availableLocales: [
        'en',
      ],
      defaultLocale: 'en',
      messages: {
        en: {
          hello: 'Hello',
          goodbye: 'Goodbye'
        }
      },
      selectedLocale: 'en',
    });
  });

  it('throws error when no locale is provided', () => {
    const app = createApp({
      render: () => h('div')
    });

    expect(() => {
      app.use(localePlugin, {
        messages: {
          en: {
            hello: 'Hello'
          }
        }
      });
    }).toThrow('Could not resolve defaultLocale');
  });
});
