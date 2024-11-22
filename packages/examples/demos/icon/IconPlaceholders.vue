<script setup>
  import ElIcon from '@/components/icon/icon.vue';
  import { IconWorkstations32 } from '@acronis-platform/icons/workstations';
</script>

<template>
  <preview-group class="qa-icon-placeholders">
    <preview
      name="External source"
      span="12"
    >
      <component :is="IconWorkstations32" />
    </preview>
    <preview
      name="Placeholder source"
      span="12"
    >
      <ElIcon source="placeholder" />
    </preview>
  </preview-group>
  <preview-group>
    <preview
      name="Dynamic - named icon"
      span="12"
    >
      <ElIcon
        name="IconWorkstations32"
        size="64"
        color="brand-primary"
      />
    </preview>
  </preview-group>
  <preview-group>
    <preview
      name="size: 72"
      span="12"
    >
      <ElIcon
        name="IconWorkstations32"
        size="72"
        color="brand-primary"
      />
    </preview>
    <preview
      name="size: 96"
      span="12"
    >
      <ElIcon
        name="IconWorkstations32"
        size="96"
        color="brand-primary"
      />
    </preview>
  </preview-group>
</template>
