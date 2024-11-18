import type { AcvProgressProps } from '@/components/__todo__/progress/progress.ts';
import Progress from '@/components/__todo__/progress/progress.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test Progress component', () => {
  it('default props', () => {
    const wrapper = mount(Progress);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Progress, {
      props: {
        title: 'test',
      } as AcvProgressProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Progress);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-8f7bb3fd="" class="acv-progress"></div>"`);
  });
});
