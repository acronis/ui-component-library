<template>
  <div class="el-tiles-group">
    <div class="el-tiles-group__title">
      {{ title }}
    </div>
    <draggable
      class="el-tiles-group__body"
      :list="list"
      draggable=".is-draggable"
      group="tiles-group"
      @change="handleChange"
    >
      <el-tile
        v-for="(tile, tid) in list"
        :key="tid"
        class="is-draggable"
        :tile="tile"
        :tiles-config="tilesConfig"
        @command="handleAction"
      />
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Locale from '@/mixins/locale';
import { isEqual } from '@/utils/util';
import ElTile from './tile';
import { defaultGroupKey, minPosition, positionGap } from './constants';
import { translate } from './translate';

export default {
  name: 'ElTilesGroup',
  components: {
    draggable,
    ElTile
  },
  mixins: [
    Locale
  ],
  props: {
    groupIndex: { type: Number, default: undefined },
    actions: { type: Array, default: () => [] },
    tiles: { type: Array, default: () => [] },
    tilesConfig: { type: Object, required: true },
    title: { type: [String, Object], default: '' },
    rowKey: { type: String, required: true },
    groupId: { type: String, default: '' },
    defaultGroupKey: { type: String, default: defaultGroupKey },
    groupKey: { type: String, default: '' },
    i18n: { type: Object, default: null }
  },
  data() {
    return {
      translate,
      list: [],
      positionKey: 'position'
    };
  },
  computed: {
    isActionsShow() {
      return !!this.actions && this.actions.length > 0;
    }
  },
  watch: {
    tiles: {
      immediate: true,
      handler(newValue, oldValue) {
        if (isEqual(newValue, oldValue)) {
          return;
        }
        this.list = newValue;
        this.positionKey = this.tilesConfig?.map?.position || this.positionKey;

        this.list.sort((a, b) => {
          if (a[this.positionKey] === undefined && b[this.positionKey] !== undefined) {
            return 1;
          }
          if (a[this.positionKey] === undefined && b[this.positionKey] === undefined) {
            return 1;
          }
          return (a[this.positionKey] > b[this.positionKey]) ? 1 : -1;
        });

        if (this.list.every((item) => item[this.positionKey] === undefined)
          || this.list.some((item) => item[this.positionKey] !== undefined && item[this.positionKey] < minPosition)
        ) {
          this.resetPositions();
        }

        this.list.forEach((item, index) => {
          if (item[this.positionKey] === undefined) {
            this.updatePosition(index);
          }
        });
      }
    }
  },
  methods: {
    handleChange(event) {
      if (event.moved) {
        if (Math.abs(event.moved.newIndex - event.moved.oldIndex) === 1) {
          this.switchPosition(event.moved.newIndex, event.moved.oldIndex);
        } else {
          this.updatePosition(event.moved.newIndex);
        }
      }
      if (event.added) {
        this.updatePosition(event.added.newIndex, true);
      }
    },
    handleAction(action) {
      this.$emit('command', action);
    },
    handleClick(tile) {
      this.$emit('click-action', tile);
    },
    handleIconClick(event) {
      this.$emit('icon-click', event);
    },
    resetPositions() {
      const changedItems = [];
      this.list.forEach((_item, index) => {
        this.$set(this.list[index], this.positionKey, (index + 1) * positionGap);
        changedItems.push({
          key: this.list[index].key,
          position: this.list[index][this.positionKey]
        });
      });
      this.$emit('change', changedItems);
    },
    updatePosition(index, isGroupChanged = false) {
      const prevItem = this.list[index - 1];
      const nextItem = this.list[index + 1];
      if (prevItem?.[this.positionKey] && nextItem?.[this.positionKey]) {
        this.$set(this.list[index], this.positionKey, (prevItem[this.positionKey] + nextItem[this.positionKey]) / 2);
      } else if (prevItem?.[this.positionKey]) {
        this.$set(this.list[index], this.positionKey, prevItem[this.positionKey] + prevItem[this.positionKey] / 2);
      } else if (nextItem?.[this.positionKey]) {
        this.$set(this.list[index], this.positionKey, nextItem[this.positionKey] / 2);
      }
      if (isGroupChanged) {
        this.$set(this.list[index], this.groupKey, this.groupId);
      }

      if (this.list[index][this.positionKey] < minPosition
        || this.list[index][this.positionKey] - prevItem?.[this.positionKey] < minPosition
        || Math.abs(this.list[index][this.positionKey] - nextItem?.[this.positionKey]) < minPosition
      ) {
        return this.resetPositions();
      }

      if (isGroupChanged) {
        this.$emit('change', [{
          [this.rowKey]: this.list[index][this.rowKey],
          [this.groupKey]: this.list[index][this.groupKey],
          [this.positionKey]: this.list[index][this.positionKey]
        }]);
      } else {
        this.$emit('change', [{
          [this.rowKey]: this.list[index][this.rowKey],
          [this.positionKey]: this.list[index][this.positionKey]
        }]);
      }
    },
    switchPosition(newIndex, oldIndex) {
      const newPosition = this.list[newIndex][this.positionKey];
      const oldPosition = this.list[oldIndex][this.positionKey];
      this.$set(this.list[newIndex], this.positionKey, oldPosition);
      this.$set(this.list[oldIndex], this.positionKey, newPosition);
      this.$emit('change', [
        {
          [this.rowKey]: this.list[newIndex][this.rowKey],
          [this.positionKey]: this.list[newIndex][this.positionKey]
        },
        {
          [this.rowKey]: this.list[oldIndex][this.rowKey],
          [this.positionKey]: this.list[oldIndex][this.positionKey]
        }
      ]);
    }
  }
};
</script>
