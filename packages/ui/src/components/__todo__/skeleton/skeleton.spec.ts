import type { AcvSkeletonProps } from '@/components/__todo__/skeleton/skeleton.ts';
import Skeleton from '@/components/__todo__/skeleton/skeleton.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('test skeleton component', () => {
  it('default props', () => {
    const wrapper = mount(Skeleton);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Skeleton, {
      props: {
        title: 'test',
      } as AcvSkeletonProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Skeleton);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-67353e5b="" class="acv-skeleton"></div>"`);
  });
});
