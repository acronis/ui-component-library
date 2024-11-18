export interface AcvScriptEditorProps {
  /**
   * Title of the ScriptEditor
   */
  title?: string

  /**
   * Description of the ScriptEditor
   */
  description?: string
}

export interface AcvScriptEditorEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvScriptEditorSlots {
  /**
   * The default slot content
   */
  default: void
  /**
   * The description slot content
   * @binding {string} description - The description prop value
   */
  description: void
}
