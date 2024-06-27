<script setup>
  import { ITrashOSmall } from '@acronis-platform/icons';
  import Icon from '@/components/icon/icon.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
</script>

<template>
  <AcvDropdown
    trigger="click"
    persist
  >
    <Icon
      :icon="ITrashOSmall"
    ></Icon>
    <template #dropdown>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </template>
  </AcvDropdown>
</template>
