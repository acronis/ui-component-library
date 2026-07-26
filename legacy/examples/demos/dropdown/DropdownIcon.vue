<script setup>
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
  import Icon from '@/components/icon/icon.vue';
  import { IconAddressBook32 } from '@acronis-platform/icons/address';
</script>

<template>
  <AcvDropdown
    trigger="click"
    persist
  >
    <Icon
      :icon="IconAddressBook32"
    />
    <template #dropdown>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </template>
  </AcvDropdown>
</template>
