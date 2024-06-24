import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Autocomplete from './autocomplete.vue';
import type { AcvAutocompleteProps } from './autocomplete';

describe('test Autocomplete component', () => {
  it('default props', () => {
    const wrapper = mount(Autocomplete);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(Autocomplete, {
      props: {
        title: 'test',
      } as AcvAutocompleteProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(Autocomplete);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});
