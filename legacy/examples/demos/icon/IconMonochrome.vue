<script setup>
  import AcvButton from '@/components/button/button.vue';
  import Icon from '@/components/icon/icon.vue';
</script>

<template>
  <PreviewGroup class="qa-icon-basic">
    <Preview
      name="Default"
      span="6"
    >
      <Icon
        name="IconWorkstations32"
        color="brand-primary"
      />
    </Preview>
    <Preview
      name="Ghost button"
      span="6"
    >
      <AcvButton variant="ghost">
        <Icon name="IconWorkstation32" />
      </AcvButton>
    </Preview>
    <Preview
      name="Secondary button"
      span="6"
    >
      <AcvButton
        variant="secondary"
        icon="IconWorkstations32"
      >
        Button
      </AcvButton>
    </Preview>
    <Preview
      name="Primary button"
      span="6"
    >
      <AcvButton icon="IconWorkstation32">
        Button
      </AcvButton>
    </Preview>
  </PreviewGroup>
</template>
