<script setup>
  import IconTrash from '@acronis-platform/icons/constructor/trash/IconTrash.vue';
  import Icon from '@/components/icon/icon.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
</script>

<template>
  <AcvDropdown
    trigger="click"
    persist
  >
    <Icon
      :icon="IconTrash"
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
