<script setup>
  import Button from '@/components/button/button.vue';
  import Icon from '@/components/icon/icon.vue';
</script>

<template>
  <PreviewGroup class="qa-icon-basic">
    <Preview
      name="Ghost button"
      span="6"
    >
      <Button variant="ghost">
        <Icon name="Workstation16" />
      </Button>
    </Preview>
    <Preview
      name="Secondary button"
      span="6"
    >
      <Button
        type="secondary"
        icon="Workstations32"
      >
        Button
      </Button>
    </Preview>
    <Preview
      name="Primary button"
      span="6"
    >
      <Button icon="Sync16">
        Button
      </Button>
    </Preview>
    <Preview
      name="Multicolor icon"
      span="6"
    >
      <Icon name="Sync16" />
    </Preview>
    <Preview
      name="Legacy"
      span="6"
    >
      <Icon
        name="workstations--32"
        color="brand-primary"
        legacy
      />
    </Preview>
  </PreviewGroup>
</template>
