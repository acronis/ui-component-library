<script setup lang="ts">
  import { useVisibilityObserver } from '@acronis-platform/ui-component-library';
  import { shallowRef, watch } from 'vue';
  import IconButton from './IconButton.vue';
  import { useIcons } from './useIcons.ts';

  const props = defineProps<{
    icons: object[]
    collection: 'string'
    type: 'string'
  }>();

  const { /* vVisibilityObserverItem, */ visible } = useVisibilityObserver();

  watch(visible, onVisibleIndexChange);

  const { displayIcons, iconNames } = useIcons({ collection: 'acronis' });

  const initialGroups = getGroups();
  const groups = shallowRef(initialGroups.slice(0, 2));

  function onVisibleIndexChange() {
    // add group when user scrolling bottom
    if (visible.has(groups.value.length - 1) && groups.value.length < initialGroups.length) {
      groups.value = [...groups.value, initialGroups[groups.value.length]];
    }
  }

  function getGroups() {
    const icons = iconNames.map(name => ({ name }));
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
    <IconButton
      v-for="icon in displayIcons"
      :key="icon[0]"
      :type="props.type"
      :name="icon[0]"
      :icon="icon[1]"
      @click="copy(icon[0])"
    >
      {{ icon }}
    </IconButton>

    <!--    <div -->
    <!--      v-for="(group, index) of groups" -->
    <!--      :key="index" -->
    <!--      v-visibility-observer-item="index" -->
    <!--      class="icons__group" -->
    <!--    > -->
    <!--      <div -->
    <!--        v-for="icon of group" -->
    <!--        :key="icon.name" -->
    <!--        class="icons__item" -->
    <!--      > -->
    <!--        <div -->
    <!--          class="icons__icon" -->
    <!--        > -->
    <!--          <Icon -->
    <!--            :title="icon.name" -->
    <!--            :name="icon.name" -->
    <!--            :icon="() => icon.cmp" -->
    <!--            collection="acronis" -->
    <!--            size="48" -->
    <!--          /> -->
    <!--          <div class="icons__name"> -->
    <!--            {{ icon.name }} -->
    <!--          </div> -->
    <!--        </div> -->
    <!--      </div> -->
    <!--    </div> -->
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
