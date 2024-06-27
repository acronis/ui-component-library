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
        disabled
      ></Icon>
    </Preview>
    <Preview
      name="Ghost button"
      span="6"
    >
      <Button
        type="ghost"
        disabled
      >
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
        disabled
      >
        Button
      </Button>
    </Preview>
    <Preview
      name="Primary button"
      span="6"
    >
      <Button
        icon="i-workstations-o--16"
        disabled
      >
        Button
      </Button>
    </Preview>
  </PreviewGroup>
</template>
