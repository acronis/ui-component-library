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
      />
    </Preview>
    <Preview
      name="Ghost button"
      span="6"
    >
      <Button type="ghost">
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
      >
        Button
      </Button>
    </Preview>
    <Preview
      name="Primary button"
      span="6"
    >
      <Button icon="workstations--32">
        Button
      </Button>
    </Preview>
    <Preview
      name="Multicolor icon"
      span="6"
    >
      <Icon
        name="PirateTray16"
        size="32"
      />
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
