import { Dictionary } from 'vue-router/types/router'
import { UIKitComponent } from './component'
import { IconColor } from './icon'

export interface TileAction<Command = string> {
  label: Translate
  command: Command
  icon?: string
  /** In format 'av-solid-brand-lightest' */
  divided?: boolean
  color?: string
}
export interface GroupConfig {
  key: string
  title: Translate
  visibleIfEmpty?: boolean
  position?: number
  actions?: TileAction[]
}
export interface TilesConfig {
  map: {
    /** Name of property with value type of Translate */
    title?: string
    /** Name of property with value type of Translate */
    caption?: string
    /** Name of property with value type of Translate */
    footerTitle?: string
    /** Name of property with value type of Translate */
    footerCaption?: string
    /** Name of property with value type of TileImg */
    image?: string
    /** Name of property with value type of TileIcon[] */
    icons?: string
    /** Name of property with value type of TileAction[] */
    actions?: string
  }
}

export interface TranslateDate {
  key: string;
  date: number | Date;
}

export interface TranslateNumber {
  key: string;
  value: number;
}

export interface TranslateText {
  key: string;
  count?: number;
  options?: Dictionary<string | string[] | number | Date | TranslateText | TranslateDate | TranslateNumber>;
}

export type Translate = string | TranslateText | TranslateDate | TranslateNumber;

export type ImageSize = '16' | '24' | '32' | '64' | '72' | '96';

export interface TileImg {
  src: string
  size?: ImageSize
  /** In format 'av-solid-brand-lightest' */
  backgroundColor?: string
}

export interface TileIcon {
  /** Icon name */
  name: string
  size?: ImageSize
  color?: IconColor
  /** In format 'av-solid-brand-lightest' */
  backgroundColor?: string
  /** In format 'av-solid-brand-lightest' */
  borderColor?: string
}

export type TileImage = TileImg | TileIcon;

/** Tiles component */
export declare class ElTiles extends UIKitComponent {
  /** Tiles data */
  data: object[]

  /** Translate service. VueI18n supported */
  i18n?: object

  /** Groups config */
  groupsConfig: GroupConfig[]

  /** Tiles config */
  tilesConfig: TilesConfig

  /** Id of defult group */
  defaultGroupKey?: string

  /** Key of row data */
  rowKey: string

  /** Key of row data used for grouping data in groups */
  groupKey: string

  /** Object of group keys: { [key: groupKey]: groupKey }  */
  defaultSelectedGroups: Dictionary<string>
}
