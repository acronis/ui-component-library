<script setup>
  import AcvAlert from '@/components/alert/alert.vue';
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <div class="qa-alert-action">
    <AcvAlert
      :content="{
        title: 'Troubleshoot',
        texts: ['Alert has solid background color by default. Use transparent to change its background to transparent color and produce the background color overlapping effect'],
      }"
      type="error"
      title="This is title"
      description="This is a description."
      subtitle="Error code XXX"
      show-icon
      hide-close
    >
      <template #actions>
        <AcvButton type="ghost">
          Action
        </AcvButton>
      </template>
    </AcvAlert>
  </div>
</template>
