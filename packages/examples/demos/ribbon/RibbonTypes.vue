<script setup>
  import Link from '@/components/link/link.vue';
  import Ribbon from '@/components/ribbon/ribbon.vue';

  let ribbons = [
    {
      title: 'This is a title.',
      description: 'This is a description.',
      variant: 'info'
    },
    {
      title: 'This is a title.',
      description: 'This is a description.',
      variant: 'success'
    },
    {
      title: 'This is a title.',
      description: 'This is a description.',
      variant: 'warning'
    },
    {
      title: 'This is a title.',
      description: 'This is a description.',
      variant: 'critical'
    },
    {
      title: 'This is a title.',
      description: 'This is a description.',
      variant: 'error'
    },
    {
      title: 'This is a title.',
      description: 'This is a description.',
      variant: 'unknown'
    }
  ];

  function onClose(index) {
    ribbons = ribbons.filter((_, i) => i !== index);
  }
</script>

<template>
  <Ribbon
    v-for="(ribbon, index) in ribbons"
    :key="index"
    :variant="ribbon.variant"
    :title="ribbon.title"
    :description="ribbon.description"
    show-close
    @close="onClose"
  >
    <template #actions>
      <span><Link>First action</Link></span>
      <Link>Second action</Link>
    </template>
  </Ribbon>
</template>
