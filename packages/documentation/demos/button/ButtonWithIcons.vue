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
      :icon="ISyncedDSmall"
      size="large"
    >
      <template #icon>
        <Icon
          :icon="ITrashOSmall"
        ></Icon>
      </template>
      Large
    </Button>
    <Button
      size="large"
    >
      <Icon
        :icon="ITrashOMedium"
      ></Icon>
      Large
    </Button>
    <Button :icon="ISyncedDSmall">
      Default
    </Button>
    <Button size="small">
      <Icon
        :icon="ITrashOMedium"
      ></Icon>
      Small
    </Button>
    <Button
      size="large"
    >
      Right
      <Icon
        :icon="ITrashOMedium"
        size="32"
        color="white"
      ></Icon>
    </Button>
    <Button
      size="large"
      :rightIcon="ITrashOMedium"
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
