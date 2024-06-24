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
      ></Icon>
    </Preview>
    <Preview
      name="medium / 24"
      span="6"
    >
      <Icon
        name="WorkstationsPremiumOMedium"
        color="brand-primary"
        size="24"
      ></Icon>
    </Preview>
    <Preview
      name="xl / 48"
      span="6"
    >
      <Icon
        name="NasAbLarge"
        color="brand-primary"
        size="64"
      ></Icon>
    </Preview>
    <Preview
      name="xxxl / 96"
      span="6"
    >
      <Icon
        name="NasAbLarge"
        color="brand-primary"
        size="96"
      ></Icon>
    </Preview>
  </PreviewGroup>
</template>
