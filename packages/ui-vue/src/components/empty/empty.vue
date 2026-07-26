<script setup lang="ts">
  import AcvButton from '@/components/button/button.vue';
  import AcvIcon from '@/components/icon/icon.vue';
  import vLoading from '@/directives/loading.ts';

  withDefaults(defineProps<{
    loading?: boolean
    icon?: string
    title?: string
    description?: string
    linkText?: string
    buttonText?: string
  }>(), {
    icon: undefined,
    title: undefined,
    description: undefined,
    linkText: undefined,
    buttonText: undefined
  });
</script>

<template>
  <div class="acv-empty__wrapper">
    <div class="acv-empty">
      <div
        v-loading="loading"
        class="loading-wrapper my-16"
        color="brand-light"
        acv-loading-size="48"
      />
      <AcvIcon
        v-if="icon"
        class="my-16"
        :name="icon"
        size="96"
      />
      <div
        v-if="title"
        class="acv-empty__title acv-text acv-text--display-regular mb-8"
      >
        {{ title }}
      </div>
      <div
        v-if="description"
        class="acv-empty__description acv-text acv-text--body-24"
      >
        {{ description }}
      </div>
      <AcvButton
        v-if="buttonText"
        class="my-16"
      >
        {{ buttonText }}
      </AcvButton>
      <AcvButton
        v-if="linkText"
        variant="ghost"
        class="acv-empty-screen__link my-16"
      >
        {{ linkText }}
      </AcvButton>
    </div>
  </div>
</template>

<style scoped>
.acv-empty__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 340px;
  width: 100%;
  background-color: var(--acv-color-primary-lightest);
}

.acv-empty {
  text-align: center;

  .acv-empty__description {
    max-width: 448px;
  }

  .acv-empty__link {
    font-size: var(--acv-font-size-body);
    line-height: 32px;
  }

  .loading-wrapper {
    height: 68px;
  }
}
</style>
