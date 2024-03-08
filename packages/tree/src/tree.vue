<template>
  <div
    class="el-tree"
    role="tree"
    tabindex="0"
    @keydown.prevent.up="navigateOptions('prev', $event.target)"
    @keydown.prevent.down="navigateOptions('next', $event.target)"
    @keydown.prevent.enter="checkOption($event.target)"
    @keydown.prevent.space="checkOption($event.target)"
    @keydown.stop.tab.prevent="navigateOptions('next', $event.target)"
  >
    <el-tree-node
      v-for="child in root.childNodes"
      :key="getNodeKey(child)"
      :node="child"
      :props="props"
      :render-content="renderContent"
      :render-after-expand="renderAfterExpand"
      @node-expand="handleNodeExpand"
    />
    <div
      v-if="!root.childNodes || root.childNodes.length === 0"
      class="el-tree__empty-block"
    >
      <span
        class="el-tree__empty-text"
        :title="emptyText"
      >
        {{ emptyText }}
      </span>
    </div>
  </div>
</template>

<script>
  import { t } from '@/locale';
  import TreeStore from './model/tree-store';
  import ElTreeNode from './tree-node.vue';

  export default {
  name: 'ElTree',

  components: {
    ElTreeNode
  },

  inject: {
    select: {
      default: null
    }
  },

  props: {
    data: {
      type: Array
    },
    emptyText: {
      type: String,
      default() {
        return t('el.tree.emptyText');
      }
    },
    emitCurrentChangeOnlyOnLeaf: {
      type: Boolean,
      default: true
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default(props) {
        return !props.showCheckbox;
      }
    },
    checkOnClickNode: {
      type: Boolean,
      default: true
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    expandWhenChecked: {
      type: Boolean,
      default: true
    },
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Boolean,
      default(props) {
        return !props.showCheckbox;
      }
    },
    props: {
      default() {
        return {
          children: 'children',
          label: 'label',
          icon: 'icon',
          iconColor: 'iconColor',
          disabled: 'disabled'
        };
      }
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 24
    },
    rootIndent: {
      type: Number,
      default: 16
    },
    renderAfterExpand: {
      type: Boolean,
      default: false
    }
  },

  emits: ['node-expand'],

  data() {
    return {
      store: null,
      root: null,
      treeItems: null,
      checkboxItems: []
    };
  },

  computed: {
    children() {
      return this.data;
    },
    treeItemArray() {
      // Update tree item array and remove nodes that are not displayed but are rendered in page
      const currentTreeItems = Array.prototype.slice.call(this.treeItems);
      for (let i = currentTreeItems.length - 1; i >= 0; i--) {
        if (currentTreeItems[i].parentElement.parentElement.style.display === 'none') {
          currentTreeItems.splice(i, 1);
        }
      }
      return currentTreeItems;
    }
  },

  watch: {
    defaultCheckedKeys(newVal) {
      this.store.defaultCheckedKeys = newVal;
      this.store.setDefaultCheckedKey(newVal);
    },
    defaultExpandedKeys(newVal) {
      this.store.defaultExpandedKeys = newVal;
      this.store.setDefaultExpandedKeys(newVal);
    },
    data(newVal) {
      this.store.setData(newVal);
    },
    checkboxItems(val) {
      Array.prototype.forEach.call(val, (checkbox) => {
        checkbox.setAttribute('tabindex', -1);
      });
    }
  },

  created() {
    this.isTree = true;

    this.store = new TreeStore({
      tree: this,
      key: this.nodeKey,
      data: this.data,
      lazy: this.lazy,
      props: this.props,
      load: this.load,
      checkStrictly: this.checkStrictly,
      defaultCheckedKeys: this.defaultCheckedKeys,
      defaultExpandedKeys: this.defaultExpandedKeys,
      autoExpandParent: this.autoExpandParent,
      defaultExpandAll: this.defaultExpandAll,
      filterNodeMethod: this.filterNodeMethod,
      expandWhenChecked: this.expandWhenChecked
    });

    this.root = this.store.root;

    if (this.select) {
      this.select.tree = this;
    }
  },
  mounted() {
    this.initTabindex();
    if (this.select != null) {
      this.select.$on('remove-tag', this.handleRemoveTag);
    }
  },
  updated() {
    this.treeItems = this.$el.querySelectorAll('[role=itemcontent]');
    this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
  },

  methods: {
    filter(value) {
      if (!this.filterNodeMethod) {
        throw new Error('[Tree] filterNodeMethod is required when filter');
      }
      this.store.filter(value);
    },
    find(value) {
      return this.store.filter(value, (v, data) => {
        if (!v) return true;
        return data.label.toLowerCase().indexOf(v.toLowerCase()) !== -1;
      });
    },
    getNodeKey(node, index) {
      const nodeKey = this.nodeKey;
      if (nodeKey && node) {
        return node.data[nodeKey];
      }
      return index;
    },
    getCheckedNodes(mode) {
      return this.store.getCheckedNodes(mode);
    },
    getCheckedKeys(mode) {
      return this.store.getCheckedKeys(mode);
    },
    getHalfCheckedNodes() {
      return this.store.getHalfCheckedNodes();
    },
    getHalfCheckedKeys() {
      return this.store.getHalfCheckedKeys();
    },
    getCurrentNode() {
      const currentNode = this.store.getCurrentNode();
      return currentNode ? currentNode.data : null;
    },
    getCurrentKey() {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in getCurrentKey');
      }
      const currentNode = this.getCurrentNode();
      return currentNode ? currentNode[this.nodeKey] : null;
    },
    setCheckedNodes(nodes, leafOnly) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCheckedNodes');
      }
      this.store.setCheckedNodes(nodes, leafOnly);
    },
    setCheckedKeys(keys, leafOnly) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCheckedKeys');
      }
      this.store.setCheckedKeys(keys, leafOnly);
    },
    setChecked(data, checked, deep) {
      this.store.setChecked(data, checked, deep);
    },
    setCurrentNode(node) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCurrentNode');
      }
      this.store.setUserCurrentNode(node);
    },
    setCurrentKey(key) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCurrentKey');
      }
      this.store.setCurrentNodeKey(key);
    },
    handleNodeExpand(nodeData, node, instance) {
      eventBus.$emit('el.tree.node.expand', node);
      // this.broadcast('ElTreeNode', 'tree-node-expand', node);
      this.$emit('node-expand', nodeData, node, instance);
    },
    updateKeyChildren(key, data) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in updateKeyChild');
      }
      this.store.updateChildren(key, data);
    },
    initTabindex() {
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=itemcontent]');
      this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
      const checkedItem = this.$el.querySelectorAll('.is-checked[role=treeitem]');
      if (checkedItem.length) {
        checkedItem[0].setAttribute('tabindex', 0);
      }
    },
    navigateOptions(direction, node) {
      if (node.className.indexOf('el-tree-node') === -1) return;
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=itemcontent]');
      let itemContent = this.treeItemArray;
      itemContent = Array.prototype.slice.call(itemContent);
      let currentIndex = itemContent.indexOf(node);
      let nextIndex;
      if (direction === 'next') { // up
        nextIndex = (currentIndex < this.treeItemArray.length - 1) ? currentIndex + 1 : 0;
        if (this.treeItemArray.some((item) => item.offsetParent)) {
          while (!this.treeItemArray[nextIndex].offsetParent) {
            currentIndex = nextIndex;
            nextIndex = (currentIndex < this.treeItemArray.length - 1) ? currentIndex + 1 : 0;
          }
        }
      } else {
        nextIndex = currentIndex !== 0 ? currentIndex - 1 : this.treeItemArray.length - 1;
        if (this.treeItemArray.some((item) => item.offsetParent)) {
          while (!this.treeItemArray[nextIndex].offsetParent) {
            currentIndex = nextIndex;
            nextIndex = currentIndex !== 0 ? currentIndex - 1 : this.treeItemArray.length - 1;
          }
        }
      }
      this.treeItemArray[nextIndex].focus();
    },
    expandOption(node) {
      const expandIcon = node.querySelector('.el-tree-node__expand-icon');
      expandIcon.click();
    },
    checkOption(node) {
      const hasInput = node.querySelector('[type="checkbox"]');
      if (hasInput) {
        hasInput.click();
      } else {
        this.expandOption(node);
      }
    },
    handleRemoveTag(option) {
      option.node.setChecked(false, true, true, false);
    },
    append(data, parentData) {
      if (!data) {
        throw new Error('[Tree] Data is required in append');
      }
      this.store.append(data, parentData);
    },
    insertBefore(data, refData) {
      if (!refData) {
        throw new Error('[Tree] Reference data is required in insertBefore');
      }
      this.store.insertBefore(data, refData);
    },
    insertAfter(data, refData) {
      if (!refData) {
        throw new Error('[Tree] Reference data is required in insertAfter');
      }
      this.store.insertAfter(data, refData);
    },
    remove(data) {
      if (!data) {
        throw new Error('[Tree] Data is required in remove');
      }
      this.store.remove(data);
    },
    setExpandedNodes(aData, isStrict, callback) {
      if (!aData) {
        throw new Error('[Tree] Data is required in setExpandedNodes');
      }
      this.store.setExpandedNodes(aData, isStrict, callback);
    },
    getExpandedNodes(isStrict) {
      return this.store.getExpandedNodes(isStrict);
    }
  }
};
</script>
