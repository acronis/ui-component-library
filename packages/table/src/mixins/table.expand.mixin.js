import { getKeysMap, getRowIdentity, toggleRowStatus, walkTreeNode } from 'packages/table/src/table-utils';

export default {
  props: {
    // Tree and expand props
    expandRowKeys: Array,

    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    // rename to treeIndent
    indent: {
      type: Number,
      default: 32
    },

    treeProps: {
      type: Object,
      default() {
        return {
          hasChildren: 'hasChildren',
          children: 'children'
        };
      }
    },

    lazy: {
      type: Boolean,
      default: false
    },

    load: Function
  },
  data() {
    return {
      isExpandable: false,
      lazyColumnIdentifier: this.treeProps.hasChildren,
      childrenColumnName: this.treeProps.children,
      expandRows: [],
      treeData: {},
      lazyTreeNodeMap: {}
    };
  },
  computed: {
    expandSlot() {
      return this.$scopedSlots.expand || this.renderExpanded;
    },

    // Embedded data, watch cannot detect changes https:github.comElemeFEelementissues14998
    // TODO: Using computed to solve this problem, will it cause performance problems?
    // @return { id: { level, children } }
    normalizedData() {
      if (!this.rowKey) return {};
      const data = this.data || [];
      return this.normalize(data);
    },
    // @return { id: { children } }
    // For lazy loading, no nested data is processed
    normalizedLazyNode() {
      const { rowKey, lazyTreeNodeMap, lazyColumnIdentifier } = this;
      const keys = Object.keys(lazyTreeNodeMap);
      const res = {};
      if (!keys.length) return res;
      keys.forEach((key) => {
        if (lazyTreeNodeMap[key].length) {
          const item = { children: [] };
          lazyTreeNodeMap[key].forEach((row) => {
            const currentRowKey = getRowIdentity(row, rowKey);
            item.children.push(currentRowKey);
            if (row[lazyColumnIdentifier] && !res[currentRowKey]) {
              res[currentRowKey] = { children: [] };
            }
          });
          res[key] = item;
        }
      });
      return res;
    }
  },

  watch: {
    normalizedData: {
      deep: true,
      immediate: true,
      handler() { this.updateTreeData(); }
    },
    normalizedLazyNode: 'updateTreeData',

    expandRowKeys: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.setExpandRowKeysAdapter(newVal);
        }
      }
    },

    defaultExpandAll: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.updateExpandRows();
        }
      }
    }
  },

  methods: {
    updateExpandRows() {
      const { data = [], rowKey, defaultExpandAll, expandRows } = this;

      if (defaultExpandAll) {
        this.expandRows = data.slice();
      } else if (rowKey) {
        // TODO：The code here can be optimized
        const expandRowsMap = getKeysMap(expandRows, rowKey);
        this.expandRows = data.reduce((prev, row) => {
          const rowId = getRowIdentity(row, rowKey);
          const rowInfo = expandRowsMap[rowId];
          if (rowInfo) {
            prev.push(row);
          }
          return prev;
        }, []);
      } else {
        this.expandRows = [];
      }
    },

    __toggleRowExpansion(row, expanded) {
      const changed = toggleRowStatus(this.expandRows, row, expanded);
      if (changed) {
        this.$emit('expand-change', row, this.expandRows.slice());
        this.debouncedUpdateLayout();
        this.updateTableBody();
      }
    },

    setExpandRowKeys(rowKeys) {
      this.__assertRowKey();
      // TODO：The code here can be optimized
      const { data, rowKey } = this;
      const keysMap = getKeysMap(data, rowKey);
      this.expandRows = rowKeys.reduce((prev, cur) => {
        const info = keysMap[cur];
        if (info) {
          prev.push(info.row);
        }
        return prev;
      }, []);
    },

    isRowExpanded(row) {
      const { expandRows = [], rowKey } = this;
      if (rowKey) {
        const expandMap = getKeysMap(expandRows, rowKey);
        return !!expandMap[getRowIdentity(row, rowKey)];
      }
      return expandRows.indexOf(row) !== -1;
    },

    // tree
    normalize(data) {
      const {
        childrenColumnName,
        lazyColumnIdentifier,
        rowKey,
        lazy
      } = this;
      const res = {};
      walkTreeNode(
        data,
        (parent, children, level) => {
          const parentId = getRowIdentity(parent, rowKey);
          if (Array.isArray(children)) {
            res[parentId] = {
              children: children.map((row) => getRowIdentity(row, rowKey)),
              level
            };
          } else if (lazy) {
            // When children does not exist and lazy is true, the node is a lazy loaded node
            res[parentId] = {
              children: [],
              lazy: true,
              level
            };
          }
        },
        childrenColumnName,
        lazyColumnIdentifier
      );
      return res;
    },

    updateTreeData() {
      const nested = this.normalizedData;
      const normalizedLazyNode = this.normalizedLazyNode;
      const keys = Object.keys(nested);
      const newTreeData = {};
      if (keys.length) {
        const {
          treeData: oldTreeData,
          defaultExpandAll,
          expandRowKeys,
          lazy
        } = this;
        const rootLazyRowKeys = [];
        const getExpanded = (oldValue, key) => {
          const included = defaultExpandAll
            || (expandRowKeys && expandRowKeys.indexOf(key) !== -1);
          return !!((oldValue && oldValue.expanded) || included);
        };
        // Combine expanded and display to ensure that the state remains the same after the data is refreshed
        keys.forEach((key) => {
          const oldValue = oldTreeData[key];
          const newValue = { ...nested[key] };
          newValue.expanded = getExpanded(oldValue, key);
          if (newValue.lazy) {
            const { loaded = false, loading = false } = oldValue || {};
            newValue.loaded = !!loaded;
            newValue.loading = !!loading;
            rootLazyRowKeys.push(key);
          }
          newTreeData[key] = newValue;
        });
        // Update based on lazy loading data treeData
        const lazyKeys = Object.keys(normalizedLazyNode);
        if (lazy && lazyKeys.length && rootLazyRowKeys.length) {
          lazyKeys.forEach((key) => {
            const oldValue = oldTreeData[key];
            const lazyNodeChildren = normalizedLazyNode[key].children;
            if (rootLazyRowKeys.indexOf(key) !== -1) {
              // Lazily loaded root node, update the original data, the original children must be an empty array
              if (newTreeData[key].children.length !== 0) {
                throw new Error('[ElTable]children must be an empty array.');
              }
              newTreeData[key].children = lazyNodeChildren;
            } else {
              const { loaded = false, loading = false } = oldValue || {};
              newTreeData[key] = {
                lazy: true,
                loaded: !!loaded,
                loading: !!loading,
                expanded: getExpanded(oldValue, key),
                children: lazyNodeChildren,
                level: ''
              };
            }
          });
        }
      }
      this.treeData = newTreeData;
      this.updateScrollY();
    },

    updateTreeExpandKeys(value) {
      this.expandRowKeys = value;
      this.updateTreeData();
    },

    __toggleTreeExpansion(row, expanded) {
      this.__assertRowKey();

      const { rowKey, treeData } = this;
      const id = getRowIdentity(row, rowKey);
      const data = id && treeData[id];
      if (id && data && ('expanded' in data)) {
        const oldExpanded = data.expanded;
        const isExpanded = typeof expanded === 'undefined' ? !data.expanded : expanded;
        treeData[id].expanded = isExpanded;
        if (oldExpanded !== isExpanded) {
          this.$emit('expand-change', row, isExpanded);
        }
        this.updateScrollY();
      }
    },

    loadOrToggle(row) {
      this.__assertRowKey();
      const { lazy, treeData, rowKey } = this;
      const id = getRowIdentity(row, rowKey);
      const data = treeData[id];
      if (lazy && data && 'loaded' in data && !data.loaded) {
        this.loadData(row, id, data);
      } else {
        this.__toggleTreeExpansion(row);
      }
    },

    loadData(row, key, treeNode) {
      const { load, lazyTreeNodeMap, treeData } = this;
      if (load && !treeData[key].loaded) {
        treeData[key].loading = true;
        load(row, treeNode, (data) => {
          if (!Array.isArray(data)) {
            throw new Error('[ElTable] data must be an array');
          }

          this.$set(this.treeData, key, {
            ...treeData[key],
            loading: false,
            loaded: true,
            expanded: true
          });
          if (data.length) {
            this.$set(lazyTreeNodeMap, key, data);
          }
          this.$emit('expand-change', row, true);
        });
      }
    },

    // Adaptation layer, expand-row-keys are used in Expand and TreeTable
    setExpandRowKeysAdapter(val) {
      // This will trigger additional calculations,
      // but for compatibility, do so temporarily
      this.setExpandRowKeys(val);
      this.updateTreeExpandKeys(val);
    },

    // Expand row and TreeTable must be used
    // TODO make expand and tree work at once
    toggleRowExpansion(row, expanded) {
      if (this.expandSlot) {
        this.__toggleRowExpansion(row, expanded);
      } else {
        this.__toggleTreeExpansion(row, expanded);
      }
    }
  }
};
