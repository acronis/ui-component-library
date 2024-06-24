<script setup lang="ts">
  import { Icon, useVisibilityObserver } from '@acronis-platform/ui-component-library';
  import { shallowRef, watch } from 'vue';

  const props = defineProps<{
    icons: string[]
  }>();

  const { vVisibilityObserverItem, visible } = useVisibilityObserver();
  const initialGroups = getGroups();
  const groups = shallowRef(initialGroups.slice(0, 2));

  watch(visible, onVisibleIndexChange);

  function onVisibleIndexChange() {
    // add group when user scrolling bottom
    if (visible.has(groups.value.length - 1) && groups.value.length < initialGroups.length) {
      groups.value = [...groups.value, initialGroups[groups.value.length]];
    }
  }

  function getGroups() {
    const icons = props.icons.map(name => ({ name }));
    const result = [];

    while (icons.length) {
      result.push(icons.splice(0, 360));
    }

    return result;
  }
</script>

<template>
  <h3>Total {{ icons.length }} icons</h3>
  <div class="icons">
    <div
      v-for="(group, index) of groups"
      :key="index"
      v-visibility-observer-item="index"
      class="icons__group"
    >
      <div
        v-for="icon of group"
        :key="icon.name"
        class="icons__item"
      >
        <div
          class="icons__icon"
        >
          <Icon
            :title="icon.name"
            :name="icon.name"
            collection="acronis"
            size="48"
          />
          <!--          <div class="icons__name"> -->
          <!--            {{ icon.name }} -->
          <!--          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
 .icons__group {
   display: grid;
   justify-content: space-between;
   grid-template-columns: repeat(auto-fit, calc(20% - 30px));
   gap: 8px;
 }

 .icons__item {
   background-color: var(--acv-color-secondary-lightest);
    display: flex;
   justify-content: center;
    align-items: center;
   padding: 8px;
   aspect-ratio: 1;
   overflow: hidden;
 }

 .icons__icon,
 .icons__name {
   overflow: hidden;
 }
</style>
