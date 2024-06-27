<script setup>
  import { computed, ref } from 'vue';

  const { name } = defineProps({
    name: {
      type: String,
      default: ''
    }
  });

  const element = ref(null);

  const colorValue = computed(() => {
    if (!element?.value) {
      return;
    }

    return getComputedStyle(element.value).getPropertyValue(name);
  });
</script>

<template>
  <div class="color">
    <div
      ref="element"
      class="color-value"
      :style="`background-color: var(${name})`"
    >
    </div>
    <strong :title="name">{{ name }}</strong>
    <span :title="colorValue">{{ colorValue }}</span>
    <span class="description"><slot></slot></span>
  </div>
</template>

<style scoped>
.color {
  box-sizing: border-box;
  padding: 0 16px 0 0;
  font: 500 14px/24px 'Roboto Mono', monospace;
  white-space: nowrap;
  width: 48%;
  overflow: hidden;
  display: inline-block;

  .color-value {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    margin: 10px;
    box-shadow: 0 0 4px hsla(0deg, 0%, 0%, 0.1);
    border: 1px solid var(--acv-color-brand-primary);
  }

  & span,
  & strong {
    display: block;
    background: var(--acv-color-white);
    font-size: var(--acv-base-font-size-12);
    color: var(--acv-color-text-primary);
    padding: 4px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .description {
    white-space: normal;
  }
}
</style>
