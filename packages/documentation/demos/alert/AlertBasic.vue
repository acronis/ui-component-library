<script setup>
  import Alert from '@/components/alert/alert.vue';
  import Button from '@/components/button/button.vue';
  import Link from '@/components/link/link.vue';

  function onClose() {
    console.log('Alert is closed');
  }
</script>

<template>
  <Alert
    variant="info"
    title="This is a title."
    description="This is a description."
    show-close
    @close="onClose"
  >
    <template #actions>
      <span><Link>First action</Link></span>
      <Link>Second action</Link>
    </template>
  </Alert>
  <Alert
    variant="success"
    title="This is a title."
    description="This is a description."
    show-close
    @close="onClose"
  >
    <template #right>
      <Button>Button</Button>
    </template>
  </Alert>
  <Alert
    variant="warning"
    title="This is a title."
    description="This is a description."
    show-close
    @close="onClose"
  />
  <Alert
    variant="critical"
    title="This is a title."
    description="This is a description."
    show-close
    @close="onClose"
  />
  <Alert
    variant="error"
    title="This is a title."
    description="This is a description."
    show-close
    @close="onClose"
  />
  <Alert
    variant="unknown"
    title="This is a title."
    description="This is a description."
    show-close
    @close="onClose"
  />
</template>

<style scoped>
.acv-alert {
  margin: 1rem 0;
}
</style>
