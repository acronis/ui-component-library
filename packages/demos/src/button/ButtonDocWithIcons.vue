<script setup>
  import { IconToCloud16 } from '@acronis-platform/icons/to';
  import { IconFromCloud16 } from '@acronis-platform/icons/from';
  import Button from '@/components/button/button.vue';
  </script>

<template>
  <div class="acv-grid-row acv-grid--cols-3">
    <Button
      :icon="IconToCloud16"
      size="large"
    >
      Prepend icon
    </Button>
    <Button
      size="large"
      :icon="IconToCloud16"
      :append-icon="IconFromCloud16"
    >
      Two icons
    </Button>
    <Button
      size="large"
      :append-icon="IconFromCloud16"
    >
      Append icon
    </Button>
    <Button>
      <IconToCloud16 />
      Prepend inline icon
    </Button>
    <Button>
      <IconToCloud16 />
      Two inline icons
      <IconFromCloud16 />
    </Button>
    <Button>
      Append inline icon
      <IconFromCloud16 />
    </Button>
  </div>
</template>

<style scoped>
.acv-button {
  margin-block: 10px;
}
</style>
