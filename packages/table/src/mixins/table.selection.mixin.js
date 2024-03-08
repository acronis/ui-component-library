import { getRowIdentity } from 'packages/table/src/table-utils';
import { debounce } from 'throttle-debounce';

export default {
  props: {
    isSelectable: { type: [Boolean, Function], default: true },
    // TODO change to selectionMode: ['none','single','multi']
    multiSelectionMode: { type: Boolean, default: true },
    selectByRow: { type: Boolean, default: false },
    selected: {
      type: Array,
      default: () => ([])
    },
    selectedIds: { type: Array },
    selectOnIndeterminate: { type: Boolean, default: true },
    // TODO check with showSelection table-column prop
    selectionEnabled: { type: Boolean, default: false },
    allowDisabledSelection: { type: Boolean, default: false }
  },

  created() {
    this.toggleAllSelection = debounce(10, this.__toggleAllSelection);
  },

  data() {
    return {
      reserveSelection: false, // TODO make table property
      selection: [],
      internalSelectedIds: [], // selected ids that are not depending on current table data
      // TODO remove
      selectable: null
    };
  },

  computed: {
    multiSelectionModeState() {
      return this.multiSelectionMode || (this.selection?.length >= 1);
    },

    selectableGroups() {
      return this.rowsGroups?.reduce((res, group) => {
        res[group.groupId] = group.groupData.map(this.getRowKey);
        return res;
      }, {});
    },

    selectableKeys() {
      const { rowIsSelectable, rowIsDisabled, getRowKey, data } = this;
      if (this.allowDisabledSelection) {
        if (this.selectedIds) {
          return [
            ...data?.filter(rowIsSelectable),
            ...data?.filter(rowIsDisabled).filter((row) => this.selectedIds.includes(this.getRowKey(row)))
          ].map(getRowKey);
        }
        return data?.map(getRowKey);
      }
      return data?.filter(rowIsSelectable)
        .map(getRowKey) || [];
    },

    selectedGroups() {
      return Object.keys(this.selectableGroups)?.reduce((res, groupId) => {
        res[groupId] = !!this.isRowGroupSelected(groupId);
        return res;
      }, {});
    },

    selectedSomeGroups() {
      return Object.keys(this.selectableGroups)?.reduce((res, groupId) => {
        res[groupId] = !!this.isRowGroupSomeSelected(groupId);
        return res;
      }, {});
    },

    getRowKey() {
      return (row) => getRowIdentity(row, this.rowKey);
    },

    selectedKeys() {
      return this.selection.map(this.getRowKey);
    },

    hasSelectableKeys() {
      return !!this.selectableKeys.length;
    },

    allRowsSelected() {
      return this.selection.length > 0 && this.getSelectionKeys().length === this.selection.length;
    }
  },

  methods: {
    cleanSelection() {
      if (this.reserveSelection) return;

      const { selection, rowKey, tableData, selectedKeys, selectableKeys } = this;
      let deletedIds;
      if (rowKey) {
        deletedIds = [];
        selectedKeys.forEach((key) => {
          if (selectableKeys.indexOf(key) > -1) {
            deletedIds.push(key);
          }
        });
      } else {
        deletedIds = selection
          .filter((item) => tableData.indexOf(item) === -1)
          .map(this.getRowKey);
      }

      if (deletedIds.length) {
        this.__updateSelection(selection.filter(
          (item) => deletedIds.indexOf(this.getRowKey(item)) === -1
        ));
      }
    },

    // TODO split internal and public api, add unit tests
    clearSelection(force = true) {
      if (this.reserveSelection && !force) return;
      let selection = [];
      if (this.allowDisabledSelection && this.selectedIds && this.selectedIds.length) {
        selection = this.selection.filter((row) => this.selectedIds.includes(this.getRowKey(row)));
      }
      if (this.selection.length) {
        const rowKeys = this.selectedKeys;
        this.__updateSelection(selection);
        this.internalSelectedIds = this.internalSelectedIds.filter((id) => !rowKeys.includes(id));
      }
    },

    isRowSelected(key) {
      return this.selectedKeys?.indexOf(key) > -1;
    },

    isRowGroupSelected(groupKey) {
      return !!(this.selectableGroups[groupKey]?.length
        && this.selectedKeys.length
        && this.selectableGroups[groupKey].every((rowId) => this.isRowSelected(rowId)));
    },

    isRowGroupSomeSelected(groupKey) {
      return this.selectableGroups[groupKey]?.length
        && this.selectableGroups[groupKey].find((rowId) => this.isRowSelected(rowId));
    },

    isRowInSelectableGroup(rowId) {
      return Object.keys(this.selectableGroups).find((groupId) => {
        return this.selectableGroups[groupId].indexOf(rowId) > -1;
      });
    },

    rowIsSelectable(row, rowIndex) {
      const { selectable: isSelectable } = this;

      return isSelectable instanceof Function
        ? isSelectable.call(null, row, rowIndex)
        : !!isSelectable;
    },

    rowIsDisabled(row, rowIndex) {
      const { selectable: isSelectable } = this;
      return isSelectable instanceof Function
        ? !isSelectable.call(null, row, rowIndex)
        : !isSelectable;
    },

    selectAllRows() {
      const { selectableKeys } = this;
      if (selectableKeys.length === 0) return;

      // TODO update to selected all keys
      this.__selectRowsByIds(selectableKeys, true);
      this.internalSelectedIds = selectableKeys;
    },

    selectRowGroup(rowGroupId) {
      const rowIds = this.selectableGroups[rowGroupId];
      this.internalSelectedIds = this.internalSelectedIds
        .filter((id) => !rowIds.includes(id));
      rowIds.length && this.__selectRowsByIds(rowIds, !this.isRowGroupSelected(rowGroupId));
    },

    selectRows(rows, add = true) {
      const rowKeys = rows.map((row) => this.getRowKey(row));

      this.__selectRowsByIds(rowKeys, add);
    },

    toggleRowSelection(row, selected, emitChange = true) {
      if (!selected) {
        this.internalSelectedIds = this.internalSelectedIds.filter((id) => id !== this.getRowKey(row));
      }
      this.__selectRowsByIds([this.getRowKey(row)], selected);

      if (emitChange) {
        // Call the API to modify the selected value without triggering the select event
        this.$emit('select', this.selection.slice(), row);
      }
    },

    // TODO check usage
    toggleRowSelectionById(rowKey, selected) {
      this.__selectRowsByIds([rowKey], selected);
    },

    __calcSelection(dataChanged) {
      if (this.reserveSelection && dataChanged) {
        try {
          this.__assertRowKey();

          const dataSelectedKeys = this.selectedKeys.filter((n) => {
            return this.selectableKeys.indexOf(n) !== -1;
          });

          this.__selectRowsByIds(dataSelectedKeys, true, true);
        } catch (e) {
          this.clearSelection();
        }
      } else if (this.reserveSelection && this.internalSelectedIds.length) {
        this.__selectRowsByIds(this.internalSelectedIds, true, true);
      } else if (dataChanged) {
        this.clearSelection();
      } else {
        this.cleanSelection();
      }
    },

    getSelectionKeys() {
      if (this.lazy || Object.keys(this.treeData).length) {
        const treeDataKeys = Object.values(this.treeData).map((node) => node.children).flat();
        return [...this.selectableKeys, ...treeDataKeys];
      }
      return this.selectableKeys;
    },

    getTabledata() {
      if (this.lazy) {
        return [...this.tableData, ...Object.values(this.lazyTreeNodeMap).flat()];
      }

      if (Object.keys(this.treeData).length) {
        const data = [];
        const traverse = (node) => {
          data.push(node);
          if (node.children?.length) {
            for (const childNode of node.children) {
              traverse(childNode);
            }
          }
        };
        for (const node of this.tableData) {
          traverse(node);
        }
        return data;
      }
      return this.tableData;
    },

    /**
     * Select or toggle selected rows
     * @param ids - array of row keys
     * @param addition
     * @param replace
     */
    __selectRowsByIds(ids, addition, replace) {
      if (!ids) return;
      const rowKeys = ids.map((id) => id.toString());
      const { selectableKeys: dataKeys, rowKey, selectedKeys, internalSelectedIds } = this;
      if (dataKeys.length === 0 || !rowKey) return;
      const selectedIds = new Set(selectedKeys);
      const availableIdsList = [
        ...rowKeys,
        ...selectedIds,
        ...internalSelectedIds
      ];
      let availableIds = new Set(availableIdsList);
      const selectableKeys = this.getSelectionKeys();
      if (availableIdsList.length !== selectableKeys.length) {
        availableIds = new Set(availableIdsList.filter((x) => new Set(selectableKeys).has(x)));
      }
      const replaceIds = new Set();
      if (replace) {
        dataKeys
          .filter((key) => internalSelectedIds.includes(key))
          .forEach(replaceIds.add, replaceIds);
      }
      const newIds = new Set(replace ? [...replaceIds] : [...selectedIds, ...internalSelectedIds]);
      let deletedIds = new Set();
      if (rowKeys.length) {
        for (let i = 0, j = rowKeys.length; i < j; i++) {
          const id = rowKeys[i];
          if (
            newIds.has(id)
            && (!addition || !availableIds.has(id))
          ) {
            selectedIds.has(id) && deletedIds.add(id);
            newIds.delete(id);
          } else if (availableIds.has(id)) {
            newIds.add(id);
          }
        }
      } else {
        deletedIds = new Set(availableIds);
      }

      // Check if it is need to change selected ids
      if (selectedIds.size !== newIds.size || new Set([...selectedIds, ...newIds]).size !== selectedIds.size) {
        // Save only vacant ids without removed to save selection state between data changes
        const notInDataNorRemovedIds = new Set([...newIds, ...internalSelectedIds]);

        [...deletedIds].forEach(function (v) {
            notInDataNorRemovedIds.delete(v);
        });

        const tableData = this.getTabledata();
        this.__updateSelection(
          tableData
            .filter((row) => newIds.has(this.getRowKey(row)))
        );
      }
    },

    __toggleAllSelection() {
      const {
        allRowsSelected,
        selection,
        selectOnIndeterminate
      } = this;
      const selectableKeys = this.getSelectionKeys();
      // when only some rows are selected (but not all), select or deselect all of them
      // depending on the value of selectOnIndeterminate
      // TODO delete selectOnIndeterminate
      if (allRowsSelected === false) {
        const value = selectOnIndeterminate
          ? !allRowsSelected
          : !(allRowsSelected || selection.length);

        this.__selectRowsByIds(selectableKeys, value);
      } else {
        this.clearSelection(true);
      }

      this.$emit('select-all', this.selection.slice());
    },

    __updateSelection(selection) {
      this.selection = selection;
    }
  },

  watch: {
    selectedIds: {
      immediate: true,
      async handler(value) {
        await this.$nextTick();
        this.__selectRowsByIds(value, true, true);
      }
    },

    // TODO remove
    isSelectable: {
      immediate: true,
      handler(value) {
        this.selectable = value;
      }
    },

    selected: {
      handler(selection) {
        this.selectRows(selection);
      }
    },

    // Emit event on every selection change
    selection: {
      handler(selection) {
        this.$emit('update:selected', selection);
        this.$emit('selection-change', selection ? selection.slice() : []);
      }
    }
  }
};
