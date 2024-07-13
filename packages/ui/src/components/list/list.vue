<script setup lang="ts">
  import './list.css';
  import { computed, provide, ref, toRef } from 'vue';
  import { useSortable } from '@vueuse/integrations/useSortable';
  import AcvListItem from '../list-item/listItem.vue';
  import { calculateSelectionItems, extractItemValueFromItemOption, useSelection } from '../../composables/useSelection.ts';
  import type { AcvListEvents, AcvListProps, AcvListSlots } from './list.ts';
  import { LIST_KEY } from './list.ts';

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
      background-color: $av-brand-light;

      & > * {
        opacity: 0;
      }

      &.card {
        background-color: $av-brand-light !important;
        border: $av-border-sm $av-brand-accent;
        border-radius: $av-border-radius-2;

       & > * {
          opacity: 0;
        }
      }
    }

    .dragged {
      background-color: $av-app-base;
      box-shadow: var(--el-shadow-regular);
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
