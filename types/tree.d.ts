import { CreateElement, VNode } from 'vue'
import { UIKitComponent } from './component'

/** The node of the tree */
export interface TreeNode {
  id?: any,
  label?: string,
  isLeaf?: boolean,
  children?: TreeNode[]
}

export interface RenderContent {
  /**
   * Render function for a specific node
   *
   * @param h The render function
   * @param data The data object containing the specific node
   */
  (h: CreateElement, data: { node: TreeNode }): VNode
}

export interface FilterNodeMethod {
  /**
   * Filter method for each node
   *
   * @param value The query string
   * @param data The original data object
   * @param node Tree node
   */
  (value: string, data: TreeNode, node: any): boolean
}

export enum GetCheckedMode {
  all = 0,
  leaf,
  parent
}

/** Tree Component */
export declare class ElTree extends UIKitComponent {
  /** Tree data */
  data: TreeNode[]

  /** Text displayed when data is void */
  emptyText: string

  /** Unique identity key name for nodes, its value should be unique across the whole tree */
  nodeKey: string

  /** Configuration options, see the following table */
  props: object

  /** Method for loading subtree data */
  load: (node: TreeNode, resolve: Function) => void

  /** Render function for tree node */
  renderContent: RenderContent

  /** Whether current node is highlighted */
  highlightCurrent: boolean

  /** Whether to expand all nodes by default */
  defaultExpandAll: boolean

  /** Whether to expand or collapse node when clicking on the node. If false, then expand or collapse node only when clicking on the arrow icon. */
  expandOnClickNode: boolean

  /** Whether to expand father node when a child node is expanded */
  autoExpandParent: boolean

  /** Array of keys of initially expanded nodes */
  defaultExpandedKeys: any[]

  /** Whether node is selectable */
  showCheckbox: boolean

  /** Whether checked state of a node not affects its father and child nodes when show-checkbox is true */
  checkStrictly: boolean

  /** Array of keys of initially checked nodes */
  defaultCheckedKeys: any[]

  /** This function will be executed on each node when use filter method. If return false, tree node will be hidden. */
  filterNodeMethod: FilterNodeMethod

  /** Whether only one node among the same level can be expanded at one time */
  accordion: boolean

  /** Whether `current-change` will be emitted only on leaf node click */
  emitCurrentChangeOnlyOnLeaf: boolean

  /** Whether node expands when checked */
  expandWhenChecked: boolean

  /**
   * Filter all tree nodes.Ffiltered nodes will be hidden
   *
   * @param value The value to be used as first parameter for `filter-node-method`
   */
  filter(value: any): void

  /**
   * If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of nodes
   *
   * Three modes is provided:
   * all : default mode which return array of all selected nodes.
   * leaf : only returns the array of currently selected end nodes.
   * parent : only return array of the currently selected end nodes, however if parent is fully checked, only parent node is included.
   *
   * @param mode determines which nodes will be in the list. see description
   */
  getCheckedNodes(mode?: GetCheckedMode): TreeNode[]

  /**
   * Set certain nodes to be checked. Only works when `node-key` is assigned
   *
   * @param nodes An array of nodes to be checked
   * @param leafOnly If the parameter is true, it only returns the currently selected array of sub-nodes
   */
  setCheckedNodes(nodes: TreeNode[], leafOnly?: boolean): void

  /**
   * If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of nodes' keys
   *
   * Three modes is provided:
   * all : default mode which return array of all selected nodes.
   * leaf : only returns the array of currently selected end nodes.
   * parent : only return array of the currently selected end nodes, however if parent is fully checked, only parent node is included.
   *
   * @param mode determines which nodes will be in the list. see description
   */
  getCheckedKeys(mode?: GetCheckedMode): any[]

  /**
   * Set certain nodes to be checked. Only works when `node-key` is assigned
   *
   * @param keys An array of node's keys to be checked
   * @param leafOnly If the parameter is true, it only returns the currently selected array of sub-nodes
   */
  setCheckedKeys(keys: any[], leafOnly?: boolean): void

  /**
   * Set node to be checked or not. Only works when `node-key` is assigned
   *
   * @param data Node's key or data to be checked
   * @param checked Indicating the node checked or not
   * @param deep Indicating whether to checked state deeply or not
   */
  setChecked(data: TreeNode | any, checked: boolean, deep: boolean): void

  /**
   * Return the highlight node's key (null if no node is highlighted)
   */
  getCurrentKey(): any

  /**
   * Set highlighted node by key, only works when node-key is assigned
   *
   * @param key The node's key to be highlighted
   */
  setCurrentKey(key: any): void

  /**
   * Return the highlight node (null if no node is highlighted)
   */
  getCurrentNode(): TreeNode

  /**
   * Set highlighted node, only works when node-key is assigned
   *
   * @param node The node to be highlighted
   */
  setCurrentNode(node: TreeNode): void

  /**
   * Appends a child node to a given node in the tree, only works when node-key is assigned
   *
   * @param data Data object to be appended
   * @param parentNode The parent node to which the child node is to be appended
   */
  append(data: TreeNode | any, parentNode: TreeNode): void

  /**
  * Removes a node, only works when node-key is assigned
  *
  * @param data Node's data
  */
  remove(data: TreeNode): void

  /**
  * Inserts a node before a given node in the tree, only works when node-key is assigned
  *
  * @param data Node's data to be inserted
  * @param refNode Reference node's data, key or node
  */
  insertBefore(data: TreeNode, refNode: TreeNode): void

  /**
  * Inserts a node after a given node in the tree, only works when node-key is assigned
  *
  * @param data Node's data to be inserted
  * @param refNode Reference node's data, key or node
  */
  insertAfter(data: TreeNode, refNode: TreeNode): void

  /**
  * Returns array of currently expanded nodes' keys, only works when node-key is assigned
  *
  * @param isStrict If true, a node is considered as expanded only if all of its descendents are expanded. If false, a node is considered as expanded as long as it is expanded without considering its descendents.
  */
  getExpandedNodes(isStrict: boolean): any[]

  /**
  * Sets node or nodes to be expanded, only works when `node-key` is assigned
  *
  * @param aData Array of nodes' data or keys
  * @param isStrict If true, the node to be expanded is expanded along with all of its descendents. If false, only itself is expanded.
  */
  setExpandedNodes(aData: any[], isStrict: boolean): void

  /**
  * If the node can be selected (show-checkbox is true), it returns the currently half selected array of node's keys
  */
  getHalfCheckedKeys(): any[]

  /**
  * If the node can be selected (show-checkbox is true), it returns the currently half selected array of nodes
  */
  getHalfCheckedNodes(leafOnly?: boolean): TreeNode[]
}
