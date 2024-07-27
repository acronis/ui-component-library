<script setup>
  import AcvDivider from '@/components/divider/divider.vue';
</script>

<template>
  <div>
    <div class="acv-bg-primary">
      <h3>First row</h3>
      <AcvDivider />
      <h3>Second row</h3>
    </div>
    <div
      class="my-16 acv-grid-row acv-grid--cols-3 acv-bg-primary place-items-center"
    >
      <div>
        <h3>First column</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi</p>
      </div>

      <AcvDivider
        class="mr-16"
        vertical
      />
      <div>
        <h3>Second column</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi</p>
      </div>
    </div>
    <div
      class="acv-bg-primary"
    >
      <span>Vertical small</span>

      <AcvDivider :vertical="24" />

      <AcvDivider :vertical="48" />

      <AcvDivider :vertical="64" />

      <AcvDivider :vertical="72" />

      <AcvDivider :vertical="96" />
    </div>
  </div>
</template>
