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

    <AcvPopover>
      <template #reference>
        <AcvButton>
          Open Popover
        </AcvButton>
      </template>
      <div class="test-popover">
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
    overflow-x: auto;
    padding: .5rem;
    place-items: center;
    position: relative;
  }

  .test-popover {
    padding: 8px;
  }

  .test-container {
    width: 100vw;
    height: 1px;
  }
</style>
