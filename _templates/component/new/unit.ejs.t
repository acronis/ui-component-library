---
to: "packages/ui/src/components/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.camel(name) %>.spec.ts"
---
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import <%= h.changeCase.pascal(name) %> from './<%= h.changeCase.camel(name) %>.vue';
import type { <%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Props } from './<%= h.changeCase.camel(name) %>';

describe('test <%= h.changeCase.pascal(name) %> component', () => {
  it('default props', () => {
    const wrapper = mount(<%= h.changeCase.pascal(name) %>);
    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('pass props', () => {
    const wrapper = mount(<%= h.changeCase.pascal(name) %>, {
      props: {
        title: 'test',
      } as <%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Props,
    });

    expect(wrapper.props()).toMatchInlineSnapshot();
  });

  it('renders', () => {
    const wrapper = mount(<%= h.changeCase.pascal(name) %>);

    expect(wrapper.html()).toMatchInlineSnapshot();
  });
});
