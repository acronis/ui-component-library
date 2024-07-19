<script>
  import ElEmpty from '@/widgets/empty/empty.vue';

  export default {
    components: { ElEmpty },
    data() {
      return {
        icon: 'folder-ill--72',
        description: 'You don\'t have any data to show',
        linkText: 'Learn more',
      };
    },
  };
</script>

<template>
  <div class="qa-empty-screen-icon-description-link">
    <ElEmpty
      :icon="icon"
      :description="description"
      :link-text="linkText"
    />
  </div>
</template>
