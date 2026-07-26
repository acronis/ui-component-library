<script setup>
  import ElIcon from '@/components/icon/icon.vue';
</script>

<script>
  export default {
    data() {
      return {
        fonts: [
          'el-text--display-large',
          'el-text--display-medium',
          'el-text--display-regular',
          'EL-TEXT--HEADING',
          'el-text--subheading',
          'el-text--body-24',
          'el-text--caption',
          'EL-TEXT--ACCENT',
        ],
      };
    },
  };
</script>

<template>
  <preview-group class="qa-icon-alignment">
    <preview
      span="24"
      name="Flex"
    >
      <div
        v-for="(font, i) in fonts"
        :key="i"
      >
        <div
          class="icon-text-layout-container flex align-center el-text"
          :class="font.toLowerCase()"
        >
          <ElIcon
            name="IconBucket16"
            class="with-background mx-8"
          />
          <ElIcon
            name="IconPlus16"
            class="with-background mr-8"
          />
          <ElIcon
            name="IconDocumentTemplates16"
            class="with-background mr-8"
          />
          <ElIcon
            name="IconPlus24"
            class="with-background mr-16"
          />
          <ElIcon
            name="IconLocalBackup24"
            class="with-background mr-16"
          />
          <ElIcon
            name="i-times--32"
            class="with-background mr-16"
          />
          <span>{{ font }}</span>
          <ElIcon
            name="i-times--32"
            class="with-background ml-16"
          />
          <ElIcon
            name="i-local-backup-o--32"
            class="with-background ml-16"
          />
          <ElIcon
            name="IconPlus24"
            class="with-background ml-16"
          />
          <ElIcon
            name="i-image-template-o--24"
            class="with-background ml-8"
          />
          <ElIcon
            name="IconPlus16"
            class="with-background ml-8"
          />
          <ElIcon
            name="IconBucket16"
            class="with-background mx-8"
          />
        </div>
      </div>
    </preview>
  </preview-group>
</template>
