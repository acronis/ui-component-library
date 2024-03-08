<template>
  <div
    v-show="nodeModel.visible"
    class="el-tree-node"
    :title="nodeModel.label"
    :class="{
      'is-disabled': disabled,
      'is-expanded': expanded,
      'is-hidden': !nodeModel.visible,
      'is-checkable': showCheckbox
    }"
    role="treeitem"
    :aria-expanded="expanded"
    :aria-disabled="nodeModel.disabled"
    :aria-checked="nodeModel.checked"
    @click.stop="handleClick"
    @keyup.right.stop.prevent="handleExpandIconClick"
    @keyup.left.stop.prevent="handleExpandIconClick"
    @keydown.enter.stop="handleClick"
    @keydown.tab.stop="handleTab"
  >
    <div
      class="el-tree-node__content"
      :style="{ 'padding-left': `${(nodeModel.level - 1) * tree.indent + tree.rootIndent}px` }"
      :class="['is-focusable',{
        'is-current': isNodeCurrent,
        'is-focus': isFocus
      }]"
      role="itemcontent"
      tabindex="0"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <node-icon :node="nodeModel" />
      <el-checkbox
        v-if="showCheckbox"
        v-model="nodeModel.checked"
        :indeterminate="nodeModel.indeterminate"
        :disabled="disabled"
        @click.stop
        @keydown.stop
        @change="handleCheckChange"
      />
      <el-icon
        v-if="nodeModel.icon"
        :name="nodeModel.icon"
        :color="nodeModel.iconColor"
        class="el-tree-node__customized-icon"
      />
      <span
        v-if="nodeModel.loading"
        v-loading="nodeModel.loading"
        class="el-tree-node__loading"
        tabindex="0"
      />
      <node-content :node="nodeModel" />
    </div>
    <div
      v-if="childNodeRendered && expanded"
      class="el-tree-node__children"
      role="group"
      :aria-expanded="expanded"
    >
      <el-tree-node
        v-for="child in nodeModel.childNodes"
        :key="getNodeKey(child)"
        :render-content="renderContent"
        :render-after-expand="renderAfterExpand"
        :node="child"
        :props="props"
        @node-expand="handleChildNodeExpand"
      />
    </div>
  </div>
</template>

<script lang="jsx">
import { h } from 'vue';

import ElCheckbox from 'packages/checkbox';
import ElIcon from 'packages/icon';
import Loading from 'packages/loading/src/directive';
import TabFocusable from '@/mixins/tab-focusable';
import Highlight from 'packages/highlight/src/directive';
import eventBus from '@/utils/eventBus';

