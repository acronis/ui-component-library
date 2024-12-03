<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvLink from '@/components/link/link.vue';
  import AcvNotification from '@/components/notification/notification.vue';
  import AcvProgress from '@/components/progress/progress.vue';
</script>

<script>
  export default {
    data() {
      return {
        visible: false,
        percentage: 0,
        timersId: [],
      };
    },

    methods: {
      onUseNotificationComponentClick() {
        this.visible = !this.visible;

        if (this.visible) {
          for (let i = 0; i <= 100; i += 5) {
            this.timersId.push(
              setTimeout(() => {
                this.percentage = i;
              }, i * 100),
            );
          }
        }
      },

      close() {
        this.timersId.forEach((item) => {
          clearTimeout(item);
        });
      },
    },
  };
</script>

<template>
  <div>
    <AcvButton @click="onUseNotificationComponentClick">
      {{ visible ? 'Hide' : 'Show' }}
    </AcvButton>

    <AcvNotification
      v-model:visible="visible"
      :duration="0"
      :on-close="close"
    >
      <div class="el-text el-text--body-32">
        Uploading image <b>Windows-2017</b>
      </div>
      <AcvProgress
        class="mb-8"
        :percentage="percentage"
      />
      <div class="el-text el-text--body-32">
        Uploaded <b>{{ 8 * percentage / 100 }} GB</b> of <b>8.0 GB</b>
      </div>
      <AcvLink
        class="el-text el-text--body-32"
        @click="onUseNotificationComponentClick()"
      >
        Cancel
      </AcvLink>
    </AcvNotification>
  </div>
</template>
