// Utilities
import { h, mergeProps, render, resolveComponent } from 'vue';
import type {
  Component,
  ComponentInstance,
  ConcreteComponent,
  DirectiveBinding,
  ObjectDirective,
  VNode,
  VNodeProps
} from 'vue';

// Types
import { isObject } from 'lodash-es';

type ExcludeProps =
  | 'v-slots'
  | `v-slot:${string}`
  | `on${Uppercase<string>}${string}`
  | 'key'
  | 'ref'
  | 'ref_for'
  | 'ref_key'
  | '$children';

declare const CustomDirectiveSymbol: unique symbol;

type DirectiveHook<B extends DirectiveBinding> = (el: any, binding: B, vnode: VNode<any, any>, prevVNode: VNode<any, any>) => void;

export interface CustomDirective<B extends DirectiveBinding = DirectiveBinding> {
  created?: DirectiveHook<B>
  beforeMount?: DirectiveHook<B>
  mounted?: DirectiveHook<B>
  beforeUpdate?: DirectiveHook<B>
  updated?: DirectiveHook<B>
  beforeUnmount?: DirectiveHook<B>
  unmounted?: DirectiveHook<B>
  [CustomDirectiveSymbol]: true
}

export function useDirectiveComponent<
    Binding extends DirectiveBinding,
>(component: string | Component, props?: (binding: Binding, element: HTMLElement) => Record<string, any>): CustomDirective<Binding>;

export function useDirectiveComponent<
    C extends Component,
    Props = Omit<ComponentInstance<C>['$props'], ExcludeProps>
>(component: string | C, props?: Record<string, any>): ObjectDirective<any, Props>;

export function useDirectiveComponent(
  component: string | Component,
  props?: Record<string, any> | ((binding: DirectiveBinding, element?: HTMLElement) => Record<string, any>)
): ObjectDirective | CustomDirective {
  const concreteComponent = (typeof component === 'string'
    ? resolveComponent(component)
    : component) as ConcreteComponent;

  const hook = mountComponent(concreteComponent, props);

  return {
    mounted: hook,
    updated: hook,
    unmounted(el: HTMLElement) {
      render(null, el);
    },
  };
}

function mountComponent(component: ConcreteComponent, props?: Record<string, any> | ((binding: DirectiveBinding, element?: HTMLElement) => Record<string, any>)) {
  return function (el: HTMLElement, binding: DirectiveBinding, _vnode: VNode) {
    const _props = typeof props === 'function' ? props(binding, el) : props;
    const text = binding.value?.text ?? binding.value ?? _props?.text;
    const value: VNodeProps = isObject(binding.value) ? binding.value : {};

    // Get the children from the props or directive value, or the element's children
    const children = () => text ?? el.innerHTML;

    const node = h(component, mergeProps(_props, value), children);

    render(node, el);
  };
}
