import type { AcvProgressProps } from './progress';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Progress from './progress.vue';

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
