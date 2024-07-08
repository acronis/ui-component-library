<script setup lang="ts">
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-5">
    <div class="acv-layer">
      Test default
    </div>
    <div class="acv-layer hover">
      Test default hover
    </div>
    <div class="acv-layer active">
      Test default active
    </div>
    <div class="acv-layer focus">
      Test default focus
    </div>
    <div class="acv-layer disabled">
      Test default disabled
    </div>
  </div>

  <div class="acv-grid-row acv-grid--cols-5">
    <div class="acv-layer solid">
      Test solid
    </div>
    <div class="acv-layer solid hover">
      Test solid hover
    </div>
    <div class="acv-layer solid active">
      Test solid active
    </div>
    <div class="acv-layer solid focus">
      Test solid focus
    </div>
    <div class="acv-layer solid disabled">
      Test solid disabled
    </div>
  </div>

  <div class="acv-grid-row acv-grid--cols-5">
    <div class="acv-layer ghost">
      Test ghost
    </div>
    <div class="acv-layer ghost hover">
      Test ghost hover
    </div>
    <div class="acv-layer ghost active">
      Test ghost active
    </div>
    <div class="acv-layer ghost focus">
      Test ghost focus
    </div>
    <div class="acv-layer ghost disabled">
      Test ghost disabled
    </div>
  </div>

  <div class="acv-grid-row acv-grid--cols-5">
    <div class="acv-layer outline">
      Test outline
    </div>
    <div class="acv-layer outline hover">
      Test outline hover
    </div>
    <div class="acv-layer outline active">
      Test outline active
    </div>
    <div class="acv-layer outline focus">
      Test outline focus
    </div>
    <div class="acv-layer outline disabled">
      Test outline disabled
    </div>
  </div>

  <div class="acv-grid-row acv-grid--cols-5">
    <div class="acv-layer text">
      Test text
    </div>
    <div class="acv-layer text hover">
      Test text hover
    </div>
    <div class="acv-layer text active">
      Test text active
    </div>
    <div class="acv-layer text focus">
      Test text focus
    </div>
    <div class="acv-layer text disabled">
      Test text disabled
    </div>
  </div>

  <div
    class="acv-grid-row acv-grid--cols-5"
  >
    <div
      class="acv-layer solid"
      style="--acv-layer-color: var(--acv-color-red)"
    >
      Test solid
    </div>
    <div class="acv-layer solid hover">
      Test solid hover
    </div>
    <div class="acv-layer solid active">
      Test solid active
    </div>
    <div class="acv-layer solid focus">
      Test solid focus
    </div>
    <div class="acv-layer solid disabled">
      Test solid disabled
    </div>
  </div>

  <div
    class="acv-grid-row acv-grid--cols-5"
  >
    <div
      class="acv-layer solid secondary"
    >
      Test solid secondary
    </div>
    <div class="acv-layer solid secondary hover">
      Test solid secondary hover
    </div>
    <div class="acv-layer solid secondary active">
      Test solid secondary active
    </div>
    <div class="acv-layer solid secondary focus">
      Test solid secondary focus
    </div>
    <div class="acv-layer solid secondary disabled">
      Test solid secondary disabled
    </div>
  </div>

  <div
    class="acv-grid-row acv-grid--cols-5"
  >
    <div
      class="acv-layer outline secondary"
    >
      Test outline secondary
    </div>
    <div class="acv-layer outline secondary hover">
      Test outline secondary hover
    </div>
    <div class="acv-layer outline secondary active">
      Test outline secondary active
    </div>
    <div class="acv-layer outline secondary focus">
      Test outline secondary focus
    </div>
    <div class="acv-layer outline secondary disabled">
      Test outline secondary disabled
    </div>
  </div>
</template>

<style scoped>
  .acv-layer {
    width: 100%;
    line-height: 48px;
    padding-inline: 16px;
    padding-block: 16px;
  }
</style>
