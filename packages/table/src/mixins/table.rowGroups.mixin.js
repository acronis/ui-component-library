import { createApp } from 'vue';

import ElTableRowsGroup from 'packages/table-rows-group';
import { mapStates } from 'packages/table/src/store/helper';
import { sortData } from 'packages/table/src/table-utils';
import eventBus from '@/utils/eventBus';

export default {
  props: {
    groupDataFunc: {
      type: Function
    },
    rowGroups: {
      type: Array
    },
    showGroupsOnly: {
      type: Boolean,
      default: false
    },
    getRowGroupData: {
      type: Function
    }
  },
  data() {
    return {
      groupedData: [],
      rowsGroups: [],
      rowsGroupMap: {},
      stuckRowsGroup: null,
      renderedRowsMap: {}
    };
  },
  methods: {
    updateGroupRenderedRows(groupId, key, rows) {
      const rowGroup = this.rowsGroupMap[groupId];
      if (rowGroup) {
        if (rowGroup.renderedRowsMap && !(Object.keys(rowGroup.renderedRowsMap).includes(key))) {
          this.rowsGroupMap[groupId].renderedRowsMap[key] = rows;
        } else {
          this.rowsGroupMap[groupId].renderedRowsMap = {
            [key]: rows
          };
        }
      }
    },

    updateRowsGroup(rowsGroup, index) {
      const rowsGroups = this.rowsGroups.slice();
      if (rowsGroups[index] !== rowsGroup) {
        const currentIndex = rowsGroups.indexOf(rowsGroup);
        if (currentIndex) {
          [rowsGroups[index], rowsGroups[currentIndex]] = [rowsGroups[currentIndex], rowsGroups[index]];
        }
        this.rowsGroups = rowsGroups;
      }

      this.updateGroupedData();
    },

    insertRowsGroup(rowsGroup) {
      this.rowsGroups.push(rowsGroup);
      this.rowsGroupMap[rowsGroup.groupId] = rowsGroup;

      this.updateGroupedData();
    },

    removeRowsGroup(rowsGroup) {
      this.rowsGroups = this.rowsGroups.filter((x) => x !== rowsGroup);
      this.rowsGroupMap[rowsGroup.groupId] = null;

      this.updateGroupedData();
    },

    setStuckRowsGroup(rowsGroup) {
      this.stuckRowsGroup = rowsGroup;
    },

    updateGroupedData() {
      const {
        rowsGroups, data, sortingColumn, sortProp, sortOrder
      } = this;

      if (rowsGroups.length === 0) {
        return;
      }

      const definedMap = new Map();
      const definedGroupData = rowsGroups.map((rowsGroup) => {
        const filtered = data.filter((dataItem) => !definedMap.get(dataItem) && rowsGroup.filterMethod(dataItem));
        filtered.forEach((dataItem) => {
          definedMap.set(dataItem, true);
        });

        return sortData({
          data: filtered, sortingColumn, sortProp, sortOrder
        });
      });

      let danglingData = data.filter((dataItem) => !definedMap.get(dataItem));
      if (danglingData.length > 0) {
        danglingData = sortData({
          data: danglingData, sortingColumn, sortProp, sortOrder
        });
        this.groupedData = definedGroupData.concat([danglingData]);
      } else {
        this.groupedData = definedGroupData;
      }
    },

    updateStuckRowsGroup() {
      const {
        bodyScrollbarWrap: scrollWrap,
        rowHeight,
        rowsGroupsToRender,
        rowsGroupMap,
        withVirtualScroll
      } = this;

      if (!scrollWrap) {
        return;
      }
      const top = scrollWrap.scrollTop;
      let accumulatedHeight = 0;

      for (let i = 0; i < rowsGroupsToRender.length; i++) {
        const rg = rowsGroupsToRender[i];
        let rowsInGroup = 0;
        if (!rg.currentCollapsed) {
          rowsInGroup += rg.groupData.length;
          if (rg.$slots.footer) {
            rowsInGroup++;
          }
        }
        if (rg.collapseLoading) {
          rowsInGroup = 1;
        }

        const renderedRowsMap = rowsGroupMap[rg.groupId]?.renderedRowsMap;

        if (
          !withVirtualScroll
          && !rg.collapseLoading
          && !rg.currentCollapsed
          && renderedRowsMap
          && Object.keys(renderedRowsMap).length
        ) {
          accumulatedHeight += Object.values(renderedRowsMap).reduce(
            (result, groupRow) => {
              let sum = 0;

              if (groupRow[0]) {
                const groupRowHeight = groupRow[0].elm?.clientHeight;
                sum += (groupRowHeight > 0) ? groupRowHeight : rowHeight;
                if (groupRow[1]) {
                  sum += groupRow[1].elm?.clientHeight;
                }
              }
              return result + sum;
            },
            0
          ) + (i === 0 ? 0 : rowHeight) + (rg.$slots.footer ? rowHeight : 0);
        } else {
          accumulatedHeight += rowHeight * (rowsInGroup + (i === 0 ? 0 : 1));
        }

        if (top <= accumulatedHeight + rowHeight) {
          rg.setStuck(true);
          return;
        }
      }
    },

    initializeRowGroups() {
      if (Array.isArray(this.$props.rowGroups)) {
        this.$props.rowGroups.forEach((row) => {
          const group = createApp({
            propsData: {
              ...row,
              owner: this,
              groupRow: row.data || row.groupRow,
              getRowGroupData: this.getRowGroupData
            },
            ...ElTableRowsGroup
          });

          group.mount();
          this.$el.appendChild(group.$el);
        });
      }
    }
  },
  computed: {
    ...mapStates({
      sortingColumn: 'sortingColumn',
      sortProp: 'sortProp',
      sortOrder: 'sortOrder'
    }),
    stuckedRowsGroup() {
      return this.rowsGroups.filter((rowsGroup) => rowsGroup.stuck
        && (rowsGroup.groupData.length || rowsGroup.alwaysShown))[0];
    },

    shouldRenderRowsGroups() {
      return this.rowsGroups.length > 0;
    },

    rowsGroupsToRender() {
      return this.rowsGroups.filter((group) => group.groupData.length || group.alwaysShown);
    }
  },
  watch: {
    rowsGroups: 'updateStuckRowsGroup',

    groupedData: 'updateStuckRowsGroup',

    shouldRenderRowsGroups(value) {
      if (value) {
        // TODO watch for particular table scroll event, in local eventBus
        // this.$on('scroll', this.updateStuckRowsGroup);
        eventBus.$on('el.table.scroll', this.updateStuckRowsGroup);
      } else {
        eventBus.$off('el.table.scroll', this.updateStuckRowsGroup);
        // this.$off('scroll', this.updateStuckRowsGroup);
      }
    }
  },

  async mounted() {
    this.initializeRowGroups();

    if (this.shouldRenderRowsGroups) {
      // this.$on('scroll', this.updateStuckRowsGroup);
      eventBus.$on('el.table.scroll', this.updateStuckRowsGroup);
    }

    await this.$nextTick();

    this.updateStuckRowsGroup();
  },

  beforeUnmount() {
    eventBus.$off('el.table.scroll', this.updateStuckRowsGroup);

    // this.$off('scroll', this.updateStuckRowsGroup);
  }
};
