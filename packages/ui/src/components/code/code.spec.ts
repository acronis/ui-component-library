import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Code from './code.vue';
import type { CodeProps } from './code.ts';

const code = `from pymatgen.core import Lattice, Structure
from rolos_sdk import Dataframe, DataStorageInterface, DataStorageType, RawObject, TableColumn
from rolos_sdk.structures.object.pymatgen import PyMatGenObject

table_schema = [
    TableColumn(name="Index", type=int),
    TableColumn(name="Test", type=float),
    TableColumn(name="Structure", type=PyMatGenObject),
    TableColumn(name="Raw experiment data", type=RawObject),
]`;

describe('test Code component', () => {
  it('default props', () => {
    const wrapper = mount(Code);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "code": undefined,
        "extension": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Code, {
      props: {
        title: 'test',
      } as CodeProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "code": undefined,
        "extension": undefined,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Code);
    expect(wrapper.html()).toMatchInlineSnapshot(`"<code data-v-28437d1d="" class="acv-code"></code>"`);
  });

  it('code should be highlighted', () => {
    const wrapper = mount(Code, {
      props: { code, extension: 'py' }
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
