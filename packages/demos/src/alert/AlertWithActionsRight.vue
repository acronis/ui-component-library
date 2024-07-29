<script setup>
  import { AcvAlert, AcvButton } from '@acronis-platform/ui-component-library';
</script>

<template>
  <div class="acv-grid">
    <AcvAlert
      type="info"
      title="With title"
      description="This is a description."
    >
      <template #right>
        <AcvButton type="ghost">
          Actions right
        </AcvButton>
      </template>
    </AcvAlert>
    <AcvAlert
      type="info"
      title="With title"
      description="This is a description."
    >
      <template #right>
        <AcvButton type="primary">
          Actions right
        </AcvButton>
      </template>
    </AcvAlert>
  </div>
</template>
