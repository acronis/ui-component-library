<script setup lang="ts">
  import type { VNode } from 'vue';
  import type { AcvBreadcrumbsEvents, AcvBreadcrumbsProps, AcvBreadcrumbsSlots } from './breadcrumbs.ts';
  import BreadcrumbSection from '@/components/breadcrumbs/breadcrumbSection.vue';
  import { IconChevronRight16 } from '@acronis-platform/icons/chevron';
  import { computed, ref, useSlots } from 'vue';
  import './breadcrumbs.css';

  const props = withDefaults(defineProps<AcvBreadcrumbsProps>(), {
    size: 'md',
    maxItems: Infinity,
    separatorIcon: IconChevronRight16,
  });
  defineEmits<AcvBreadcrumbsEvents>();
  defineSlots<AcvBreadcrumbsSlots>();

  const slots = useSlots();
  const activeBreadcrumb = ref<string | null>(null);

  const items = computed<VNode[]>(() => slots.default ? slots.default() : []);
  const isMultiline = computed(() => props.multiline);

  const visibleItems = computed(() => getVisibleItems());
  const hiddenItems = computed(() => getHiddenItems());

  function getVisibleItems() {
    if (items.value.length <= props.maxItems) {
      return items.value;
    }
    const start = items.value.slice(0, 1);
    const end = items.value.slice(-Math.floor(props.maxItems - 2));
    return [...start, ...end];
  }

  function getHiddenItems() {
    return items.value.length > props.maxItems
      ? items.value.slice(1, -Math.floor(props.maxItems - 2))
      : [];
  }

  function handleBreadcrumbClick(clickedTo: string) {
    activeBreadcrumb.value = clickedTo;
  }
</script>

<template>
  <nav
    class="acv-breadcrumbs"
    aria-label="Breadcrumb"
    role="navigation"
    :class="[`size-${props.size}`]"
  >
    <ol
      :class="[isMultiline && 'is-multi-line']"
    >
      <template
        v-for="(item, index) in visibleItems"
        :key="index"
      >
        <li role="menuitem">
          <component
            :is="item"
            :active="activeBreadcrumb === item.props?.to"
            :tabindex="index === visibleItems.length ? -1 : 0"
            @click="handleBreadcrumbClick(item.props?.to)"
          />
        </li>
        <!-- Separator & Hidden Items -->
        <li
          v-if="index === 0 && hiddenItems.length > 0"
          class="acv-breadcrumbs-separator"
          aria-hidden="true"
        >
          <!-- Separator Character -->
          <template v-if="props.separator">
            {{ props.separator }}
          </template>
          <!-- Separator Icon -->
          <template v-else>
            <component :is="separatorIcon" />
          </template>
        </li>
        <li
          v-if="index === 0 && hiddenItems.length > 0"
          role="menuitem"
        >
          <BreadcrumbSection>
            <component
              :is="hiddenItem"
              v-for="hiddenItem in hiddenItems"
              :key="hiddenItem.props?.to"
              :active="activeBreadcrumb === hiddenItem.props?.to"
              @click="handleBreadcrumbClick(hiddenItem.props?.to)"
            />
          </BreadcrumbSection>
        </li>
        <!-- Separator for remaining visible items -->
        <li
          v-if="index < visibleItems.length - 1"
          class="acv-breadcrumbs-separator"
          aria-hidden="true"
        >
          <!-- Separator Character -->
          <template v-if="props.separator">
            {{ props.separator }}
          </template>
          <!-- Separator Icon -->
          <template v-else>
            <component :is="separatorIcon" />
          </template>
        </li>
      </template>
    </ol>
  </nav>
</template>

<style scoped>
.acv-breadcrumbs {
  display: flex;
  max-width: 100%;
  align-items: center;
  padding: var(--acv-breadcrumbs-padding-y) var(--acv-breadcrumbs-padding-x);
}

.acv-breadcrumbs ol {
  display: flex;
}

.acv-breadcrumbs ol.is-multi-line {
  flex-wrap: wrap;
}

.acv-breadcrumbs li {
  display: flex;
  align-items: center;
}

.acv-breadcrumbs-separator {
  color: var(--acv-color-icon-disabled);
  margin: 0 var(--acv-spacing-small);
}

.size-md {
  font-size: var(--acv-font-size-body);
  line-height: var(--acv-font-line-height-small);
}

.size-lg {
  font-size: var(--acv-font-size-title);
  font-weight: var(--acv-font-weight-accent);
  line-height: var(--acv-font-line-height-medium);
}
</style>
