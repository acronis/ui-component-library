---
to: packages/ui/src/components/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.camel(name) %>.ts
---
export interface <%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Props {
  /**
   * Title of the <%= h.changeCase.pascal(name) %>
   */
  title?: string

  /**
   * Description of the <%= h.changeCase.pascal(name) %>
   */
  description?: string
}

export interface <%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Events {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface <%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Slots {
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
