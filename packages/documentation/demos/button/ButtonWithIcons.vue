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
      :icon="IconSync16"
      size="large"
    >
      <template #icon>
        <Icon
          :icon="ITrashOSmall"
        />
      </template>
      Large
    </Button>
    <Button
      size="large"
    >
      <Icon
        :icon="IconTrash"
      />
      Large
    </Button>
    <Button :icon="IconSync16">
      Default
    </Button>
    <Button size="small">
      <Icon
        :icon="IconTrash"
      />
      Small
    </Button>
    <Button
      size="large"
    >
      Right
      <Icon
        :icon="IconTrash"
        size="32"
        color="white"
      />
    </Button>
    <Button
      size="large"
      :right-icon="IconTrash"
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
