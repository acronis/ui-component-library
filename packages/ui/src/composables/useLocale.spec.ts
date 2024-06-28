import { h } from 'vue';
import { mount } from '@vue/test-utils';
import localePlugin from '../plugins/locale/localePlugin';
import { useLocale } from '../composables/useLocale';

describe('useLocale', () => {
  it('returns available locales', () => {
    const wrapper = mount({
      setup() {
        return useLocale();
      },
      render() {
        return h('div');
      }
    }, {
      global: {
        plugins: [[localePlugin, {
          defaultLocale: 'en',
          messages: {
            en: {
              hello: 'Hello'
            }
          }
        }]]
      }
    });

    expect(wrapper.vm.availableLocales).toEqual(['en']);
  });

  it('returns empty array when no locales are available', () => {
    const wrapper = mount({
      setup() {
        return useLocale();
      },
      render() {
        return h('div');
      }
    }, {
      global: {
        plugins: [[localePlugin, {
          defaultLocale: 'en',
          messages: {}
        }]]
      }
    });

    expect(wrapper.vm.availableLocales).toEqual([]);
  });
});
