<script setup>
  import Button from '@/components/button/button.vue';
  import { IconFromCloud16 } from '@acronis-platform/icons/from';
  import { IconToCloud16 } from '@acronis-platform/icons/to';
  </script>

<template>
  <div class="acv-grid-row acv-grid--cols-3">
    <Button
      size="large"
    >
      <template #prepend>
        <IconToCloud16 />
      </template>
      Prepend icon
    </Button>
    <Button
      size="large"
    >
      <template #prepend>
        <IconToCloud16 />
      </template>
      Two icons
      <template #append>
        <IconFromCloud16 />
      </template>
    </Button>
    <Button
      size="large"
    >
      Append icon
      <template #append>
        <IconFromCloud16 />
      </template>
    </Button>
    <Button>
      <template #prepend>
        <IconToCloud16 />
      </template>
      Prepend inline icon
    </Button>
    <Button>
      <template #prepend>
        <IconToCloud16 />
      </template>
      Two inline icons
      <template #append>
        <IconFromCloud16 />
      </template>
    </Button>
    <Button>
      Append inline icon
      <template #append>
        <IconFromCloud16 />
      </template>
    </Button>
  </div>
</template>

<style scoped>
.acv-button {
  margin-block: 10px;
}
</style>
