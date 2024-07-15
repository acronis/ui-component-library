<script setup>
  import { IconSync16 } from '@acronis-platform/icons/acronis/sync';
  import IconTrash from '@acronis-platform/icons/constructor/trash/IconTrash.vue';
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
      :icon="IconTrash"
      size="large"
    >
      <template #icon>
        <Icon
          :icon="IconTrash"
        />
      </template>
    </Button>
    <Button
      size="large"
    >
      <Icon
        :icon="IconTrash"
      />
    </Button>
    <Button :icon="IconSync16" />
    <Button size="small">
      <template #icon>
        <Icon
          :icon="IconTrash"
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
