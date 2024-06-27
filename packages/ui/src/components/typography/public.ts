import type { ComponentPublicInstance } from 'vue';
import Title from './title.tsx';
import Text from './text.tsx';
import Blockquote from './blockquote.tsx';
import OL from './ol.tsx';
import UL from './ul.tsx';
import { H1, H2, H3, H4, H5, H6 } from './h.tsx';
import P from './p.tsx';
import Strong from './strong.tsx';

export { Title, Text, Blockquote, OL, UL, H1, H2, H3, H4, H5, H6, P, Strong };

export {
  titleProps,
  textProps,
  blockquoteProps,
  olProps,
  ulProps,
  h1Props,
  h2Props,
  h3Props,
  h4Props,
  h5Props,
  h6Props,
  pProps,
  strongProps
} from './props.ts';

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
  TextProps,
  TextConfigurableProps,
  PProps,
  PConfigurableProps,
  StrongProps,
  StrongConfigurableProps,
  TitleProps,
  TitleConfigurableProps,
  H1Props,
  H2Props,
  H3Props,
  H4Props,
  H5Props,
  H6Props,
  H1ConfigurableProps,
  H2ConfigurableProps,
  H3ConfigurableProps,
  H4ConfigurableProps,
  H5ConfigurableProps,
  H6ConfigurableProps,
  BlockquoteProps,
  BlockquoteConfigurableProps,
  OLProps,
  OLConfigurableProps,
  ULProps,
  ULConfigurableProps
} from './props';
export type { TypographyType, TitleLevel } from './symbol';
