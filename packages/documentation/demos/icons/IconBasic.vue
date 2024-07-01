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
        name="AcronisCloudLarge"
        color="brand-primary"
        size="32"
        animation="spin"
      ></Icon>
    </Preview>
    <Preview
      name="Ghost button"
      span="6"
    >
      <Button variant="ghost">
        <Icon name="WorkstationsOSmall" />
      </Button>
    </Preview>
    <Preview
      name="Secondary button"
      span="6"
    >
      <Button
        variant="secondary"
        icon="WorkstationsOSmall"
      >
        Button
      </Button>
    </Preview>
    <Preview
      name="Primary button"
      span="6"
    >
      <Button icon="SyncedDSmall">
        Button
      </Button>
    </Preview>
    <Preview
      name="Multicolor icon"
      span="6"
    >
      <Icon name="SyncedDSmall"></Icon>
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
