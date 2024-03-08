<template>
  <li
    :id="nodeId"
    role="menuitem"
    :aria-expanded="inActivePath"
    :divider="showDivider"
    :tabindex="isDisabled ? null : -1"
    :class="{
      'el-cascader-node': true,
      'in-active-path': inActivePath,
      'is-active': isChecked,
      'is-disabled': isDisabled,
      'px-16': true
    }"
    v-bind="events"
  >
    <span
      :class="{
        'el-cascader-node__label el-text el-text--body-24': true,
        'mr-16': !isLeaf
      }"
    >
      <component
        :is="cascader.renderLabelFn"
        v-if="node"
        :node="node"
        :active="inActivePath"
      />
    </span>

    <span
      v-if="node.loading"
      class="el-cascader-node__postfix"
    >
      <el-spinner />
    </span>
    <span
      v-if="!isLeaf"
      class="el-cascader-node__postfix"
    >
      <el-icon
        name="i-chevron-right--16"
        :color="iconColor"
      />
    </span>
  </li>
</template>

<script setup lang="jsx">
import {
  computed, h, inject, toRefs
} from 'vue';

// eslint-disable-next-line import/extensions
import { CASCADER_KEY, CASCADER_PANEL_KEY } from 'packages/cascader/src/keys';
import ElIcon from 'packages/icon';
import ElSpinner from 'packages/spinner';
// eslint-disable-next-line import/extensions
import { isEqual } from '@/utils/util';

const props = defineProps({
  node: {
    type: Object,
    required: true,
    default: undefined
  },
  nodeId: {
    type: String,
    default: undefined
  }
});
const cascader = inject(CASCADER_KEY);
const panel = inject(CASCADER_PANEL_KEY);
const { node, nodeId } = toRefs(props);

const config = computed(() => panel.config);
const isLeaf = computed(() => !node.value.children);
const isDisabled = computed(() => node.value.isDisabled);
const checkedValue = computed(() => panel.checkedValue);
const isChecked = computed(() => isEqual(node.value.value, checkedValue));
const inActivePath = computed(() => {
  const pathNodes = panel.activePath;
  const selectedPathNode = pathNodes[node.value.level - 1] || {};

  return selectedPathNode.uid === node.value.uid;
});
const showDivider = computed(() => node.value.showDivider);
const value = computed(() => node.value.getValueByOption());
const iconColor = computed(() => {
  if (inActivePath.value) {
    return 'fixed-primary';
  }
  if (isDisabled.value) {
    return 'fixed-lightest';
  }
  return 'fixed-link';
});

function handleExpand() {
  if (isDisabled.value || node.value.loading) return;

  if (config.value.lazy && !node.value.loaded) {
    panel.lazyLoad(node, () => {
      if (!isLeaf.value) handleExpand();
    });
  } else {
    panel.handleExpand(node);
  }
}

function handleCheckChange() {
  cascader.emit('select', value, node.value.getText(), node.value.getPath());
  panel.handleCheckChange(value);
  panel.handleExpand(node);
}

const events = { on: {} };

events.on.click = handleExpand;

if (isLeaf.value && !isDisabled.value) {
  events.on.click = handleCheckChange;
}
</script>
