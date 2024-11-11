<script setup>
  import AcvAlert from '@/components/alert/alert.vue';
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <div class="qa-alert-action">
    <AcvAlert
      color="info"
      show-icon
      type="warning"
    >
      <template #content>
        <div class="acv-alert__title acv-text acv-text--strong">
          Advice
        </div>
        <div class="acv-text acv-text--body-24">
          Alert has solid background color by default. Use transparent to change its background to transparent color and produce the <b>background color overlapping effect</b>
        </div>
      </template>
      <template #subtitle>
        Error code <b>XXX</b>
      </template>
      <template #description>
        This is a description <b>‘smd://192.168.0.1’</b>
      </template>
      <template #actions>
        <AcvButton type="ghost">
          Action
        </AcvButton>
        <AcvButton type="ghost">
          Second action
        </AcvButton>
      </template>
    </AcvAlert>
  </div>
</template>
