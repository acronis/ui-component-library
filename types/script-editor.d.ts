import { UIKitComponent } from './component'

export type ScriptModeType = 'ro' | 'edit' | 'diff';

/** Script Editor Component */
export declare class ElScriptEditor extends UIKitComponent {
  /** The  value of the auto created model in the editor */
  script: string

  /** The initial language of the auto created model in the editor */
  language: string

  /** editor mode */
  mode: ScriptModeType

  /** When mode is diff, value of the original model in the editor. */
  originalScript: string

  /** When mode is diff, value of the original language in the editor. */
  originalLanguage: string

  /** width of the editor. */
  width: string | number

  /** height of the editor. */
  height: string | number

  /** path to the editor */
  assetsPath: string;
}
