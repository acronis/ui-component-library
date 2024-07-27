<script setup>
  import { AcvAlert, AcvButton } from '@acronis-platform/ui-component-library';
</script>

<template>
  <div class="qa-alert-action">
    <AcvAlert
      type="info"
      title="With title"
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
