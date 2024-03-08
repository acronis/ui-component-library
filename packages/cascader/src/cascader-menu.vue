<template>
  <el-scrollbar
    :id="menuId"
    tag="ul"
    role="menu"
    class="el-cascader-menu"
    :view-class="{
      'el-cascader-menu__list ma-0 px-0 py-8': true,
      'is-empty': isEmpty
    }"
  >
    <div
      v-if="isEmpty"
      class="el-cascader-menu__empty-text"
    >
      {{ t('el.select.noData') }}
    </div>
    <cascader-node
      v-for="(node, nodeIndex) in nextNodes"
      v-else
      :key="node.uid"
      :node="node"
      :node-id="`${menuId}-${nodeIndex}`"
      :aria-haspopup="!!node.children"
      :show-divider="!!node.divider"
      :aria-owns="node.children ? menuId : null"
      @click="() => selectNode(node.id)"
    >
      <cascader-divider
        v-if="node.divider"
        class="el-cascader-menu__divider"
      />
    </cascader-node>
    <div class="el-cascader-menu__divider" />
  </el-scrollbar>
  <CascaderMenu
    v-if="nestedMenu"
    :node-id="selectedNodeId"
    :nodes="nodes"
    :depth="depth + 1"
  />
</template>

<script setup>
import {
  computed, inject, ref, toRefs
} from 'vue';

// eslint-disable-next-line import/extensions
import { CASCADER_PANEL_KEY } from 'packages/cascader/src/keys';
import ElPopper from 'packages/popper/src/Popper.vue';
import ElScrollbar from 'packages/scrollbar';
import useLocale from '@/mixins/locale';
import { generateId } from '@/utils/util';

import CascaderDivider from './cascader-divider.vue';
import CascaderNode from './cascader-node.vue';
// eslint-disable-next-line import/extensions

const props = defineProps({
  nodes: {
    type: Array,
    required: true
  },
  nodeId: {
    type: [Number, String],
    default: 'root'
  },
  index: {
    type: Number,
    default: 0
  },
  depth: {
    type: Number,
    default: 0
  }
});

const id = generateId();
const { t } = useLocale();
const {
  nodes, nodeId, index, depth
} = toRefs(props);
const nextNodes = computed(() => nodes.value[nodeId.value]?.children.map((nodeId) => nodes.value[nodeId]));
const isEmpty = computed(() => !nextNodes.value?.length);
const menuId = computed(() => `cascader-menu-${id}-${index.value}`);
// const selectedMenus = ref([]);
// const panel = inject(CASCADER_PANEL_KEY);

const selectedNodeId = ref(null);
const selectNode = (nodeId) => {
  selectedNodeId.value = selectedNodeId.value === nodeId ? null : nodeId;
};

const nestedMenu = computed(() => nodes.value[selectedNodeId.value]?.children);
</script>
