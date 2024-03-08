import { UIKitComponent } from './component'

/** Cascader Option */
export interface CascaderOption {
  label: string,
  value: any,
  children?: CascaderOption[],
  disabled?: boolean,
  leaf?: boolean,
  divider?: boolean
}

/** Cascader Props */
export interface CascaderProps<V, D> {
  lazy?: boolean,
  lazyLoad?: (node: CascaderNode<V, D>, resolve: Resolve<D>) => void,
  value?: string,
  label?: string,
  children?: string,
  disabled?: string
  leaf?: string
}

type Resolve<D> = (dataList?: D[]) => void

/** Cascader Node */
export interface CascaderNode<V, D> {
  uid: number,
  data: D,
  value: V,
  label: string,
  level: number,
  isDisabled: boolean,
  isLeaf: boolean,
  parent: CascaderNode<V, D> | null,
  children: CascaderNode<V, D>[],
  config: CascaderProps<V, D>
}

/** Cascader component */
export declare class ElCascader<V = any, D = CascaderOption> extends UIKitComponent {
  /** Toggles disabling of Cascader */
  disabled: boolean

  /** Toggles retaining last expanded state upon closing of dropdown */
  expandHistory: boolean

  /** Hook function to dynamically load options */
  loadOptions: (node: CascaderNode<V, D>, resolve: Resolve<D>) => void
  
  /** Maximum height of menu */
  menuMaxHeight: number

  /** Options data */
  options: CascaderOption[]

  /** Button text */
  placeholder: string

  /** Custom class for Cascader's dropdown */
  popperClass: string
}
