<script setup>
  import Column from '@/components/column/column.vue';
  import Divider from '@/components/divider/divider.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Divider>Horizontal gap</Divider>
  <Row :gap="16">
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
  </Row>
  <Divider>Both horizontal and vertical gap</Divider>
  <Row :gap="[16, 24]">
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
    <Column :span="6">
      <div class="content">
        span-6
      </div>
    </Column>
  </Row>
</template>

<style scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 48px;
  color: var(--acv-color-white);
  background-color: var(--acv-color-brand-primary);
  border-radius: var(--acv-radius-small);
}
</style>
