<script setup lang="ts">
  import type { Ref } from 'vue';
  import type { AcvMenuEvents, AcvMenuProps } from './menu.ts';
  import AcvButton from '@/components/button/button.vue';
  import { useLevel } from '@/components/menu-item/useLevel.ts';
  import { useNested } from '@/components/menu-item/useNested.ts';
  import { IconChevronLeft16, IconChevronRight16 } from '@acronis-platform/icons/chevron';
  import { provide, ref, toRefs } from 'vue';
  import { MENU_KEY } from './menu.ts';

  /**
   * User interface element that provides a set of links or buttons
   * to navigate through different sections or pages of a website or application.
   */
  defineOptions({
    name: 'AcvMenu',
  });

  const props = withDefaults(defineProps<AcvMenuProps>(), {
    mode: 'vertical',
    type: 'primary',
  });
  const emit = defineEmits<AcvMenuEvents>();
  const menuRef = ref<HTMLElement | null>(null);
  const menuBarRef = ref<HTMLElement | null>(null);
  const isOverflow = ref(false);

  const { modelValue } = toRefs(props);
  const selectedItem = modelValue as Ref<string>;
  provide(MENU_KEY, { menuProps: props, selectedItem, selectItem });

  useLevel();
  useNested();

  function selectItem(item: string | number) {
    emit('update:modelValue', item);
  }

  function selectNextMenuItem() {
    menuBarRef.value?.scrollBy({
      left: -100,
      behavior: 'smooth',
    });
  }

  function selectPrevMenuItem() {
    menuBarRef.value?.scrollBy({
      left: 100,
      behavior: 'smooth',
    });
  }
</script>

<template>
  <nav
    ref="menuRef"
    class="acv-menu"
    :class="{
      [`acv-menu_type_${props.type}`]: true,
      [`acv-menu_background_${props.background}`]: props.background,
      'acv-menu_border-bottom': props.hideBottomBorder || props.hideBorders,
      'acv-menu_hide-borders': props.hideBorders,
      'acv-menu_collapsed': props.collapse,
    }"
  >
    <slot name="prepend" />
    <menu
      ref="menuBarRef"
      class="acv-menu_menubar acv-scrollbar"
      role="menubar"
    >
      <slot />
    </menu>
    <div
      v-if="type === 'secondary' && isOverflow"
      class="acv-menu_controls"
    >
      <AcvButton
        variant="ghost"
        @click="selectPrevMenuItem"
      >
        <IconChevronLeft16 />
      </AcvButton>
      <div class="acv-menu_controls-divider" />
      <AcvButton
        variant="ghost"
        @click="selectNextMenuItem"
      >
        <IconChevronRight16 />
      </AcvButton>
    </div>
    <menu
      v-if="$slots.append"
      class="acv-menu_append"
    >
      <slot name="append" />
    </menu>
  </nav>
</template>

