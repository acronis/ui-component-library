<template>
  <div class="el-tiles">
    <div class="el-tiles__toolbar">
      <div>
        <el-button
          type="secondary"
          :class="`el-button--${allGroupsType}`"
          @click="handleSelectGroups"
        >
          {{ t('el.tiles.allGroups') }}
        </el-button>
      </div>
      <div
        v-for="(group, index) in groupsFilter"
        :key="index"
      >
        <el-button
          type="secondary"
          :class="`el-button--${getGroupType(group)}`"
          @click="handleSelectGroup(group)"
        >
          {{ translate(group.title, i18n) }}
        </el-button>
      </div>
      <div>
        <el-button
          type="secondary"
          icon="i-plus--16"
          @click="handleAddGroup"
        >
          {{ t('el.tiles.addGroup') }}
        </el-button>
      </div>
    </div>
    <el-scrollbar
      axis="y"
    >
      <draggable
        v-if="hasData"
        draggable=".is-group-draggable"
        ghost-class="el-tiles-group__ghost"
        :list="groups"
        @change="handleGroupChange"
      >
        <el-tiles-group
          v-for="(group, gid) in filteredGroups"
          :key="group.key"
          class="is-group-draggable"
          :group-index="gid"
          :row-key="rowKey"
          :tiles="group.tiles"
          :tiles-config="tilesConfig"
          :title="group.title"
          :group-id="group.key"
          :group-key="groupKey"
          :default-group-key="defaultGroupKey"
          :actions="group.actions"
          :i18n="i18n"
          @change="handleChange"
          @command="handleAction"
          @click-action="handleClick"
          @icon-click="handleIconClick"
        />
      </draggable>
      <div
        v-else
        ref="emptyBlock"
        class="el-tiles__empty-block"
        :class="emptyClass"
      >
        <span class="el-tiles__empty-text">
          <slot name="empty">{{ emptyText ? translate(emptyText, i18n) : t('el.tiles.emptyText') }}</slot>
        </span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ElScrollbar from 'packages/scrollbar';
import Locale from '@/mixins/locale';
import ElTilesGroup from './tiles-group';
import { defaultGroupKey, minPosition, positionGap } from './constants';
import { translate } from './translate';

