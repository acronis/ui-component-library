<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvPopover from '@/components/popover/popover.vue';
</script>

<template>
  <div
    class="test-wrapper"
  >
    <div
      class="test-container"
    />

    <AcvPopover
      :offset="10"
      class="test-popover"
      arrow
    >
      <template #reference>
        <AcvButton class="test-reference">
          Flip
        </AcvButton>
      </template>
      <div class="text-popover">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </div>
    </AcvPopover>
  </div>
</template>

<style scoped>
  .test-wrapper {
    background-color: var(--acv-color-brand-secondary);
    border: 0 solid hsl(231deg 25% 80%);
    box-sizing: border-box;
    display: grid;
    height: 20rem;
    width: 50vw;
    overflow: hidden;
    overflow-y: auto;
    padding: .5rem;
    place-items: center;
    position: relative;
  }

  :deep(.reference) {
    margin: 310px auto;

  }

  .test-popover {
    margin-block: 200px 200px;
  }

  .text-popover {
    background-color: hsl(292deg 100% 50%);
    color: var(--acv-color-white);
  }

  .test-container {
    height: 500px;
    width: 1px;
  }
</style>
