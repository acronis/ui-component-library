<script setup>
  import { AcvAlert, AcvButton } from '@acronis-platform/ui-component-library';
</script>

<template>
  <div class="qa-alert-action">
    <AcvAlert
      content-block-type="info"
      show-icon
      type="warning"
    >
      <template #content>
        <div class="Acv-alert__title Acv-text Acv-text--strong">
          Advice
        </div>
        <div class="Acv-text Acv-text--body-24">
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
