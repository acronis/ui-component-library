import Vue from 'vue'

/** UIKit component common definition */
export declare class UIKitComponent extends Vue {
  /** Install component into Vue */
  static install (vue: typeof Vue): void
}

/** Component size definition for button, input, etc */
export type UIKitComponentSize = 'default' | 'small'

/** Horizontal alignment */
export type UIKitHorizontalAlignment = 'left' | 'center' | 'right' | 'stretch'
