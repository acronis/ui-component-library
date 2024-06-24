import { mount } from '@vue/test-utils';
import { h } from 'vue';
import propsPlugin from '../plugins/propsPlugin.ts';
import { useProps } from './useProps.ts';

describe('useProps', () => {
  it('returns default props when no props are provided', () => {
    const wrapper = mount({
      setup() {
        return useProps('button', {});
      },
      render() {
        return h('div');
      }
    }, {
      global: {
        plugins: [propsPlugin]
      }
    });

    expect(wrapper.vm.props).toEqual({
      kind: 'solid'
    });
  });

  it('merges provided props with default props', () => {
    const wrapper = mount({
      setup() {
        return useProps('button', { size: 'large' });
      },
      render() {
        return h('div');
      }
    }, {
      global: {
        plugins: [propsPlugin]
      }
    });

    expect(wrapper.vm.props).toEqual({
      kind: 'solid',
      size: 'large'
    });
  });
});
