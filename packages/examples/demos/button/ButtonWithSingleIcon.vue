<script setup>
  import Button from '@/components/button/button.vue';
  import { IconAddressBook32 } from '@acronis-platform/icons/address';
  </script>

<template>
  <div class="acv-grid-row acv-grid--cols-3">
    <Button
      size="large"
    >
      <template #prepend>
        <IconAddressBook32 />
      </template>
    </Button>
    <Button>
      <template #prepend>
        <IconAddressBook32 />
      </template>
    </Button>
    <Button size="small">
      <template #prepend>
        <IconAddressBook32 />
      </template>
    </Button>

    <Button
      size="large"
      variant="ghost"
    >
      <template #prepend>
        <IconAddressBook32 />
      </template>
    </Button>
    <Button
      variant="ghost"
    >
      <template #prepend>
        <IconAddressBook32 />
      </template>
    </Button>
    <Button
      size="small"
      variant="ghost"
    >
      <template #prepend>
        <IconAddressBook32 />
      </template>
    </Button>

    <Button
      size="large"
      variant="secondary"
    >
      <template #prepend>
        <IconAddressBook32 />
      </template>
    </Button>
    <Button
      variant="secondary"
    >
      <template #prepend>
        <IconAddressBook32 />
      </template>
    </Button>
    <Button
      size="small"
      variant="secondary"
    >
      <template #prepend>
        <IconAddressBook32 />
      </template>
    </Button>
  </div>
</template>

<style scoped>
.acv-button {
  margin-block: 10px;
}
</style>
