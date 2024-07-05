import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Chip from './chip.vue';
import type { AcvChipProps } from './chip.ts';

describe('test Chip component', () => {
  it('default props', () => {
    const wrapper = mount(Chip);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "iconName": undefined,
        "showClose": false,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Chip, {
      props: {
        title: 'test',
      } as AcvChipProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "iconName": undefined,
        "showClose": false,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Chip);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-b16f119d="" class="acv-chip">
        <!--v-if--><span data-v-b16f119d="" class="acv-chip__text"></span><!--    <div class="i-acronis-icons:user--32" /> -->
        <div data-v-b16f119d="" class="i-vscode-icons:file-type-light-pnpm"></div>
        <!--v-if-->
      </div>"
    `);
  });
});
