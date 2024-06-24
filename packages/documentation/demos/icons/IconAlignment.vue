<script setup>
  import Icon from '@/components/icon/icon.vue';

  const fonts = [
    'acv-text--display-large',
    'acv-text--display-medium',
    'acv-text--display-regular',
    'acv-text--HEADING',
    'acv-text--strong',
    'acv-text--subheading',
    'acv-text--body-24',
    'acv-text--caption',
    'acv-text--ACCENT'
  ];
</script>

<template>
  <PreviewGroup class="qa-icon-alignment">
    <Preview
      span="24"
      name="Flex"
    >
      <div
        v-for="(font, i) in fonts"
        :key="i"
      >
        <div
          class="icon-text-layout-container flex align-center acv-text"
          :class="font.toLowerCase()"
        >
          <Icon
            name="i-trash-o--16"
            class="with-background mx-8"
          ></Icon>
          <Icon
            name="i-plus--16"
            class="with-background mr-8"
          ></Icon>
          <Icon
            name="i-image-template-o--24"
            class="with-background mr-8"
          ></Icon>
          <Icon
            name="i-plus--24"
            class="with-background mr-16"
          ></Icon>
          <Icon
            name="i-local-backup-o--32"
            class="with-background mr-16"
          ></Icon>
          <Icon
            name="i-times--32"
            class="with-background mr-16"
          ></Icon>
          <span>{{ font }}</span>
          <Icon
            name="i-times--32"
            class="with-background ml-16"
          ></Icon>
          <Icon
            name="i-local-backup-o--32"
            class="with-background ml-16"
          ></Icon>
          <Icon
            name="i-plus--24"
            class="with-background ml-16"
          ></Icon>
          <Icon
            name="i-image-template-o--24"
            class="with-background ml-8"
          ></Icon>
          <Icon
            name="i-plus--16"
            class="with-background ml-8"
          ></Icon>
          <Icon
            name="i-trash-o--16"
            class="with-background mx-8"
          ></Icon>
        </div>
      </div>
    </Preview>
  </PreviewGroup>
</template>
