<script setup>
  import ElButton from '@/components/button/button.vue';
  import ElIcon from '@/components/icon/icon.vue';
</script>

<template>
  <preview-group class="qa-icon-basic">
    <preview
      name="Default"
      span="6"
    >
      <ElIcon
        name="IconWorkstation32"
        disabled
      />
    </preview>
    <preview
      name="Ghost button"
      span="6"
    >
      <ElButton
        type="ghost"
        disabled
      >
        <ElIcon name="IconWorkstation32" />
      </ElButton>
    </preview>
    <preview
      name="Secondary button"
      span="6"
    >
      <ElButton
        type="secondary"
        icon="IconWorkstation32"
        disabled
      >
        Button
      </ElButton>
    </preview>
    <preview
      name="Primary button"
      span="6"
    >
      <ElButton
        icon="IconWorkstation32"
        disabled
      >
        Button
      </ElButton>
    </preview>
  </preview-group>
</template>
