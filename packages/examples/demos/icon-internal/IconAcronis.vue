<script setup>
// TODO: use icons from @acronis-platform/icons
  // import * as icons from '@acronis-platform/icons-old/dist/public';
</script>

<template>
  <!--  Totally {{ Object.keys(icons).length }} icons available: -->

  <div class="acv-grid-row acv-grid--cols-3 my-16">
    <!--    <div -->
    <!--      v-for="(icon, index) in icons" -->
    <!--      :key="`icon${index}`" -->
    <!--      class="item" -->
    <!--    > -->
    <!--      <h5 class="acv-text&#45;&#45;ellipsis"> -->
    <!--        {{ index }} -->
    <!--      </h5> -->
    <!--      <component -->
    <!--        :is="icon" -->
    <!--        class="icon" -->
    <!--      /> -->
    <!--    </div> -->
  </div>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  justify-content: center;
  width: 100%;
}

.icon {
  width: 32px;
  height: 32px;
}
</style>
