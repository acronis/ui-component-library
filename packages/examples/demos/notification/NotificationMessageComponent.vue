<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { useNotify } from '@/components/notification/useNotify';
  import { defineComponent } from 'vue';

  const $notify = useNotify();

  function onUseComponentClick() {
    const instance = $notify.open({
      title: 'Report status',
      content: defineComponent({
        methods: {
          onDetailsClick() {
            instance.dismiss();
          },
        },
        template: `
                <div class="el-text el-text--body-24">
                  <div><span>The system is preparing your report. Report will be sent tomorrow</span></div>
                  <el-link class="my-8" @click="onDetailsClick">Details</el-link>
                </div>
              `,
      }),
    });
  }
</script>

<template>
  <div>
    <AcvButton @click="onUseComponentClick">
      Use component
    </AcvButton>
  </div>
</template>
