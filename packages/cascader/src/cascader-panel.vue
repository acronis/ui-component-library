<template>
  <div
    class="el-cascader-panel"
    @keydown="handleKeyDown"
  >
    <cascader-menu
      v-for="(menu, index) in menus"
      :key="index"
      ref="menu"
      :index="index"
      :nodes="menu"
    ></cascader-menu>
  </div>
</template>

<script>
import merge from '@/utils/merge';
import {
  noop,
  isEqual,
  isEmpty,
  valueEquals
} from '@/utils/util';
import CascaderMenu from './cascader-menu.vue';
import Store from './store';


const DefaultProps = {
  lazy: false,
  lazyLoad: noop,
  value: 'value',
  label: 'label',
  children: 'children',
  leaf: 'leaf',
  disabled: 'disabled'
};

const isLeaf = (el) => !el.getAttribute('aria-owns');

const getSibling = (el, distance) => {
  const { parentNode } = el;
  if (parentNode) {
    const siblings = parentNode.querySelectorAll('.el-cascader-node[tabindex="-1"]');
    const index = Array.prototype.indexOf.call(siblings, el);
    return siblings[index + distance] || null;
  }
  return null;
};

const getMenuIndex = (el) => {
  if (!el) return;
  const pieces = el.id.split('-');
  return Number(pieces[pieces.length - 2]);
};

const focusNode = (el) => {
  if (!el) return;
  el.focus();
  !isLeaf(el) && el.click();
};

const checkNode = (el) => {
  if (!el) return;
  if (isLeaf(el)) {
    el.click();
  }
};

export default {
  name: 'ElCascaderPanel',

  components: {
    CascaderMenu
  },

  props: {
    value: {},
    options: Array,
    props: Object,
    renderLabel: Function
  },

  provide() {
    return {
      panel: this
    };
  },

  data() {
    return {
      checkedValue: null,
      checkedNodePaths: [],
      store: [],
      menus: [],
      activePath: [],
      loadCount: 0
    };
  },

  computed: {
    config() {
      return merge({ ...DefaultProps }, this.props || {});
    },
    renderLabelFn() {
      return this.renderLabel || this.$slots.default;
    }
  },

  watch: {
    options: {
      handler: function () {
        this.initStore();
      },
      immediate: true,
      deep: true
    },
    checkedValue(val) {
      if (!isEqual(val, this.value)) {
        this.$emit('input', val);
        this.$emit('change', val);
      }
    }
  },

  methods: {
    initStore() {
      const { config, options } = this;
      if (config.lazy && isEmpty(options)) {
        this.lazyLoad();
      } else {
        this.store = new Store(options, config);
        this.menus = [this.store.getNodes()];
      }
    },
    handleKeyDown(e) {
      const { target, keyCode } = e;

      switch (keyCode) {
        case 38:
          focusNode(getSibling(target, -1));
          break;
        case 40:
          focusNode(getSibling(target, 1));
          break;
        case 37:
          if (this.$refs.menu[getMenuIndex(target) - 1]) {
            const expandedNode = this.$refs.menu[getMenuIndex(target) - 1].$el.querySelector('.el-cascader-node[aria-expanded="true"]');
            focusNode(expandedNode);
          }
          break;
        case 39:
          if (this.$refs.menu[getMenuIndex(target) + 1]) {
            const firstNode = this.$refs.menu[getMenuIndex(target) + 1].$el.querySelector('.el-cascader-node[tabindex="-1"]');
            focusNode(firstNode);
          }
          break;
        case 13:
          checkNode(target);
          break;
        case 27:
        case 9:
          this.$emit('close');
          break;
        default:
      }
    },
    reset() {
      const menus = this.menus.slice(0, 1);
      this.menus = menus;
      this.activePath = [];
    },
    handleExpand(node, silent) {
      const { activePath } = this;
      const { level } = node;
      const path = activePath.slice(0, level - 1);
      const menus = this.menus.slice(0, level);

      if (!node.isLeaf) {
        path.push(node);
        menus.push(node.children);
      }

      this.activePath = path;
      this.menus = menus;

      if (!silent) {
        const pathValues = path.map((part) => part.getValue());
        const activePathValues = activePath.map((part) => part.getValue());
        if (!valueEquals(pathValues, activePathValues)) {
          this.$emit('expand-change', pathValues);
        }
      }
    },
    handleCheckChange(value) {
      this.checkedValue = value;
      this.$emit('close');
    },
    lazyLoad(node, onFullfiled) {
      const { config } = this;
      let localNode = node;
      if (!node) {
        localNode = node || { root: true, level: 0 };
        this.store = new Store([], config);
        this.menus = [this.store.getNodes()];
      }
      localNode.loading = true;
      const resolve = (dataList) => {
        const parent = localNode.root ? null : localNode;
        dataList && dataList.length && this.store.appendNodes(dataList, parent);
        localNode.loading = false;
        localNode.loaded = true;
        onFullfiled && onFullfiled(dataList);
      };
      config.lazyLoad(localNode, resolve);
    }
  }
};
</script>
