<script setup>
  import Button from '@/components/button/button.vue';
  import Icon from '@/components/icon/icon.vue';
</script>

<template>
  <PreviewGroup class="qa-icon-basic">
    <Preview
      name="Default"
      span="6"
    >
      <Icon
        name="i-workstations-o--16"
        color="brand-primary"
      ></Icon>
    </Preview>
    <Preview
      name="Ghost button"
      span="6"
    >
      <Button type="ghost">
        <Icon name="i-workstations-o--16" />
      </Button>
    </Preview>
    <Preview
      name="Secondary button"
      span="6"
    >
      <Button
        type="secondary"
        icon="i-workstations-o--16"
      >
        Button
      </Button>
    </Preview>
    <Preview
      name="Primary button"
      span="6"
    >
      <Button icon="i-workstations-o--16">
        Button
      </Button>
    </Preview>
    <Preview
      name="Multicolor icon"
      span="6"
    >
      <Icon
        name="SyncedDSmall"
        size="32"
      ></Icon>
    </Preview>
    <Preview
      name="Legacy"
      span="6"
    >
      <Icon
        name="i-workstations-o--16"
        color="brand-primary"
        legacy
      ></Icon>
    </Preview>
  </PreviewGroup>
</template>
