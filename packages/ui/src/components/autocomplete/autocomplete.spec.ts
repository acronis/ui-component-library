import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Autocomplete from './autocomplete.vue';
import type { AcvAutocompleteProps } from './autocomplete';

describe('test Autocomplete component', () => {
  it('default props', () => {
    const wrapper = mount(Autocomplete);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Autocomplete, {
      props: {
        title: 'test',
      } as AcvAutocompleteProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "title": "test",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Autocomplete);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<div data-v-de0d3569="" class="acv-autocomplete"></div>"`);
  });
});
