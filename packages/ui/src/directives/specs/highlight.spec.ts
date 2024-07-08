import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { vHighlight } from '../highlight';

describe('vHighlight directive', () => {
  const TestComponent = {
    template: `<div v-highlight="'test'">{{ message }}</div>`,
    data() {
      return {
        message: 'This is a test message',
      };
    },
  };

  it('highlights the specified text within the element', () => {
    const wrapper = mount(TestComponent, {
      global: {
        directives: {
          Highlight: vHighlight,
        },
      },
    });
    expect(wrapper.html()).toContain('<span class="acv-text--highlighting">test</span>');
  });

  it('does not modify the element if the specified text is not found', () => {
    const wrapper = mount(TestComponent, {
      global: {
        directives: {
          Highlight: vHighlight,
        },
      },
      data() {
        return {
          message: 'No matching text',
        };
      },
    });
    expect(wrapper.html()).not.toContain('<span class="acv-text--highlighting">');
  });

  it('removes previous highlights before applying new ones', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        directives: {
          Highlight: vHighlight,
        },
      },
    });
    await wrapper.setData({ message: 'Another test message' });
    expect(wrapper.html()).toContain('<span class="acv-text--highlighting">test</span>');
    expect(wrapper.html().match(/<span class="acv-text--highlighting">test<\/span>/g)?.length).toBe(1);
  });

  it('handles empty strings gracefully', () => {
    const wrapper = mount({
      template: `<div v-highlight="''">{{ message }}</div>`,
      data() {
        return {
          message: 'Empty string test',
        };
      },
    }, {
      global: {
        directives: {
          Highlight: vHighlight,
        },
      },
    });
    expect(wrapper.html()).not.toContain('<span class="highlight">');
  });

  it('updates highlights when directive value changes', async () => {
    const DynamicTestComponent = {
      template: `<div v-highlight="dynamicText">{{ message }}</div>`,
      data() {
        return {
          message: 'Dynamic highlight test',
          dynamicText: 'highlight',
        };
      },
    };
    const wrapper = mount(DynamicTestComponent, {
      global: {
        directives: {
          Highlight: vHighlight,
        },
      },
    });
    await wrapper.setData({ dynamicText: 'test' });
    expect(wrapper.html()).toContain('<span class="acv-text--highlighting">test</span>');
  });
});
