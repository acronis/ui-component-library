<script setup>
  import Icon from '@/components/icon/icon.vue';
</script>

<template>
  <PreviewGroup class="qa-icon-sizes">
    <Preview
      name="small / 16"
      span="6"
    >
      <Icon
        name="WorkstationsPremiumOMedium"
        color="brand-primary"
        size="16"
      />
    </Preview>
    <Preview
      name="medium / 24"
      span="6"
    >
      <Icon
        name="WorkstationsPremiumOMedium"
        color="brand-primary"
        size="24"
      />
    </Preview>
    <Preview
      name="xl / 48"
      span="6"
    >
      <Icon
        name="NasAbLarge"
        color="brand-primary"
        size="64"
      />
    </Preview>
    <Preview
      name="xxxl / 96"
      span="6"
    >
      <Icon
        name="NasAbLarge"
        color="brand-primary"
        size="96"
      />
    </Preview>
  </PreviewGroup>
</template>
