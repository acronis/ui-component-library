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
        name="workstations--32"
        color="brand-primary"
        disabled
      />
    </Preview>
    <Preview
      name="Ghost button"
      span="6"
    >
      <Button
        type="ghost"
        disabled
      >
        <Icon name="workstations--32" />
      </Button>
    </Preview>
    <Preview
      name="Secondary button"
      span="6"
    >
      <Button
        type="secondary"
        icon="workstations--32"
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
        icon="workstations--32"
        disabled
      >
        Button
      </Button>
    </Preview>
  </PreviewGroup>
</template>
