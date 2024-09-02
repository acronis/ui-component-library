<script lang="ts" setup>
  import { computed } from 'vue';
  import AcvPaginationItem from './AcvPaginationItem.vue';
  import type { AcvPaginationEvents, AcvPaginationProps } from '@/components';

  const props = defineProps<AcvPaginationProps & { modelValue: number }>();
  defineEmits<AcvPaginationEvents>();

  const maximumVisibleSlotsInPagination = 7;
  const lastPage = computed(() => Math.ceil(props.total / props.limit));
</script>

<template>
  <div class="acv-pagination">
    <!-- Previous page button -->
    <AcvPaginationItem
      :page="props.modelValue - 1"
      :disabled="props.modelValue <= 1"
      @select="$emit('update:modelValue', $event)"
    >
      &#8592;
    </AcvPaginationItem>
    <!-- First page -->
    <AcvPaginationItem
      :page="1"
      :active="props.modelValue === 1"
      @select="$emit('update:modelValue', $event)"
    />
    <!-- Pages 2-5 or ellipsis -->
    <template v-if="lastPage <= maximumVisibleSlotsInPagination">
      <template v-for="p of 5">
        <AcvPaginationItem
          v-if="p + 1 <= lastPage"
          :key="p"
          :page="p + 1"
          :active="props.modelValue === p + 1"
          @select="$emit('update:modelValue', $event)"
        />
      </template>
    </template>
    <template v-else>
      <template v-if="props.modelValue <= 4">
        <AcvPaginationItem
          v-for="p of 3"
          :key="p"
          :page="p + 1"
          :active="props.modelValue === p + 1"
          @select="$emit('update:modelValue', $event)"
        />
        <AcvPaginationItem
          :page="5"
          :active="props.modelValue === 5"
          @select="$emit('update:modelValue', $event)"
        />
        <div class="page-group">
          ...
        </div>
      </template>
      <template v-else-if="props.modelValue > lastPage - 4">
        <div class="page-group">
          ...
        </div>
        <AcvPaginationItem
          v-for="p of 4"
          :key="p"
          :page="lastPage - 5 + p"
          :active="props.modelValue === lastPage - 5 + p"
          @select="$emit('update:modelValue', $event)"
        />
      </template>
      <template v-else>
        <div class="page-group">
          ...
        </div>
        <AcvPaginationItem
          :page="props.modelValue - 1"
          @select="$emit('update:modelValue', $event)"
        />
        <AcvPaginationItem
          :page="props.modelValue"
          active
          @select="$emit('update:modelValue', $event)"
        />
        <AcvPaginationItem
          :page="props.modelValue + 1"
          @select="$emit('update:modelValue', $event)"
        />
        <div class="page-group">
          ...
        </div>
      </template>
    </template>

    <!-- Last page -->
    <AcvPaginationItem
      v-if="lastPage !== 1"
      :page="lastPage"
      :active="props.modelValue === lastPage"
      @select="$emit('update:modelValue', $event)"
    />
    <!-- Next page button -->
    <AcvPaginationItem
      :page="props.modelValue + 1"
      :disabled="props.modelValue >= lastPage"
      @select="$emit('update:modelValue', $event)"
    >
      &#8594;
    </AcvPaginationItem>
  </div>
</template>

<style scoped>
.acv-pagination {
  display: flex;
  align-items: center;
  margin-inline-start: auto;
  padding: var(--acv-spacing-regular) var(--acv-spacing-large);
  gap: var(--acv-spacing-zero);
}

.page-group {
  color: var(--acv-color-button-label-primary);
  text-align: center;
  font-family: var(--acv-font-family-default);
  font-size: var(--acv-font-size-body);
  font-weight: var(--acv-font-weight-strong);
  line-height: var(--acv-font-line-height-regular);
  min-inline-size: var(--acv-button-min-width);
  padding-inline: var(--acv-button-padding);
}
</style>
