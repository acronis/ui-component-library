<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
</script>

<template>
  <div>
    <AcvDropdown
      trigger="click"
      persist
      placement="right"
    >
      <AcvButton>
        Dropdown Trigger
      </AcvButton>
      <template #dropdown>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </template>
    </AcvDropdown>
  </div>
</template>
