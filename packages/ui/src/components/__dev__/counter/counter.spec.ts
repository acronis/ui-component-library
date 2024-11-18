import type { AcvCounterProps } from '@/components/__dev__/counter/counter.ts';
import Counter from '@/components/__dev__/counter/counter.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

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
