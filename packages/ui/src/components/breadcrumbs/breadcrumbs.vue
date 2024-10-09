<script setup lang="ts">
  import type { AcvBreadcrumbsEvents, AcvBreadcrumbsProps, AcvBreadcrumbsSlots } from './breadcrumbs.ts';
  import { computed } from 'vue';
  import './breadcrumbs.css';

  const props = withDefaults(defineProps<AcvBreadcrumbsProps>(), {
    size: 'md'
  });

  defineEmits<AcvBreadcrumbsEvents>();
  defineSlots<AcvBreadcrumbsSlots>();

  const classes = computed(() => {
    return {
      'is-multi-line': props.multiline,
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

<style scoped>
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
      font-size: var(--acv-font-size-body);
      line-height: var(--acv-font-line-height-small);
    }

    &.size-lg {
      font-size: var(--acv-font-size-title);
      font-weight: var(--acv-font-weight-accent);
      line-height: var(--acv-font-line-height-medium);
    }

    &.is-multi-line {
      flex-wrap: wrap;
    }
  }
</style>
