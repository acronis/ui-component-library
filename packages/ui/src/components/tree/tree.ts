interface TreeNode {
  key: string
  title: string
  icon?: string
  iconColor?: string
  disabled?: boolean
  children?: TreeNode[]
}

export interface TreeProps {
  /**
   * Tree data
   */
  data?: TreeNode[]

  /**
   * Text displayed when the tree is empty
   */
  emptyText?: string

  /**
   * Key of the node
   */
  nodeKey?: string

  /**
   * Whether to check strictly, no propagation
   */
  checkStrictly?: boolean

  /**
   * Whether to expand all nodes
   */
  defaultExpandAll?: boolean

  /**
   * Whether to expand the node when clicking on the node
   */
  expandOnClickNode?: boolean

  /**
   * Whether to check the node when clicking on the node
   */
  checkOnClickNode?: boolean

  /**
   * Whether to expand the node when clicking on the icon
   */
  autoExpandParent?: boolean

  /**
   * Key of the default expanded nodes
   */
  defaultExpandedKeys?: any[]

  /**
   * Key of the default checked nodes
   */
  defaultCheckedKeys?: any[]

  expandWhenChecked?: boolean

  /**
   * Whether node checkbox is shown
   */
  showCheckbox?: boolean

  /**
   * Whether to lazy load the children
   */
  lazy?: boolean

  /**
   * Load method
   */
  load?: (node: TreeNode) => Promise<TreeNode[]>

  /**
   * Filter method
   */
  filterNodeMethod?: (value: string, data: TreeNode) => boolean

  /**
   * Accordion mode, only one node can be expanded
   */
  accordion?: boolean

  /**
   * Distance between the node and the left side
   */
  indent?: number

  /**
   * Distance between the nodes and the left side
   */
  rootIndent?: number
}
