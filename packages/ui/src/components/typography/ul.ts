import { useNameHelper } from '@/utils/namespace.ts';
import { useProps } from '@/utils/props.ts';
import { computed, defineComponent, h } from 'vue';
import { ulProps } from './props.ts';

export default defineComponent({
  name: 'UL',
  props: ulProps,
  emits: [],
  setup(_props, { slots }) {
    const props = useProps('ul', _props, {
      listStyle: 'circle',
    });

    const nh = useNameHelper('ul');

    const className = computed(() => {
      return {
        [nh]: true,
        [`${nh}--inherit`]: props.inherit,
        [`${nh}--no-marker`]: props.listStyle === 'none',
      };
    });

    return () => {
      return h(
        'ul',
        {
          class: className.value,
          style: { listStyleType: props.listStyle },
        },
        slots.default?.(),
      );
    };
  },
});
