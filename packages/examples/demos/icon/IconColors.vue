<script setup>
  import ElIcon from '@/components/icon/icon.vue';
</script>

<template>
  <preview-group class="qa-icon-sizes">
    <preview
      name="primary"
      span="6"
    >
      <ElIcon
        name="IconWorkstation32"
        color="primary"
        size="xxx-large"
      />
    </preview>
    <preview
      name="danger"
      span="6"
    >
      <ElIcon
        name="IconWorkstation32"
        color="danger"
        size="xxx-large"
      />
    </preview>
  </preview-group>
</template>
