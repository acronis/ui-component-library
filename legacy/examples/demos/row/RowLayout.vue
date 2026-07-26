<script setup>
  import Column from '@/components/column/column.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Row
    :cols="4"
    :rows="3"
    :gutter="16"
  >
    <Column
      :col-span="2"
      :row-span="2"
      :row="1"
      :col="1"
    >
      <div class="grid-content bg-brand-light">
        1
      </div>
    </Column>
    <Column
      :span="2"
      :row="1"
      :col="3"
    >
      <div class="grid-content bg-brand-accent">
        2
      </div>
    </Column>
    <Column
      :span="2"
      :row="1"
      :col="4"
    >
      <div class="grid-content bg-brand-light">
        3
      </div>
    </Column>
    <Column
      :col-span="2"
      :row="2"
      :col="3"
    >
      <div class="grid-content bg-brand-accent">
        4
      </div>
    </Column>
    <Column
      :row="3"
      :col="1"
    >
      <div class="grid-content bg-brand-light">
        5
      </div>
    </Column>
    <Column
      :row="3"
      :col="2"
    >
      <div class="grid-content bg-brand-accent">
        6
      </div>
    </Column>
    <Column
      :row="3"
      :col="3"
    >
      <div class="grid-content bg-brand-light">
        7
      </div>
    </Column>
    <Column
      :row="3"
      :col="4"
    >
      <div class="grid-content bg-brand-accent">
        8
      </div>
    </Column>
  </Row>
</template>

<style scoped>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 100%;
}

.bg-brand-light {
  background-color: var(--acv-color-primary-lighter);
}

.bg-brand-accent {
  background-color: var(--acv-color-accent);
}
</style>
