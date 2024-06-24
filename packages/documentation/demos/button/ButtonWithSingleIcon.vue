<script setup>
  import { ITrashOMedium } from '@acronis-platform/icons';
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
      icon="SyncedDSmall"
      size="large"
    >
    </Button>
    <Button
      size="large"
    >
      <Icon
        :icon="ITrashOMedium"
        size="32"
        color="primary"
      ></Icon>
    </Button>
    <Button icon="SyncedDSmall">
    </Button>
    <Button size="small">
      <template #icon>
        <Icon
          name="TrashOSmall"
          color="white"
        ></Icon>
      </template>
    </Button>
  </Row>
</template>

<style scoped>
.acv-button {
  margin-block: 10px;
}
</style>
