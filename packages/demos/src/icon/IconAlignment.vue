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
  <div
    title="Flex"
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
          name="disk-ab--32"
          size="32"
          class="with-background mx-8"
        />
        <Icon
          name="plus--16"
          class="with-background mr-8"
        />
        <Icon
          name="image--24"
          size="24"
          class="with-background mr-8"
        />
        <Icon
          name="power-ab--32"
          size="32"
          class="with-background mr-16"
        />
        <Icon
          name="backup-plan-ab--32"
          class="with-background mr-16"
        />
        <Icon
          name="close--24"
          size="32"
          class="with-background mr-16"
        />
        <span>{{ font }}</span>
        <Icon
          name="close--24"
          size="24"
          class="with-background ml-16"
        />
        <Icon
          name="backup-plan-ab--32"
          size="32"
          class="with-background ml-16"
        />
        <Icon
          name="plus-rounded--16"
          size="24"
          class="with-background ml-16"
        />
        <Icon
          name="image---24"
          size="24"
          class="with-background ml-8"
        />
        <Icon
          name="plus--16"
          class="with-background ml-8"
        />
        <Icon
          name="remove-from-list--32"
          size="32"
          class="with-background mx-8"
        />
      </div>
    </div>
  </div>
</template>
