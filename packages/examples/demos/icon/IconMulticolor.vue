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
        name="IconPlay32"
        color="brand-primary"
      />
    </Preview>
    <Preview
      name="Ghost button"
      span="6"
    >
      <Button variant="ghost">
        <Icon name="IconProtectionStatusWarning32" />
      </Button>
    </Preview>
    <Preview
      name="Secondary button"
      span="6"
    >
      <Button
        variant="secondary"
        icon="IconWorkstations32"
      >
        Button
      </Button>
    </Preview>
    <Preview
      name="Primary button"
      span="6"
    >
      <Button icon="IconWorkstations32">
        Button
      </Button>
    </Preview>
    <Preview
      name="Multicolor icon"
      span="6"
    >
      <Icon
        name="IconPirateTray16"
        size="32"
      />
    </Preview>
    <Preview
      name="Legacy"
      span="6"
    >
      <Icon
        name="IconWorkstations32"
        color="brand-primary"
        legacy
      />
    </Preview>
  </PreviewGroup>
</template>