export default {
  name: 'ElTreeNode',

  componentName: 'ElTreeNode',

  components: {
    ElIcon,
    ElCheckbox,
    NodeIcon: {
      props: {
        node: { required: true }
      },
      components: {
        ElIcon
      },
      render() {
        const parent = this.$parent;
        const tree = parent.tree;
        const node = this.nodeModel;
        const data = node?.data;
        let tmpl;

        if (data?.isLeaf) {
          node.isLeaf = data.isLeaf;
        }

        if (tree.$slots.icon) {
          tmpl = (
            tree.$slots.icon({ node, data })
          );
        } else {
          tmpl = (
              <el-icon
                name="i-chevron-right--16"
                class={{
                  'el-tree-node__expand-icon': true,
                  'el-tree-node__expand-icon--leaf': node?.isLeaf,
                  'el-tree-node__expand-icon--expanded': !node?.isLeaf && node?.expanded
                }}
              />
          );
        }
        return tmpl;
      },
      mounted() {
        this.$el.addEventListener('click', (event) => {
          event.stopPropagation();
          this.$parent.handleExpandIconClick();
        });
      }
    },
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      directives: {
        Highlight
      },
      render() {
        const parent = this.$parent;
        const tree = parent.tree;
        const node = this.nodeModel;
        const data = node?.data;
        const store = node?.store;

        let tmpl;

        if (parent.renderContent) {
          tmpl = parent.renderContent.call(parent._renderProxy, h, {
            _self: tree.$vnode.context,
            node,
            data,
            store
          });
        } else if (tree.$slots.default) {
          tmpl = tree.$slots.default({ node, data });
        } else if (data.to && !data.disabled && !this.disabled) {
          tmpl = <router-link class="el-tree-node__link" tabindex="-1" to={data.to}>
            <span v-highlight={node.keyword}>
              {node.label}
            </span>
          </router-link>;
        } else if (data.href && !data.disabled && !this.disabled) {
          tmpl = <a class="el-tree-node__link" tabindex="-1" href={data.href}>
            <span v-highlight={node.keyword}>
              {node.label}
            </span>
          </a>;
        } else {
          tmpl = <span class="el-tree-node__label" tabindex="-1">
            <span v-highlight={node.keyword}>
              {node.label}
            </span>
          </span>;
        }

        return tmpl;
      }
    }
  },

  directives: {
    loading: Loading
  },

  mixins: [TabFocusable],

  inject: {
    select: {
      default: null
    }
  },

    props: {
      node: {
        type: Object,
        default() {
          return {};
        }
      },
      props: {
        type: Object,
        default() {
          return {};
        }
      },
      renderContent: {
        type: Function,
        default: () => {}
      },
      renderAfterExpand: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        nodeModel: this.node,
        tree: null,
        expanded: false,
        childNodeRendered: this.renderAfterExpand,
        showCheckbox: false,
        oldChecked: null,
        oldIndeterminate: null
      };
    },

  computed: {
    value() {
      return this.nodeModel.data.value;
    },

    label() {
      return this.nodeModel.data[this.props.label];
    },

    icon() {
      return this.nodeModel.data[this.props.icon];
    },

    iconColor() {
      return this.nodeModel.data[this.props.iconColor];
    },

    disabled() {
      if (this.nodeModel.childNodes && this.nodeModel.childNodes.length > 0) {
        let areAllChildrenDisabled = false;
        this.nodeModel.childNodes.forEach((node) => {
          if (!node.disabled) {
            areAllChildrenDisabled = true;
          }
        });
        return this.nodeModel.data.disabled || this.nodeModel.disabled || (!areAllChildrenDisabled);
      }
      return this.nodeModel.data.disabled || this.nodeModel.disabled;
    },

    itemSelected() {
      return this.nodeModel.checked || this.nodeModel.indeterminate;
    },

    currentLabel() {
      return this.label || this.value || '';
    },

    isNodeCurrent() {
      return this.highlight && this.tree.store.currentNode === this.nodeModel;
    }
  },

  watch: {
    node(newVal) {
      this.nodeModel = newVal;
    },
    'node.indeterminate': function (val) {
      this.handleSelectChange(this.nodeModel.checked, val);
    },

    'node.checked': function (val) {
      this.handleSelectChange(val, this.nodeModel.indeterminate);
    },

      'node.expanded'(val) {
        this.expanded = val;
        this.$nextTick(() => {
          this.expanded = val;
        });
        if (val) {
          this.childNodeRendered = true;
        }
      },

    'node.store.query': function (val) {
      this.nodeModel.keyword = val;
    }
  },

  created() {
    const parent = this.$parent;

    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }

    const tree = this.tree;
    if (!tree) {
      console.warn('Can not find node\'s tree.');
    }

    const props = tree.props || {};
    const childrenKey = props.children || 'children';

    this.$watch(`node.data.${childrenKey}`, () => {
      this.nodeModel.updateChildren();
    });

    this.showCheckbox = tree.showCheckbox;
    this.highlight = tree.highlight;

    this.expanded = this.nodeModel.expanded;

      if (this.expanded) {
        this.childNodeRendered = true;
      }

      if (this.tree.accordion) {
        eventBus.$on('el.tree.node.expand', (node) => {
          if (this.nodeModel !== node) {
            this.nodeModel.collapse();
          }
        });
      }
      const isCached = this.select && this.select.cachedOptions.find((option) => option.value === this.value);
      if (this.select !== null && !isCached) {
        this.select.options.push(this);
        this.select.cachedOptions.push(this);
        this.select.optionsCount++;
        this.select.filteredOptionsCount++;
      }

      if (this.node.checked) {
        this.handleSelectChange(true, this.node.indeterminate);
      }
    },
    methods: {
      setCurrentNodeToSelf() {
        this.tree.store.setCurrentNode(this.nodeModel);

      eventBus.$emit('el.select.handleTreeNodeSelect', this);
      // this.dispatch('ElSelect', 'handleTreeNodeSelect', this);
    },

    handleClick() {
      if (this.disabled) {
        return;
      }
      this.tree.$emit('node-click', this.nodeModel.data, this.nodeModel, this);
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }

      // mark leaf node an current node
      // only mark leaf node as checked on node click. Non-leaf node should be checked by clicking checkbox
      if (this.nodeModel.isLeaf) {
        this.setCurrentNodeToSelf();
        if (this.showCheckbox && this.tree.checkOnClickNode) {
          this.nodeModel.setChecked(!this.nodeModel.checked, !this.tree.checkStrictly);
        }
      } else if (!this.tree.emitCurrentChangeOnlyOnLeaf) {
        this.setCurrentNodeToSelf();
      }
    },

    handleTab() {
      if (this.disabled && !this.expanded) {
        this.nodeModel.expand();
        this.$emit('node-expand', this.nodeModel.data, this.nodeModel, this);
      }
    },

    contains(arr = [], target) {
      return arr.indexOf(target) > -1;
    },

    getNodeKey(node, index) {
      const nodeKey = this.tree.nodeKey;
      if (nodeKey && node) {
        return node.data[nodeKey];
      }
      return index;
    },

    handleSelectChange(checked, indeterminate) {
      if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
        this.tree.$emit('check-change', this.nodeModel.data, checked, indeterminate);
        eventBus.$emit('el.select.handleTreeNodeSelect', this);
        // this.dispatch('ElSelect', 'handleTreeNodeSelect', this);
      }
      this.oldChecked = checked;
      this.indeterminate = indeterminate;
    },

    handleExpandIconClick() {
      if (this.nodeModel.isLeaf) return;
      if (this.expanded) {
        this.tree.$emit('node-collapse', this.nodeModel.data, this.nodeModel, this);
        this.nodeModel.collapse();
      } else {
        this.nodeModel.expand();
        this.$emit('node-expand', this.nodeModel.data, this.nodeModel, this);
      }
    },

    handleCheckChange(value, ev) {
      this.nodeModel.setChecked(ev.target.checked, !this.tree.checkStrictly);
      this.$nextTick(() => {
        const { store } = this.tree;
        this.tree.$emit('check', this.nodeModel.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys()
        });
      });
    },

    handleChildNodeExpand(nodeData, node, instance) {
      eventBus.$emit('el.tree.node.expand', node);
      // this.broadcast('ElTreeNode', 'tree-node-expand', node);
      this.tree.$emit('node-expand', nodeData, node, instance);
    },

    handleMouseEnter() {
      eventBus.$emit('el.tree.node.enter', this.nodeModel);
    },

    handleMouseLeave() {
      eventBus.$emit('el.tree.node.leave', this.nodeModel);
    }
  }
};
</script>
