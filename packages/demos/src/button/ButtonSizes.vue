<script setup>
  import Button from '@/components/button/button.vue';
  import Row from '@/components/row/row.vue';
  </script>

<template>
  <Row
    justify="center"
    :gap="16"
  >
    <Button size="small">
      Small Button
    </Button>
    <Button>
      Default Button
    </Button>
    <Button size="medium">
      Medium Button
    </Button>
    <Button size="large">
      Large Button
    </Button>
  </Row>
  <Row
    justify="center"
    :gap="16"
  >
    <Button
      variant="outline"
      size="small"
    >
      Small Button
    </Button>
    <Button variant="outline">
      Default Button
    </Button>
    <Button
      variant="outline"
      size="medium"
    >
      Medium Button
    </Button>
    <Button
      variant="outline"
      size="large"
    >
      Large Button
    </Button>
  </Row>
</template>
