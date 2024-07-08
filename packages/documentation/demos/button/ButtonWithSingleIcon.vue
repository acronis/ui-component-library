<script setup>
  import { ISyncedDSmall, ITrashOMedium, ITrashOSmall } from '@acronis-platform/icons';
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
      :icon="ITrashOMedium"
      size="large"
    >
      <template #icon>
        <Icon
          :icon="ITrashOSmall"
        ></Icon>
      </template>
    </Button>
    <Button
      size="large"
    >
      <Icon
        :icon="ITrashOMedium"
      ></Icon>
    </Button>
    <Button :icon="ISyncedDSmall">
    </Button>
    <Button size="small">
      <template #icon>
        <Icon
          :icon="ITrashOSmall"
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
