<script setup>
  import { AcvAlert, AcvButton } from '@acronis-platform/ui-component-library';
</script>

<template>
  <div>
    <AcvAlert
      type="info"
      advanced
      description="This is a description."
    >
      <template #actions>
        <AcvButton type="ghost">
          Action
        </AcvButton>
      </template>
    </AcvAlert>
  </div>
</template>
