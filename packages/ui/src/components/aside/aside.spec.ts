import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Aside from './aside.vue';
import type { AcvAsideProps } from './aside.ts';

describe('test Aside component', () => {
  it('default props', () => {
    const wrapper = mount(Aside);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
        "width": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Aside, {
      props: {
        title: 'test',
      } as AcvAsideProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "color": undefined,
        "width": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Aside);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<aside data-v-8d49fdc1="" class="acv-aside"></aside>"`);
  });

  it('color', () => {
    const wrapper = mount(Aside, {
      props: {
        color: 'primary',
      } as AcvAsideProps,
    });
    expect(wrapper.classes()).toContain('acv-aside--color-primary');
  });

  it('width', async () => {
    const wrapper = mount(Aside, {
      props: {
        width: '100',
      } as AcvAsideProps
    });

    await nextTick();

    expect(wrapper.html()).toMatchInlineSnapshot(`"<aside data-v-8d49fdc1="" class="acv-aside" style="--8d49fdc1-widthPx: 100px;"></aside>"`);
  });
});
