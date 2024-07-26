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
        name="workstation--16"
        color="brand-primary"
      />
    </Preview>
    <Preview
      name="Ghost button"
      span="6"
    >
      <AcvButton type="ghost">
        <Icon name="workstations--32" />
      </AcvButton>
    </Preview>
    <Preview
      name="Secondary button"
      span="6"
    >
      <AcvButton
        type="secondary"
        icon="workstations-32"
      >
        Button
      </AcvButton>
      <AcvButton
        type="secondary"
        icon="workstation-16"
      >
        Button
      </AcvButton>
    </Preview>
    <Preview
      name="Primary button"
      span="6"
    >
      <AcvButton icon="workstation--16">
        Button
      </AcvButton>
      <AcvButton icon="workstations--32">
        Button
      </AcvButton>
    </Preview>
  </PreviewGroup>
</template>
