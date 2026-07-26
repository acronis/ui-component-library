<script setup lang="ts">
  import type { AcvRibbonEvents, AcvRibbonLink, AcvRibbonProps, AcvRibbonSlots } from './ribbon.ts';
  import AcvAlert from '@/components/alert/alert.vue';
  import AcvButton from '@/components/button/button.vue';
  import AcvDivider from '@/components/divider/divider.vue';
  import AcvLink from '@/components/link/link.vue';
  import { IconClose16 } from '@acronis-platform/icons/close';
  import { IconPlus16 } from '@acronis-platform/icons/plus';
  import { computed, ref } from 'vue';
  import './ribbon.css';

  const { alerts, hideClose } = defineProps<AcvRibbonProps>();

  const emit = defineEmits<AcvRibbonEvents>();
  defineSlots<AcvRibbonSlots>();

  const currentIndex = ref(0);
  const isFirst = computed(() => !currentIndex.value);
  const isLast = computed(() => alerts?.length ? (currentIndex.value === (alerts.length - 1)) : false);
  const stepLabel = computed(() => alerts?.length && `${currentIndex.value + 1} of ${alerts.length}`);
  function onClose() {
    emit('close', currentIndex.value);
    if (!alerts) {
      return;
    }
    if (currentIndex.value >= alerts.length) {
      currentIndex.value -= 1;
    }
  }
  const onPrevious = () => currentIndex.value -= 1;
  const onNext = () => currentIndex.value += 1;
  function onClickLink(event: MouseEvent, link?: AcvRibbonLink) {
    event.preventDefault();
    if (!link) {
      return;
    }
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
        <AcvAlert
          v-if="index === currentIndex"
          :key="index"
          :color="alert.type"
        >
          <template
            v-if="alert.description"
            #description
          >
            {{ alert.description }}
            <AcvLink
              v-if="alert.link"
              :href="alert.link.href"
              :target="alert.link?.target || '_blank'"
              @click="(event: MouseEvent) => onClickLink(event, alert.link)"
            >
              {{ alert.link.title }}
            </AcvLink>
          </template>

          <template #right>
            <template v-if="alerts && alerts.length > 1">
              <div class="acv-text acv-text--body-32 pr-16">
                {{ stepLabel }}
              </div>
              <AcvDivider vertical />
              <AcvButton
                variant="ghost"
                size="small"
                :disabled="isFirst"
                @click="onPrevious"
              >
                <template #prepend>
                  <IconPlus16 />
                </template>
              </AcvButton>
              <AcvDivider vertical />
              <AcvButton
                variant="ghost"
                size="small"
                :disabled="isLast"
                @click="onNext"
              >
                <template #prepend>
                  <IconPlus16 />
                </template>
              </AcvButton>
            </template>
            <AcvDivider
              v-if="!hideClose"
              vertical
            />
            <AcvButton
              v-if="!hideClose"
              variant="ghost"
              size="small"
              @click="onClose"
            >
              <template #prepend>
                <IconClose16 />
              </template>
            </AcvButton>
          </template>
        </AcvAlert>
      </template>
    </slot>
  </div>
</template>

<style scoped>
  .acv-ribbon {
    color: var(--acv-ribbon-color);
  }

  :deep(.acv-alert) .content {
    padding: 8px 8px 8px 24px;
  }

  :deep(.acv-alert) .content .description {
    grid-row: 1 / -1;
  }
</style>
