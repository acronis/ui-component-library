<script setup>
  import { Divider } from '@acronis-platform/ui-component-library';
</script>

<template>
  <ui-grid>
    <ui-row class="bg-brand-lightest">
      <Divider></Divider>
    </ui-row>
    <ui-row
      span="6"
      class="bg-brand-accent"
    >
      ## Vertical
      <Divider
        class="mr-16"
        vertical
      ></Divider>
    </ui-row>
    <ui-row
      span="6"
      class="bg-brand-light"
    >
      ##Vertical small
      <Divider :vertical="24"></Divider>
    </ui-row>
  </ui-grid>
</template>