<style scoped>
.acv-menu {
  --_acv-menu-color: var(--acv-menu-color-primary);
  --_acv-menu-bg-color: var(--acv-color-nav-primary);
  --_acv-menu-color-text: var(--acv-color-white);
  --_acv-menu-gap: var(--acv-spacing-regular);
  --_acv-menu-item-gap: var(--acv-spacing-regular);
  --_acv-menu-item-padding-start: var(--acv-spacing-regular);
  --_acv-menu-item-padding-end: var(--acv-spacing-regular);
  display: grid;
  width: 256px;
  flex-shrink: 0;
  background: var(--_acv-menu-bg-color);
  color: var(--_acv-menu-color);
  justify-content: start;

  .acv-menu_menubar {
    width: 100%;
    position: relative;
    margin: 0;
    padding: 0;

    /* overflow: hidden; */
    scroll-behavior: smooth;
    overflow-y: scroll;
    white-space: nowrap;
    list-style: none;
  }

  & & {
    height: auto;
  }

  .acv-menu_append {
    margin-top: auto;
  }

  &.acv-menu_type_primary {
    --_acv-menu-item-color: var(--acv-color-nav-label-secondary);
    --_acv-menu-item-active-bg: var(--acv-color-nav-active-primary);
    --_acv-menu-item-active-color: var(--acv-color-nav-label-primary);
    --_acv-menu-item-hover-bg: var(--acv-color-nav-hover-primary);
    --_acv-menu-item-hover-color: var(--acv-color-nav-label-secondary);
    --_acv-menu-item-selected-bg: var(--acv-color-nav-active-primary);
    --_acv-menu-item-selected-color: var(--acv-color-nav-label-primary);
    grid-template-columns: 256px;
    grid-template-rows: auto;
    color: var(--acv-color-nav-label-secondary);
    background-color: var(--acv-menu-bg-color);

    &.acv-menu_collapsed {
      --acv-menu-item-justify-content: center;
      gap: var(--_acv-menu-item-gap);

      &, .acv-menu_menubar {
        width: 64px;
        align-items: flex-start;
        overflow: visible;
        grid-template-rows: 64px;
      }
    }

    &:deep(.acv-menu-item) {
      padding-inline-start: var(--acv-menu-item-indent)
    }
  }

  &.acv-menu_type_secondary {
    --_acv-menu-item-color: var(--acv-color-black);
    --_acv-menu-item-border-color: var(--acv-color-brand-primary);
    --_acv-menu-item-active-color: var(--acv-color-nav-primary);
    --_acv-menu-item-hover-bg: transparent;
    --_acv-menu-item-hover-color: var(--acv-color-black);
    --_acv-menu-item-selected-color: var(--acv-color-nav-primary);
    --_acv-menu-item-padding-start: var(--acv-spacing-zero);
    --_acv-menu-item-padding-end: var(--acv-spacing-zero);
    --_acv-menu-gap: var(--acv-spacing-large);
    --_acv-menu-item-gap: var(--acv-spacing-small);
    width: auto;
    height: auto;
    background-color: transparent;
    padding-inline: 8px;

    .acv-menu_menubar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: var(--_acv-menu-gap);
      overflow: visible;
    }

    &:deep(.acv-menu-item:hover:before) {
      z-index: var(--acv-z-index-negative);
      content: '';
      width: calc(100% + 16px);
      left:-8px;
      height: 32px;
      background-color: var(--acv-color-nav-hover-secondary);
      border-radius: 4px;
      position: absolute;
    }

    &:deep(.acv-menu-item:active:before) {
      z-index: var(--acv-z-index-negative);
      content: '';
      width: calc(100% + 16px);
      left:-8px;
      height: 32px;
      background-color: var(--acv-color-nav-active-secondary);
      border-radius: 4px;
      position: absolute;
    }

    &:deep(.acv-menu-item:focus-visible) {
      outline: none;
    }

    &:deep(.acv-menu-item:focus:before) {
      z-index: var(--acv-z-index-negative);
      content: '';
      width: calc(100% + 16px);
      left:-8px;
      height: 32px;
      background-color: var(--acv-color-focus);
      border-radius: 4px;
      position: absolute;
      outline: none;
    }

    &:deep(.acv-menu-item.selected:after) {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      background-color: var(--acv-color-brand-primary);
      bottom: 0;
      left: 0;
    }
  }

  &.acv-menu_type_tertiary {
    --_acv-menu-item-color: var(--acv-color-link-primary);
    --_acv-menu-bg-color: var(--acv-color-white);
    --_acv-menu-color-text: var(--acv-color-black);
    --_acv-menu-item-selected-bg: var(--acv-color-primary-lightest);
    --_acv-menu-item-selected-color: var(--acv-color-text-primary);
    grid-template-rows: auto;
    grid-template-columns: 256px;

    &:deep(.acv-menu-item) {
      border-bottom: 1px solid var(--acv-color-form-disabled-primary);
      width: 100%;
    }
  }
}
</style>
