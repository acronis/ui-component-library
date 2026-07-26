<script setup>
  import Button from '@/components/button/button.vue';
  import Icon from '@/components/icon/icon.vue';
  import Row from '@/components/row/row.vue';
  import { IconAddressBook32 } from '@acronis-platform/icons/address';
  import { IconSync16 } from '@acronis-platform/icons/sync';
</script>

<template>
  <Row
    :gap="24"
    cols="6"
    justify="center"
  >
    <Button
      :icon="IconSync16"
      size="large"
    >
      <template #icon>
        <Icon
          :icon="IconAddressBook32"
        />
      </template>
      Large
    </Button>
    <Button
      size="large"
    >
      <Icon
        :icon="IconAddressBook32"
      />
      Large
    </Button>
    <Button :icon="IconSync16">
      Default
    </Button>
    <Button size="small">
      <Icon
        :icon="IconAddressBook32"
      />
      Small
    </Button>
    <Button
      size="large"
    >
      Right
      <Icon
        :icon="IconAddressBook32"
        size="32"
        color="white"
      />
    </Button>
    <Button
      size="large"
      :right-icon="IconAddressBook32"
    >
      Right with prop
    </Button>
  </Row>
</template>

<style scoped>
.acv-button {
  margin-block: 10px;
}
</style>
