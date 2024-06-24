import type { ExtractPropTypes, PropType } from 'vue';
import type { ConfigurableProps } from '../../utils/props.ts';
import { booleanProp, buildProps, omitProps } from '../../utils/props.ts';
import type { TitleLevel, TypographyType } from './symbol';

export const textProps = buildProps({
  type: String as PropType<TypographyType>,
  tag: String,
  delete: booleanProp,
  strong: booleanProp,
  italic: booleanProp,
  underline: booleanProp,
  code: booleanProp,
  mark: booleanProp,
  disabled: booleanProp,
  keyboard: booleanProp,
  thin: booleanProp,
  reversed: booleanProp
});

export type TextProps = ExtractPropTypes<typeof textProps>;
export type TextConfigurableProps = ConfigurableProps<TextProps>;

export const pProps = omitProps(textProps, ['tag', 'code']);

export type PProps = ExtractPropTypes<typeof pProps>;
export type PConfigurableProps = ConfigurableProps<PProps>;

export const strongProps = omitProps(textProps, ['tag', 'strong', 'code']);

export type StrongProps = ExtractPropTypes<typeof strongProps>;
export type StrongConfigurableProps = ConfigurableProps<StrongProps>;

export const titleProps = buildProps({
  type: String as PropType<TypographyType>,
  level: Number as PropType<TitleLevel>,
  top: booleanProp,
  marker: booleanProp,
  aligned: booleanProp,
  thin: booleanProp,
  markerType: String
});

export type TitleProps = ExtractPropTypes<typeof titleProps>;
export type TitleConfigurableProps = ConfigurableProps<TitleProps>;

export const hProps = omitProps(titleProps, ['level']);

export const h1Props = hProps;
export const h2Props = hProps;
export const h3Props = hProps;
export const h4Props = hProps;
export const h5Props = hProps;
export const h6Props = hProps;

export type HProps = ExtractPropTypes<typeof hProps>;
export type HConfigurableProps = ConfigurableProps<HProps>;

export type H1Props = HProps;
export type H2Props = HProps;
export type H3Props = HProps;
export type H4Props = HProps;
export type H5Props = HProps;
export type H6Props = HProps;

export type H1ConfigurableProps = HConfigurableProps;
export type H2ConfigurableProps = HConfigurableProps;
export type H3ConfigurableProps = HConfigurableProps;
export type H4ConfigurableProps = HConfigurableProps;
export type H5ConfigurableProps = HConfigurableProps;
export type H6ConfigurableProps = HConfigurableProps;

export const blockquoteProps = buildProps({
  type: String as PropType<TypographyType>
});

export type BlockquoteProps = ExtractPropTypes<typeof blockquoteProps>;
export type BlockquoteConfigurableProps = ConfigurableProps<BlockquoteProps>;

export const olProps = buildProps({
  type: String as PropType<'a' | 'A' | 'i' | 'I' | '1'>
});

export type OLProps = ExtractPropTypes<typeof olProps>;
export type OLConfigurableProps = ConfigurableProps<OLProps>;

export const ulProps = buildProps({
  listStyle: String
});

export type ULProps = ExtractPropTypes<typeof ulProps>;
export type ULConfigurableProps = ConfigurableProps<ULProps>;
