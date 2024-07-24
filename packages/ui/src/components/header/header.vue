<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { isColor } from '../../utils/color.ts';
  import type { AcvHeaderProps, AcvHeaderSlots } from './header.ts';
  import './header.css';

  const { bordered, height, color, title, align } = withDefaults(defineProps<AcvHeaderProps>(), {
    bordered: true,
    height: '64px',
    color: 'white',
    title: '',
    align: 'center',
  });
  defineSlots<AcvHeaderSlots>();

  // const { isColorModifier } = useColor(['fixed-white', 'nav-primary']);

  const headerClasses = computed(() => {
    return {
      'acv-header': true,
      'acv-header--bordered': bordered,
      [`acv-header--color-${color}`]: isColor(color),
    };
  });
  const searchCollapse = ref(true);
  // function changeSearchCollapse(isCollapsed: boolean) {
  //   searchCollapse.value = isCollapsed;
  // }
</script>

<template>
  <header :class="headerClasses">
    <div
      v-if="title || $slots.default"
      class="acv-header__content"
      :style="{ alignItems: align }"
    >
      <slot>
        <span
          v-if="title"
          class="mx-24 acv-text acv-text--display-medium acv-text--ellipsis"
        >
          {{ title }}
        </span>
      </slot>
    </div>
    <div
      v-if="$slots.actions"
      class="acv-header__actions"
    >
      <slot
        v-if="searchCollapse"
        name="actions"
      />
    </div>
    <div
      class="acv-header__aside"
    >
      <slot
        name="aside"
      />
    </div>
  </header>
</template>

<style scoped>
  .acv-header {
    display: flex;
    width: 100%;
    position: relative;
    background-clip: padding-box;
    justify-content: flex-end;
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-header-color);
    height: v-bind(height);
    min-height: v-bind(height);

    .acv-header__content {
      display: flex;
      align-items: center;
      min-width: 0;
      flex: 1;
    }

    .acv-header__aside {
      display: flex;
      align-items: center;
      flex: 0 1 auto;
      justify-content: flex-end;
      margin: 0 4px 0 20px;
    }

    .acv-header__aside-item {
      margin-right: 16px;

      .acv-header__aside-item--search {
        display: flex;
        align-items: center;
        margin-left: 4px;
      }
    }

    .acv-header__actions {
      display: flex;
      align-items: center;
      flex: 0 1 auto;
      justify-content: flex-end;
    }

    .acv-header__menu {
      .acv-button {
        width: 32px;
        height: 32px;
        padding: 4px;

        &:hover {
          background-color: var(--acv-color-accent);
        }

        &.is-active-button,
        &:active {
          background-color: var(--acv-color-primary-light);
        }
      }
    }

    .acv-header__menu-dropdown {
      .i[class*='-16'] {
        .acv-header__menu-dropdown--right {
          order: 100;
          margin-left: auto;
          margin-top: 8px;
          margin-bottom: 8px;
        }
      }

      .i[class*='-24'] {
        .acv-header__menu-dropdown--right {
          order: 100;
          margin-left: auto;
          margin-top: 4px;
          margin-bottom: 4px;
        }
      }
    }

    .acv-header__search {
      &.acv-search {
        width: 350px;
      }

      &.acv-search--collapse-hover,
      .acv-search__icon--large {
        width: 64px;
      }

      &.acv-search--collapse-hover:hover,
      &.acv-search--collapse-hover:active {
        background: none;
      }
    }

    .acv-header__suggestions {
      .acv-autocomplete-suggestion__list li {
        color: var(--acv-color-brand-primary);
      }
    }

    .acv-header--bordered {
      border-bottom: var(--acv-border-sm) var(--acv-color-accent);
    }

    .acv-header--color-brand {
      background-color: var(--acv-color-bg-brand);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-white {
      background-color: var(--acv-color-bg-inversed);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-primary {
      background-color: var(--acv-color-bg-primary);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-secondary {
      background-color: var(--acv-color-bg-secondary);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-tertiary {
      background-color: var(--acv-color-bg-tertiary);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-disabled {
      background-color: var(--acv-color-bg-disabled);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-accent {
      background-color: var(--acv-color-bg-accent);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-danger {
      background-color: var(--acv-color-bg-danger);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-critical {
      background-color: var(--acv-color-bg-critical);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-warning {
      background-color: var(--acv-color-bg-warning);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-success {
      background-color: var(--acv-color-bg-success);
      color: var(--acv-color-text-inversed-primary);
    }

    .acv-header--color-info {
      background-color: var(--acv-color-bg-info);
      color: var(--acv-color-text-inversed-primary);
    }
  }
</style>
