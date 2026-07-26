import { useNameHelper } from '@/utils/namespace.ts';
import { useProps } from '@/utils/props.ts';
import { computed, defineComponent, h, renderSlot } from 'vue';
import { textProps } from './props.ts';

export default defineComponent({
  name: 'Text',
  props: textProps,
  emits: [],
  setup(_props, { slots }) {
    const props = useProps('text', _props, {
      type: 'default',
      tag: 'span',
      delete: false,
      strong: false,
      italic: false,
      underline: false,
      code: false,
      mark: false,
      disabled: false,
      keyboard: false,
      thin: false,
      reversed: false,
    });

    const nh = useNameHelper('text');

    const className = computed(() => {
      return {
        [nh]: true,
        [`${nh}-vars`]: true,
        [`${nh}--inherit`]: props.inherit,
        [`${nh}--${props.type}`]: props.type !== 'default',
        [`${nh}--delete`]: props.delete,
        [`${nh}--strong`]: props.strong,
        [`${nh}--italic`]: props.italic,
        [`${nh}--underline`]: props.underline,
        [`${nh}--code`]: props.code,
        [`${nh}--mark`]: props.mark,
        [`${nh}--disabled`]: props.disabled,
        [`${nh}--keyboard`]: props.keyboard,
        [`${nh}--thin`]: props.thin,
        [`${nh}--reversed`]: props.reversed,
      };
    });

    return () => {
      const CustomTag = props.tag || ('span' as any);
      const children = renderSlot(slots, 'default');

      return props.code
        ? h('code', { class: className.value }, props.delete ? h('del', null, children) : children)
        : props.keyboard
          ? h('kbd', { class: className.value }, props.delete ? h('del', null, children) : children)
          : props.delete
            ? h('del', { class: className.value }, children)
            : h(CustomTag, { class: className.value }, children);
    };
  },
});
