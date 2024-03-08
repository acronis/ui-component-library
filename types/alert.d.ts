import { UIKitComponent } from './component'
import { AlertType } from "../packages/alert/src/AlertTypes";

export type { AlertType };

/** Alert Component */
export declare class ElAlert extends UIKitComponent {
  /** Whether to render in advanced mode */
  advanced: boolean;

  /** Title */
  title: string;

  /** Displays top / bottom border. Only works when `card` is set to false */
  border: boolean | object;

  /** Whether to render as a card */
  card: boolean;

  /** Descriptive text. Can also be passed with the default slot */
  description: string;

  /** Component type */
  type: AlertType;

  /** If a type icon is displayed */
  showIcon: boolean;

  /** Hide the close icon */
  hideClose: boolean;

  /** Whether to use transparent background color */
  transparent: boolean;

  /** Subtitle */
  subtitle: string;

  /** Content for content block */
  content: object;

  /** Type for advance content */
  contentBlockType: AlertType;

  /** icon to display */
  icon: string;
}
