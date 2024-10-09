import type { AcvTreeProps } from './tree.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Tree from './tree.vue';

describe('test Tree component', () => {
  it('default props', () => {
    const wrapper = mount(Tree);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "accordion": false,
        "autoExpandParent": false,
        "checkOnClickNode": false,
        "checkStrictly": false,
        "data": undefined,
        "defaultCheckedKeys": undefined,
        "defaultExpandAll": false,
        "defaultExpandedKeys": undefined,
        "emptyText": undefined,
        "expandOnClickNode": false,
        "expandWhenChecked": false,
        "filterNodeMethod": undefined,
        "indent": undefined,
        "lazy": false,
        "load": undefined,
        "nodeKey": undefined,
        "rootIndent": undefined,
        "showCheckbox": false,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Tree, {
      props: {
        title: 'test',
      } as AcvTreeProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "accordion": false,
        "autoExpandParent": false,
        "checkOnClickNode": false,
        "checkStrictly": false,
        "data": undefined,
        "defaultCheckedKeys": undefined,
        "defaultExpandAll": false,
        "defaultExpandedKeys": undefined,
        "emptyText": undefined,
        "expandOnClickNode": false,
        "expandWhenChecked": false,
        "filterNodeMethod": undefined,
        "indent": undefined,
        "lazy": false,
        "load": undefined,
        "nodeKey": undefined,
        "rootIndent": undefined,
        "showCheckbox": false,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Tree);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-5711e15c="" class="acv-tree"></div>"`);
  });
});