export default {
  name: 'ElTiles',
  components: {
    draggable,
    ElScrollbar,
    ElTilesGroup
  },
  mixins: [
    Locale
  ],
  props: {
    data: { type: Array, default: () => [] },
    groupsConfig: { type: Array, required: true },
    tilesConfig: { type: Object, required: true },
    defaultGroupKey: { type: String, default: defaultGroupKey },
    rowKey: { type: String, required: true },
    groupKey: { type: String, required: true },
    defaultSelectedGroups: { type: Object, required: true },
    i18n: { type: Object, default: null }
  },
  data() {
    return {
      translate,
      initialGroupsCount: 0,
      groups: [],
      groupsFilter: [],
      selectedGroups: {}
    };
  },
  computed: {
    allGroupsType() {
      const selected = Object.keys(this.selectedGroups);
      return (this.groupsFilter.length === selected.length || selected.length === 0) ? 'selected' : 'unselected';
    },
    hasData() {
      return this.data && this.data.length;
    },
    filteredGroups() {
      if (this.allGroupsType === 'selected') {
        return this.groups;
      }
      return this.groups.filter(
        (group) => this.selectedGroups[group.key] && (group.tiles.length || group.visibleIfEmpty)
      );
    }
  },
  watch: {
    defaultSelectedGroups(value) {
      this.selectedGroups = this.defaultSelectedGroups;
    },
    groupsConfig(newValue) {
      if (newValue.length > this.initialGroupsCount) {
        this.initGroups();
        this.updatePosition(this.groups.length - 1);
      }
      if (newValue.length < this.initialGroupsCount) {
        this.initGroups(true);
        this.initDefaultGroup();
        this.initPositions();
        this.groupItems();
      }
    },
    data() {
      this.groupItems();
    }
  },
  created() {
    this.initGroups();
    this.initDefaultGroup();
    this.initPositions();
    this.groupItems();
    this.selectedGroups = this.defaultSelectedGroups;
  },
  methods: {
    handleGroupChange(event) {
      this.updatePosition(event.moved.newIndex);
    },
    handleChange(items) {
      this.$emit('change', items);
    },
    handleAction(action) {
      this.$emit('command', action);
    },
    handleAddGroup() {
      this.$emit('add-group');
    },
    handleIconClick(event) {
      this.$emit('icon-click', event);
    },
    handleSelectGroups() {
      if (this.allGroupsType === 'unselected') {
        this.selectedGroups = {};
      }
      this.$emit('select', this.selectedGroups);
    },
    handleSelectGroup(group) {
      if (this.selectedGroups[group.key]) {
        delete this.selectedGroups[group.key];
        this.selectedGroups = Object.assign({}, this.selectedGroups);
      } else {
        this.$set(this.selectedGroups, group.key, group.key);
      }
      if (this.groups.length === Object.keys(this.selectedGroups).length) {
        this.selectedGroups = {};
      }
      this.$emit('select', this.selectedGroups);
    },
    handleClick(tile) {
      this.$emit('click-action', tile);
    },
    getGroupType(group) {
      if (this.allGroupsType === 'selected') {
        return 'unselected';
      }
      return (this.selectedGroups[group.key]) ? 'selected' : 'unselected';
    },
    initGroups(isShouldClear = false) {
      if (isShouldClear) {
        this.groups = [];
        this.groupsFilter = [];
      }
      this.groupsConfig.forEach((group) => {
        if (!this.groups.find((item) => item.key === group.key)) {
          this.groups.push({
            key: group.key,
            title: group.title,
            visibleIfEmpty: (group.visibleIfEmpty === undefined) ? false : group.visibleIfEmpty,
            position: group.position,
            actions: group.actions,
            tiles: []
          });
        }
        if (!this.groupsFilter.find((item) => item.key === group.key)) {
          this.groupsFilter.push({
            key: group.key,
            title: group.title
          });
        }
      });
      this.initialGroupsCount = this.groupsConfig.length;
    },
    initPositions() {
      this.groups.sort((a, b) => {
        if (a.position === undefined && b.position !== undefined) {
          return 1;
        }
        if (a.position === undefined && b.position === undefined) {
          return 1;
        }
        return (a.position > b.position) ? 1 : -1;
      });

      if (this.groups.every((group) => group.position === undefined)
        || this.groups.some((group) => group.position !== undefined && group.position < minPosition)
      ) {
        this.resetPositions();
      }
      this.groups.forEach((group, index) => {
        if (group.position === undefined) {
          this.updatePosition(index);
        }
      });
    },
    initDefaultGroup() {
      let defaultGroup = this.groups.find((group) => group.key === this.defaultGroupKey);
      const defaultGroupFilter = this.groupsFilter.find((group) => group.key === this.defaultGroupKey);
      if (!defaultGroup) {
        this.groups.push({
          key: this.defaultGroupKey,
          title: this.t('el.tiles.defaultGroup'),
          visibleIfEmpty: true,
          position: undefined,
          tiles: []
        });
        defaultGroup = this.groups[this.groups.length - 1];
      }
      if (!defaultGroupFilter) {
        this.groupsFilter.push({
          key: this.defaultGroupKey,
          title: this.t('el.tiles.defaultGroup')
        });
      }
      return defaultGroup;
    },
    groupItems() {
      this.groups.forEach((_group, index) => {
        this.$set(this.groups[index], 'tiles', []);
      });
      const defaultGroup = this.initDefaultGroup();

      this.data.forEach((row) => {
        const group = this.groups.find((item) => item.key === row[this.groupKey]);
        const cloneRow = JSON.parse(JSON.stringify(row));
        if (group) {
          group.tiles.push(cloneRow);
        } else {
          defaultGroup.tiles.push(cloneRow);
        }
      });
    },
    resetPositions() {
      const changedGroups = [];
      this.groups.forEach((_group, index) => {
        this.$set(this.groups[index], 'position', (index + 1) * positionGap);
        changedGroups.push({
          key: this.groups[index].key,
          position: this.groups[index].position
        });
      });
      this.$emit('groups-change', changedGroups);
    },
    updatePosition(index) {
      const prevGroup = this.groups[index - 1];
      const nextGroup = this.groups[index + 1];
      if (prevGroup?.position && nextGroup?.position) {
        this.$set(this.groups[index], 'position', (prevGroup.position + nextGroup.position) / 2);
      } else if (prevGroup?.position) {
        this.$set(this.groups[index], 'position', prevGroup.position + prevGroup.position / 2);
      } else {
        this.$set(this.groups[index], 'position', nextGroup.position / 2);
      }

      if (this.groups[index].position < minPosition
        || this.groups[index].position - prevGroup?.position < minPosition
        || Math.abs(this.groups[index][this.positionKey] - nextGroup?.position) < minPosition
      ) {
        return this.resetPositions();
      }
      this.$emit('groups-change', [{
        key: this.groups[index].key,
        position: this.groups[index].position
      }]);
    }
  }
};
</script>
