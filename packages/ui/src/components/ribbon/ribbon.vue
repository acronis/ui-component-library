<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Alert from '../alert/alert.vue';
  import Button from '../button/button.vue';
  import AcvDivider from '../divider/divider.vue';
  import AcvLink from '../link/link.vue';
  import type { AcvRibbonEvents, AcvRibbonLink, AcvRibbonProps, AcvRibbonSlots } from './ribbon.ts';
  import './ribbon.css';

  const { alerts, hideClose } = defineProps<AcvRibbonProps>();

  const emit = defineEmits<AcvRibbonEvents>();
  defineSlots<AcvRibbonSlots>();

  const currentIndex = ref(0);
  const isFirst = computed(() => !currentIndex.value);
  const isLast = computed(() => alerts?.length ? (currentIndex.value === (alerts.length - 1)) : false);
  const stepLabel = computed(() => alerts?.length && `${currentIndex.value + 1} of ${alerts.length}`);
  const onClose = () => emit('close', currentIndex.value);
  const onPrevious = () => currentIndex.value -= 1;
  const onNext = () => currentIndex.value += 1;
  function onClickLink(event: MouseEvent, link: AcvRibbonLink) {
    event.preventDefault();
    if (link.click) {
      link.click();
      return;
    }
    window.open(link.href, link.target || '_blank');
  }
</script>

<template>
  <div
    class="acv-ribbon"
    role="banner"
  >
    <slot>
      <template
        v-for="(alert, index) in alerts"
      >
        <Alert
          v-if="index === currentIndex"
          :key="index"
          :type="alert.type"
        >
          <template
            v-if="alert.title"
            #title
          >
            {{ alert.title }}
          </template>
          <template
            v-if="alert.description"
            #description
          >
            <div class="acv-ribbon__description">
              {{ alert.description }}
              <template v-if="alert.link">
                <AcvLink
                  :href="alert.link.href"
                  :target="alert.link.target || '_blank'"
                  @click="(event: MouseEvent) => onClickLink(event, alert.link)"
                >
                  {{ alert.link.title }}
                </AcvLink>
              </template>
            </div>
          </template>

          <template #right>
            <template v-if="alerts && alerts.length > 1">
              <div class="acv-text acv-text--body-32 pr-16">
                {{ stepLabel }}
              </div>
              <AcvDivider vertical />
              <Button
                variant="ghost"
                icon="i-long-arrow-left--16"
                :disabled="isFirst"
                class="mx-8 acv-button--previous"
                @click="onPrevious"
              />
              <AcvDivider vertical />
              <Button
                variant="ghost"
                icon="i-long-arrow-right--16"
                :disabled="isLast"
                class="mx-8 acv-button--next"
                @click="onNext"
              />
            </template>
            <AcvDivider vertical />
            <Button
              v-if="!hideClose"
              variant="ghost"
              icon="i-times--16"
              class="mx-8 acv-button--close"
              @click="onClose"
            />
          </template>
        </Alert>
      </template>
    </slot>
  </div>
</template>

<style scoped>
  .acv-ribbon {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-ribbon-color);
  }
</style>
