import type { TitleLevel } from '@/components/__dev__/typography/symbol.ts';
import { hProps } from '@/components/__dev__/typography/props.ts';
import Title from '@/components/__dev__/typography/title.ts';
import { useProps } from '@/utils/props.ts';
import { defineComponent, h } from 'vue';

function createHComponent(level: TitleLevel) {
  return defineComponent({
    name: `H${level}`,
    props: hProps,
    emits: [],
    setup(_props, { slots }) {
      const props = useProps(`h${level}`, _props, {
        type: 'default',
        top: false,
        marker: false,
        aligned: false,
        thin: false,
      });

      return () => h(
        Title,
        { ...props, level },
        slots.default ? slots.default() : undefined,
      );
    },
  });
}

export const H1 = createHComponent(1);
export const H2 = createHComponent(2);
export const H3 = createHComponent(3);
export const H4 = createHComponent(4);
export const H5 = createHComponent(5);
export const H6 = createHComponent(6);
