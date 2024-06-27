<script setup>
  import Button from '@/components/button/button.vue';
  import Row from '@/components/row/row.vue';
  import Column from '@/components/column/column.vue';
</script>

<template>
  <Row
    align="middle"
    justify="center"
    :gap="16"
  >
    <Column :span="8">
      <Button>
        Default Button
      </Button>
    </Column>
    <Button size="small">
      Small Button
    </Button>
    <Button size="medium">
      Medium Button
    </Button>
    <Button size="large">
      Large Button
    </Button>
  </Row>
  <Row
    align="middle"
    justify="center"
    :gap="16"
  >
    <Column :span="8">
      <Button variant="secondary">
        Default Button
      </Button>
    </Column>
    <Button
      variant="secondary"
      size="small"
    >
      Small Button
    </Button>
    <Button
      variant="secondary"
      size="medium"
    >
      Medium Button
    </Button>
    <Button
      variant="secondary"
      size="large"
    >
      Large Button
    </Button>
  </Row>
</template>
