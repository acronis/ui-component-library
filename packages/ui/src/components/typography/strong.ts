import { useProps } from '@/utils/props.ts';
import { defineComponent, h } from 'vue';
import { strongProps } from './props.ts';
import Text from './text.ts';

export default defineComponent({
  name: 'Strong',
  props: strongProps,
  emits: [],
  setup(_props, { slots }) {
    const props = useProps('strong', _props, {
      type: 'default',
      delete: false,
      italic: false,
      underline: false,
      mark: false,
      disabled: false,
      keyboard: false,
      thin: false,
      reversed: false,
    });

    return () => (
      h(Text, { ...props, tag: 'strong', strong: true }, slots.default?.())
    );
  },
});
