<script setup>
  import { IconSync16 } from '@acronis-platform/icons/acronis/sync';
  import IconAddressBook32 from '@acronis-platform/icons/acronis/address/IconAddressBook32.vue';
  import Button from '@/components/button/button.vue';
  import Icon from '@/components/icon/icon.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Row
    :gap="24"
    cols="6"
    justify="center"
  >
    <Button
      :icon="IconAddressBook32"
      size="large"
    >
      <template #icon>
        <Icon
          :icon="IconAddressBook32"
        />
      </template>
    </Button>
    <Button
      size="large"
    >
      <Icon
        :icon="IconAddressBook32"
      />
    </Button>
    <Button :icon="IconSync16" />
    <Button size="small">
      <template #icon>
        <Icon
          :icon="IconAddressBook32"
          color="white"
        />
      </template>
    </Button>
  </Row>
</template>

<style scoped>
.acv-button {
  margin-block: 10px;
}
</style>
