import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { vTextMiddleEllipsis } from '../textMiddleEllipsis';

describe('vTextMiddleEllipsis directive', () => {
  it('applies ellipsis correctly to a long path', () => {
    const Component = {
      template: `<div v-text-middle-ellipsis>/user/home/documents/reports/annual/report.txt</div>`,
    };
    const wrapper = mount(Component, {
      global: {
        directives: {
          TextMiddleEllipsis: vTextMiddleEllipsis
        }
      }
    });
    expect(wrapper.find('.left').text()).toBeTruthy();
    expect(wrapper.find('.right').text()).toBeTruthy();
    expect(wrapper.text()).toContain('/user/home/documents/reports/annual/report.txt');
  });

  it('sets title attribute when show-hover-hint is provided', () => {
    const Component = {
      template: `<div v-text-middle-ellipsis:show-hover-hint>/user/home/documents/reports/annual/report.txt</div>`,
    };
    const wrapper = mount(Component, {
      global: {
        directives: {
          TextMiddleEllipsis: vTextMiddleEllipsis
        }
      }
    });
    expect(wrapper.attributes('title')).toBe('/user/home/documents/reports/annual/report.txt');
  });

  it('does not apply directive for invalid Windows path', () => {
    const Component = {
      template: `<div v-text-middle-ellipsis="'C:\\Invalid\\Path'"></div>`,
    };
    const wrapper = mount(Component, {
      global: {
        directives: {
          TextMiddleEllipsis: vTextMiddleEllipsis
        }
      }
    });
    expect(wrapper.html()).not.toContain('<span');
  });

  it('does not apply directive for invalid Linux path', () => {
    const Component = {
      template: `<div v-text-middle-ellipsis="'/invalid//path'"></div>`,
    };
    const wrapper = mount(Component, {
      global: {
        directives: {
          TextMiddleEllipsis: vTextMiddleEllipsis
        }
      }
    });
    expect(wrapper.html()).not.toContain('<span');
  });

  it('handles empty path gracefully', () => {
    const Component = {
      template: `<div v-text-middle-ellipsis=""></div>`,
    };
    const wrapper = mount(Component, {
      global: {
        directives: {
          TextMiddleEllipsis: vTextMiddleEllipsis
        }
      }
    });
    expect(wrapper.html()).not.toContain('<span');
  });
});
