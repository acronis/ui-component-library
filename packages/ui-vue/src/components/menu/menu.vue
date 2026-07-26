<script setup lang="ts">
  import type { Ref } from 'vue';
  import type { AcvMenuEvents, AcvMenuProps, AcvMenuSlots } from './menu.ts';
  import AcvButton from '@/components/button/button.vue';
  import { useLevel } from '@/components/menu-item/useLevel.ts';
  import { useNested } from '@/components/menu-item/useNested.ts';
  import { IconChevronLeft16, IconChevronRight16 } from '@acronis-platform/icons/chevron';
  import { computed, provide, ref, toRefs } from 'vue';
  import { MENU_KEY } from './menu.ts';

  import './menu.css';

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
  const slots = defineSlots<AcvMenuSlots>();
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

  const menuClasses = computed(() => {
    return {
      [`${props.type}`]: props.type,
      [`is-${props.background}`]: props.background,
      [`is-borderBottom`]: props.hideBottomBorder || props.hideBorders,
      [`hide-borders`]: props.hideBorders,
      collapsed: props.collapse,
    };
  });
</script>

<template>
  <nav
    ref="menuRef"
    class="acv-menu"
    :class="menuClasses"
  >
    <slot name="prepend" />
    <menu
      ref="menuBarRef"
      class="menubar acv-scrollbar"
      role="menubar"
    >
      <slot />
    </menu>
    <div
      v-if="type === 'secondary' && isOverflow"
      class="controls"
    >
      <AcvButton
        variant="ghost"
        @click="selectPrevMenuItem"
      >
        <IconChevronLeft16 />
      </AcvButton>
      <div class="controls-divider" />
      <AcvButton
        variant="ghost"
        @click="selectNextMenuItem"
      >
        <IconChevronRight16 />
      </AcvButton>
    </div>
    <menu
      v-if="slots.append"
      class="append"
    >
      <slot name="append" />
    </menu>
  </nav>
</template>

<style scoped>
.acv-menu {
  display: grid;
  width: 256px;
  flex-shrink: 0;
  background: var(--acv-menu-bg-color);
  color: var(--acv-color-white);
  justify-content: start;

  .menubar {
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

  .append {
    margin-top: auto;
  }

  &.primary {
    --acv-menu-item-active-bg: var(--acv-color-nav-active-primary);
    --acv-menu-item-active-color: var(--acv-color-nav-label-primary);
    --acv-menu-item-color: var(--acv-color-nav-label-secondary);
    --acv-menu-item-hover-bg: var(--acv-color-nav-hover-primary);
    --acv-menu-item-hover-color: var(--acv-color-nav-label-secondary);
    --acv-menu-item-selected-bg: var(--acv-color-nav-active-primary);
    --acv-menu-item-selected-color: var(--acv-color-nav-label-primary);
    --acv-menu-item-padding-inline-start: var(--acv-menu-item-indent);
    grid-template-columns: 256px;
    grid-template-rows: auto;

    &.collapsed {
      --acv-menu-item-gap: 0;
      --acv-menu-item-justify-content: center;
      gap: 0;

      &, .menubar {
        width: 64px;
        align-items: flex-start;
        overflow: visible;
        grid-template-rows: 64px;
      }
    }

    &:deep(.acv-menu-item) {
      padding-inline-start: var(--acv-menu-item-indent)
    }

    &:deep(.acv-icon) {
      --acv-icon-size: var(--acv-icon-size-medium);
    }
  }

  &.secondary {
    --acv-menu-item-color: var(--acv-color-nav-primary);
    --acv-menu-item-border-color: var(--acv-color-brand-primary);
    --acv-menu-item-active-color: var(--acv-color-nav-primary);
    --acv-menu-item-hover-bg: transparent;
    --acv-menu-item-selected-color: var(--acv-color-nav-primary);
    --acv-menu-item-padding-inline-start: var(--acv-spacing-zero);
    --acv-menu-item-padding-inline-end: var(--acv-spacing-zero);
    --acv-menu-gap: var(--acv-spacing-large);
    --acv-menu-item-gap: var(--acv-spacing-small);
    width: auto;
    height: auto;
    background-color: transparent;
    padding-inline: 8px;

    .menubar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: var(--acv-menu-gap, 16px);
      overflow: visible;
    }

    &:deep(.acv-menu-item:hover:before) {
      z-index: var(--acv-z-index-negative);
      content: '';
      width: calc(100% + 16px);
      left:-8px;
      height: 32px;
      background-color: var(--acv-color-nav-hover-secondary, hsl(215deg 68% 46% / 0.1));
      border-radius: 4px;
      position: absolute;
    }

    &:deep(.acv-menu-item:active:before) {
      z-index: var(--acv-z-index-negative);
      content: '';
      width: calc(100% + 16px);
      left:-8px;
      height: 32px;
      background-color: var(--acv-color-nav-active-secondary, hsl(215deg 68% 46% / 0.2));
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

  &.tertiary {
    --acv-menu-bg-color: var(--acv-color-white);
    --acv-menu-color-text: var(--acv-color-red);
    --acv-menu-item-color: var(--acv-color-link-primary);
    --acv-menu-item-selected-bg: var(--acv-color-primary-lightest, hsl(215deg 68% 46% / 0.05));
    --acv-menu-item-selected-color: var(--acv-color-text-primary, hsl(215deg 30% 20%));
    grid-template-rows: auto;
    grid-template-columns: 256px;

    &:deep(.acv-menu-item) {
      border-bottom: 1px solid var(--acv-color-form-disabled-primary, hsl(215deg 68% 46% / 0.1));
      width: 100%;
    }
  }
}
</style>
