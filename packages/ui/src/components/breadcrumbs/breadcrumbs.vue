<script setup lang="ts">
  import { computed } from 'vue';
  import type { BreadcrumbsEvents, BreadcrumbsProps, BreadcrumbsSlots } from './breadcrumbs.ts';
  import './breadcrumbs.css';

  const {
    // maxItems,
    multiline,
    // separatorIcon
  } = withDefaults(defineProps<BreadcrumbsProps>(), {
    size: 'md'
  });

  defineEmits<BreadcrumbsEvents>();
  defineSlots<BreadcrumbsSlots>();

  const classes = computed(() => {
    return {
      'is-multi-line': multiline,
    };
  });
</script>

<template>
  <div
    class="acv-breadcrumbs"
    aria-label="Breadcrumb"
    role="navigation"
    :class="classes"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
  @import '../../styles/mixins/typography.scss';

  .acv-breadcrumbs {
    display: flex;
    max-width: 100%;

    .acv-breadcrumbs-separator {
      color: var(--acv-color-brand-secondary);
      margin: 0 16px;
    }

    .acv-dropdown-menu {
      .acv-breadcrumb__link {
        padding: 0;

        &:hover {
          background-color: transparent;
        }

        &.is-focus {
          background-color: transparent;
        }
      }
    }

    &.size-md {
      @include text-ui;
    }

    &.size-lg {
      @include text-h3;
    }

    &.is-multi-line {
      flex-wrap: wrap;
    }
  }
</style>
