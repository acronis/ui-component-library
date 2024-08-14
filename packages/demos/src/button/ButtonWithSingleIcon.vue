<script setup>
  import { IconAddressBook32 } from '@acronis-platform/icons/address';
  import Button from '@/components/button/button.vue';
  </script>

<template>
  <div class="acv-grid-row acv-grid--cols-3">
    <Button
      :icon="IconAddressBook32"
      size="large"
    />
    <Button :icon="IconAddressBook32" />
    <Button size="small">
      <IconAddressBook32 />
    </Button>

    <Button
      :icon="IconAddressBook32"
      size="large"
      variant="ghost"
    />
    <Button
      :icon="IconAddressBook32"
      variant="ghost"
    />
    <Button
      size="small"
      variant="ghost"
    >
      <IconAddressBook32 />
    </Button>

    <Button
      :icon="IconAddressBook32"
      size="large"
      variant="outline"
    />
    <Button
      :icon="IconAddressBook32"
      variant="outline"
    />
    <Button
      size="small"
      variant="outline"
    >
      <IconAddressBook32 />
    </Button>
  </div>
</template>

<style scoped>
.acv-button {
  margin-block: 10px;
}
</style>
