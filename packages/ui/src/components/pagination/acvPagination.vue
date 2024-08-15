<script lang="ts" setup>
  import { computed } from 'vue';
  import AcvPaginationItem from './acvPaginationItem.vue';
  import type { AcvPaginationProps } from '@/components';

  const props = defineProps<AcvPaginationProps>();

  const page = computed(() => props.pagination.page.value);
  const lastPage = computed(() => props.pagination.lastPage.value);
</script>

<template>
  <div class="acv-pagination">
    <AcvPaginationItem
      :page="page - 1"
      :disabled="page <= 1"
    >
      &#8592;
    </AcvPaginationItem>

    <AcvPaginationItem
      :page="1"
      :active="page === 1"
    />

    <template v-if="lastPage <= 7">
      <template v-for="p of 5">
        <AcvPaginationItem
          v-if="p + 1 <= lastPage"
          :key="p"
          :page="p + 1"
          :active="page === p + 1"
        />
      </template>
    </template>
    <template v-else>
      <template v-if="page <= 4">
        <AcvPaginationItem
          v-for="p of 3"
          :key="p"
          :page="p + 1"
          :active="page === p + 1"
        />
        <AcvPaginationItem
          :page="5"
          :active="page === 5"
        />
        <div class="page-group">
          ...
        </div>
      </template>
      <template v-else-if="page > lastPage - 4">
        <div class="page-group">
          ...
        </div>
        <AcvPaginationItem
          v-for="p of 4"
          :key="p"
          :page="lastPage - 5 + p"
          :active="page === lastPage - 5 + p"
        />
      </template>
      <template v-else>
        <div class="page-group">
          ...
        </div>
        <AcvPaginationItem :page="page - 1" />
        <AcvPaginationItem
          :page="page"
          active
        />
        <AcvPaginationItem :page="page + 1" />
        <div class="page-group">
          ...
        </div>
      </template>
    </template>

    <AcvPaginationItem
      v-if="lastPage !== 1"
      :page="lastPage"
      :active="page === lastPage"
    />

    <AcvPaginationItem
      :page="page + 1"
      :disabled="page >= lastPage"
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
}
</style>
