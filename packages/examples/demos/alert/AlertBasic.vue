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
    color="info"
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
    color="success"
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
    color="warning"
    title="This is a title."
    description="This is a description."
    show-close
    @close="onClose"
  />
  <Alert
    color="critical"
    title="This is a title."
    description="This is a description."
    show-close
    @close="onClose"
  />
  <Alert
    color="danger"
    title="This is a title."
    description="This is a description."
    show-close
    @close="onClose"
  />
  <Alert
    color="neutral"
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
