import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import localePlugin from '../../plugins/locale/localePlugin.ts';
import { useLocale } from '../useLocale.ts';

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
