<script setup lang="ts">
  import type { AcvMenuInjection } from '../menu/menu.ts';
  import type {
    AcvMenuItemEvents,
    AcvMenuItemProps,
    AcvMenuItemSlots
  } from './menuItem.ts';
  import { useLevel } from '@/components/menu-item/useLevel.ts';
  import { useNested } from '@/components/menu-item/useNested.ts';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
  import { computed, getCurrentInstance, inject, ref, toValue } from 'vue';
  import { MENU_KEY } from '../menu/menu.ts';

  const props = withDefaults(defineProps<AcvMenuItemProps>(), {
    iconSize: 'md'
  });
  const emit = defineEmits<AcvMenuItemEvents>();
  const slots = defineSlots<AcvMenuItemSlots>();
  const uuid = ref(props.index || getCurrentInstance()?.uid);

  const { selectedItem, menuProps, selectItem } = inject(MENU_KEY, {}) as AcvMenuInjection;

  const menuItemClasses = computed(() => {
    return {
      selected: selectedItem?.value && (selectedItem.value === uuid.value),
      disabled: props.disabled
    };
  });

  const { level, indent } = useLevel(false);
  const clampSize = computed(() => {
    if (props.clamp) {
      return typeof props.clamp === 'number' ? props.clamp : 2;
    }
    return 0;
  });

  const { addToTree } = useNested();

  function handleClick() {
    emit('click');

    const selectedItem = toValue(uuid);

    if (selectedItem && selectItem) {
      selectItem(selectedItem);
    }
  }

  addToTree(uuid.value);
</script>

<template>
  <li
    class="acv-menu-item"
    :class="menuItemClasses"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :title="title"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <AcvTooltip
      v-if="level === 0 && menuProps?.collapse"
      placement="right"
    >
      <template #content>
        <div
          v-if="slots.title"
        >
          <slot name="title" />
        </div>
        <div
          v-else
          class="acv-text--ellipsis"
        >
          <slot />
        </div>
      </template>
      <template v-if="props.icon || slots.icon">
        <component
          :is="props.icon"
          v-if="props.icon"
        />
        <span
          v-else-if="slots.icon"
          class="icon"
        >
          <slot name="icon" />
        </span>
      </template>
    </AcvTooltip>
    <template v-else>
      <template v-if="props.icon || slots.icon">
        <component
          :is="props.icon"
          v-if="props.icon"
        />
        <span
          v-else-if="slots.icon"
          class="icon"
        >
          <slot name="icon" />
        </span>
      </template>
      <span
        v-if="slots.title || slots.subtitle"
        class="acv-text--ellipsis"
      >
        <span
          v-if="slots.title"
          class="acv-menu-item__title acv-text acv-text--body-24 acv-text--ellipsis"
        >
          <slot name="title" />
        </span>
        <span
          v-if="$slots.subtitle"
          class="acv-menu-item__subtitle acv-text--caption acv-text--ellipsis acv-text--color-fixed-light"
        >
          <slot name="subtitle" />
        </span>
      </span>
      <div
        class="acv-text acv-text--body-24 acv-text--ellipsis"
        :class="{ clamp }"
      >
        <slot />
      </div>
    </template>
    <template
      v-if="$slots.append"
    >
      <span class="append">
        <slot name="append" />
      </span>
    </template>
  </li>
</template>

<style scoped>
  .acv-menu-item {
    --acv-menu-item-indent: v-bind(indent);
    --acv-menu-item-clamp: v-bind(clampSize);
    --acv-menu-item-height: 64px;
    align-items: center;
    color: var(--_acv-menu-item-color);
    cursor: pointer;
    display: flex;
    font-size: var(--acv-font-size-caption);
    font-weight: var(--acv-font-weight-strong);
    gap: var(--_acv-menu-item-gap);
    grid-template-columns: auto 1fr;
    letter-spacing: .3px;
    line-height: 24px;
    min-height: var(--acv-menu-item-height);
    padding-block:var(--acv-spacing-small) ;
    padding-inline: var(--_acv-menu-item-padding-start) var(--_acv-menu-item-padding-end);
    position: relative;
    transition: transform .5s ease;
    overflow: visible;
    justify-content: var(--acv-menu-item-justify-content);

    &.selected,
    &:hover.selected,
    &:active {
      background-color: var(--_acv-menu-item-selected-bg);
      color: var(--_acv-menu-item-selected-color);
    }

    &.disabled {
      pointer-events: none;
      color: var(--acv-color-status-neutral-secondary);
    }

    &:hover {
      color: var(--_acv-menu-item-hover-color);
      background-color: var(--_acv-menu-item-hover-bg);
    }

    .clamp {
      flex: 0 0 80%;
      /* stylelint-disable-next-line value-no-vendor-prefix */
      display: -webkit-box;
      -webkit-line-clamp: var(--acv-menu-item-clamp);
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
    }

    .append {
      margin-left: auto;
    }

    .icon {
      min-width: 16px;
    }
  }
</style>
