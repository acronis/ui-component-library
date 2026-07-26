<script setup>
  import AcvDialog from '@/components/dialog/dialog.vue';
  import AcvRibbon from '@/components/ribbon/ribbon.vue';
  import { ref } from 'vue';

  const currentDate = new Intl
    .DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short' })
    .format(new Date().setHours(new Date().getHours() + 6));

  const ribbons = [
    {
      description: 'Please note that the examples below just represent the html markup.',
      type: 'success',
      link: {
        title: 'Show Dialog',
        click: onShowDialog
      }
    },
    {
      description: `Data center maintenance is scheduled for ${currentDate}. For more details, refer to the`,
      type: 'success',
      link: {
        href: 'https://www.acronis.com/en-sg/',
        target: '_blank',
        title: 'Status Page'
      }
    },
    {
      description: 'A critical message.',
      type: 'critical'
    },
    {
      description: 'A warning message.',
      type: 'warning'
    },
    {
      description: 'A success message.',
      type: 'success'
    }
  ];

  const showDialog = ref(false);

  function onShowDialog() {
    showDialog.value = !showDialog.value;
  }
</script>

<template>
  <div>
    <AcvRibbon
      :alerts="ribbons"
      hide-close
      class="pb-16"
      @close="onClose"
    />
    <AcvDialog
      v-model="showDialog"
      title="Dialog title"
    >
      <div class="px-24 py-16">
        {{ "Dialog body" }}
      </div>
    </AcvDialog>
  </div>
</template>
