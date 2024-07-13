import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Counter from './counter.vue';
import type { AcvCounterProps } from './counter';

describe('test Counter component', () => {
  it('default props', () => {
    const wrapper = mount(Counter);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "count": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Counter, {
      props: {
        title: 'test',
      } as AcvCounterProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
        {
          "count": undefined,
        }
      `);
  });

  it('renders', () => {
    const wrapper = mount(Counter);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-1cbb49bd="" class="acv-counter"></div>"`);
  });
});
