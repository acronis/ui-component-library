<script setup lang="ts">
  import type { AcvListEvents, AcvListProps, AcvListSlots } from './list.ts';
  import { useSortable } from '@vueuse/integrations/useSortable';
  import { computed, provide, ref, toRef } from 'vue';
  import { calculateSelectionItems, extractItemValueFromItemOption, useSelection } from '../../composables/useSelection.ts';
  import AcvListItem from '../list-item/listItem.vue';
  import { LIST_KEY } from './list.ts';
  import './list.css';

  defineOptions({
    name: 'AcvList'
  });
  const props = defineProps<AcvListProps>();
  const emit = defineEmits<AcvListEvents>();
  defineSlots<AcvListSlots>();
  const items = defineModel({ default: [] });
  const { options } = useSelection({
    items: calculateSelectionItems(items.value || []),
    multi: toRef(() => props.multiselect),
    initialValue: toRef(() => props.modelValue),
  });
  const list = ref<HTMLElement | null>(null);

  useSortable(list, items);

  provide(LIST_KEY, {
    card: props.card,
    sortable: props.sortable
  });

  function handleItemClick(item) {
    const value = props.selectable ? item : extractItemValueFromItemOption(item);
    emit('update:modelValue', value);
    emit('itemClick', value);
  }

  const listClasses = computed(() => {
    return {
      'acv-list': true,
      'card': props.card
    };
  });
</script>

<template>
  <div
    ref="list"
    :class="listClasses"
  >
    <slot :items="items">
      <template
        v-for="(item, index) in (items as any[])"
        :key="index"
      >
        <slot
          name="item"
          :item="item"
        >
          <AcvListItem
            :title="typeof item === 'string' ? item : undefined"
            v-bind="typeof item === 'object' ? item : {}"
            :variant="props.variant"
            :states="props.states"
            :is-active="options[index]?.isSelected as unknown as boolean"
            :value="props.modelValue !== undefined || (typeof item === 'object' && item?.value ? item.value : undefined)"
            @click="handleItemClick(item)"
          />
        </slot>
      </template>
    </slot>
  </div>
</template>

<style scoped>
  .acv-list {
    min-height: 48px;
    color: var(--acv-color-text-primary);

    &.card {
      display: grid;
      gap: 16px;
    }

    &.card-animate {
      > * {
        display: grid;
        gap: 16px;
      }
    }

    .placeholder {
      background-color: var(--acv-color-primary-light);

      & > * {
        opacity: 0;
      }

      &.card {
        background-color: var(--acv-color-primary-light) !important;
        border: var(--acv-border-width-small) var(--acv-color-accent);
        border-radius: var(--acv-border-radius-small);

       & > * {
          opacity: 0;
        }
      }
    }

    .dragged {
      background-color: var(--acv-color-base);
      box-shadow: var(--acv-box-shadow);
      opacity: 1 !important;
    }

    &.dragging {
      cursor: grabbing !important;

      * {
        cursor: grabbing !important;
      }

      /* body { */

      /*  background-color: rebeccapurple; */

      /* } */
    }
  }

  .list-transition-move {
    transition: transform 500ms ease-out;
  }
</style>
