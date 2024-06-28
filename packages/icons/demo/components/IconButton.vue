<script lang="ts" setup>
  import { computed } from 'vue';
  import type { IconType } from '../types';

  const props = defineProps<{ type: IconType, name: string, icon: unknown }>();
  const iconName = computed(() =>
    props.name
      .split('_')
      .map(item => item[0].toUpperCase() + item.slice(1))
      .join(' '),
  );
</script>

<template>
  <button
    v-cloak
    class="icon-button"
  >
    <span
      class="ui-icon"
      :class="$props.type"
    >
      <component
        :is="props.icon"
        width="32"
        height="32"
      />
    </span>
    <span
      class="icon-name"
      :title="iconName"
    >
      {{ iconName }}
    </span>
  </button>
</template>

<style>
.icon-button {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border: none;
  outline: none;
  height: 128px;
  width: 96px;
  border-radius: 8px;
  user-select: none;
  background: transparent;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: rgba(60, 64, 67, 0.04);
  }

  &:focus {
    background-color: rgba(60, 64, 67, 0.12);
  }
}

@media screen and (width >= 720px) {
  .icon-button {
    width: 112px;
  }
}

.icon-name {
  color: hsl(213deg, 5%, 39%);
  font-size: var(--acv-font-size-caption);
  font-weight: 400;
  line-height: 16px;
  font-family: var(--acv-font-family);
  letter-spacing: 0.1px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
