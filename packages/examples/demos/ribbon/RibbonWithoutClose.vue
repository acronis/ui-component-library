<script setup>
  import Ribbon from '@/components/ribbon/ribbon.vue';
  import { reactive, ref } from 'vue';

  const currentDate = new Intl
    .DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short' })
    .format(new Date().setHours(new Date().getHours() + 6));

  let ribbons = reactive([
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
      description: 'Description 1',
      type: 'critical'
    },
    {
      description: 'Description 2',
      type: 'warning'
    },
    {
      description: 'Description 3',
      type: 'success'
    }
  ]);

  const showDialog = ref(false);

  function onShowDialog() {
    showDialog.value = !showDialog.value;
  }

  function onClose(index) {
    ribbons = ribbons.filter((_, i) => i !== index);
  }
</script>

<template>
  <Ribbon
    :alerts="ribbons"
    hide-close
    class="pb-16"
    @close="onClose"
  />
</template>
