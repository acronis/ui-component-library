import type { ComponentPublicInstance } from 'vue';
import Blockquote from '@/components/__dev__/typography/blockquote.ts';
import { H1, H2, H3, H4, H5, H6 } from '@/components/__dev__/typography/h.ts';
import OL from '@/components/__dev__/typography/ol.ts';
import P from '@/components/__dev__/typography/p.ts';
import Strong from '@/components/__dev__/typography/strong.ts';
import Text from '@/components/__dev__/typography/text.ts';
import Title from '@/components/__dev__/typography/title.ts';
import UL from '@/components/__dev__/typography/ul.ts';

export { Blockquote, H1, H2, H3, H4, H5, H6, OL, P, Strong, Text, Title, UL };

export {
  blockquoteProps,
  h1Props,
  h2Props,
  h3Props,
  h4Props,
  h5Props,
  h6Props,
  olProps,
  pProps,
  strongProps,
  textProps,
  titleProps,
  ulProps
} from '@/components/__dev__/typography/props.ts';

export type TitleExposed = ComponentPublicInstance & InstanceType<typeof Title>;
export type TextExposed = ComponentPublicInstance & InstanceType<typeof Text>;
export type BlockquoteExposed = ComponentPublicInstance & InstanceType<typeof Blockquote>;
export type OLExposed = ComponentPublicInstance & InstanceType<typeof OL>;
export type ULExposed = ComponentPublicInstance & InstanceType<typeof UL>;
export type H1Exposed = ComponentPublicInstance & InstanceType<typeof H1>;
export type H2Exposed = ComponentPublicInstance & InstanceType<typeof H2>;
export type H3Exposed = ComponentPublicInstance & InstanceType<typeof H3>;
export type H4Exposed = ComponentPublicInstance & InstanceType<typeof H4>;
export type H5Exposed = ComponentPublicInstance & InstanceType<typeof H5>;
export type H6Exposed = ComponentPublicInstance & InstanceType<typeof H6>;
export type PExposed = ComponentPublicInstance & InstanceType<typeof P>;
export type StrongExposed = ComponentPublicInstance & InstanceType<typeof Strong>;

export type {
  BlockquoteConfigurableProps,
  BlockquoteProps,
  H1ConfigurableProps,
  H1Props,
  H2ConfigurableProps,
  H2Props,
  H3ConfigurableProps,
  H3Props,
  H4ConfigurableProps,
  H4Props,
  H5ConfigurableProps,
  H5Props,
  H6ConfigurableProps,
  H6Props,
  OLConfigurableProps,
  OLProps,
  PConfigurableProps,
  PProps,
  StrongConfigurableProps,
  StrongProps,
  TextConfigurableProps,
  TextProps,
  TitleConfigurableProps,
  TitleProps,
  ULConfigurableProps,
  ULProps
} from '@/components/__dev__/typography/props.ts';
export type { TitleLevel, TypographyType } from '@/components/__dev__/typography/symbol.ts';
