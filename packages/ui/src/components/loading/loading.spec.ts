import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Loading from './loading.vue';
import type { AcvLoadingProps } from './loading';

describe('test Loading component', () => {
  it('default props', () => {
    const wrapper = mount(Loading);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Loading, {
      props: {
        title: 'test',
      } as AcvLoadingProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Loading);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-f4e822ab="" class="acv-loading"></div>"`);
  });
});
