import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Skeleton from './skeleton.vue';
import type { SkeletonProps } from './skeleton.ts';

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
      } as SkeletonProps,
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
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-67353e5b="" class="acv-skeleton">
        
        
      </div>"
    `);
  });
});
