<script setup>
  import Alert from '@/components/alert/alert.vue';
  import Button from '@/components/button/button.vue';
  import Link from '@/components/link/link.vue';

  const text = 'Long text'.repeat(20) + 'Nobreak'.repeat(30);
</script>

<template>
  <Alert
    variant="info"
    :title="text"
    :description="text"
    show-close
  />
  <Alert
    variant="info"
    title="Only title"
  />
  <Alert
    variant="info"
    title="Only description"
  />
  <Alert
    variant="info"
    title="Only title and close"
    show-close
  />
  <Alert
    variant="info"
    description="Only description and close"
    show-close
  />
  <Alert
    variant="info"
    title="Only title and actions"
  >
    <template #actions>
      <Link>First action</Link>
      <Link>Second action</Link>
    </template>
  </Alert>
  <Alert
    variant="info"
    description="Only description and actions"
    show-close
  >
    <template #actions>
      <Link>First action</Link>
      <Link>Second action</Link>
    </template>
  </Alert>
  <Alert
    variant="info"
    title="title and description and actions and right"
    description="Only description and actions"
    show-close
  >
    <template #right>
      <Button>Button</Button>
    </template>
    <template #actions>
      <Link>First action</Link>
      <Link>Second action</Link>
    </template>
  </Alert>
</template>

<style scoped>
  .acv-alert {
    margin: 1rem 0;
  }
</style>
