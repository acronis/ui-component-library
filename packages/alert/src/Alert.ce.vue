<template>
  <transition name="el-alert-fade">
    <div v-show="visible" class="el-alert" :class="alertClasses" role="alert">
      <template v-if="isAdvancedMode">
        <div class="el-alert-advance__wrapper">
          <div class="el-alert__container">
            <div v-if="showIcon" class="el-alert__icon">
              <el-icon :name="iconName" size="16" />
            </div>
            <div class="el-alert__content">
              <!-- @slot Default slot to render title and description -->
              <slot>
                <div class="el-alert__title">
                  <!-- @slot Slot to render title -->
                  <slot name="title">
                    {{ title }}
                  </slot>
                </div>
                <div class="el-alert__description el-text el-text--body-24">
                  <!-- @slot Slot to render description -->
                  <slot name="description">
                    {{ description }}
                  </slot>
                </div>
              </slot>
            </div>
          </div>
          <div class="el-alert__container">
            <div
              :class="{ 'el-alert-advance__pseudo-icon': showIcon }"
              class="el-alert__content"
            >
              <div v-if="isSubtitle" class="el-text el-alert-advance__subtitle">
                <slot name="subtitle">
                  {{ subtitle }}
                </slot>
              </div>
              <div
                v-if="isContent"
                :class="[
                  { 'mt-8': isSubtitle },
                  `el-alert-advance__content-block--${contentBlockType}`,
                ]"
                class="el-alert__content el-alert-advance__content-block"
              >
                <div class="el-alert-advance__content-block__text">
                  <slot name="content">
                    <div class="el-alert__title">
                      {{ content.title }}
                    </div>
                    <div
                      v-for="(text, index) in content.texts"
                      :key="index"
                      :class="[
                        { 'mt-8': (index === 0 && content.title) || index },
                      ]"
                      class="el-text el-text--body-24 el-alert__subtitle"
                    >
                      {{ text }}
                    </div>
                  </slot>
                </div>
              </div>
              <div v-if="$slots.actions" class="el-alert__actions">
                <slot name="actions" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="$slots['actions-right']" class="el-alert__actions-right">
          <slot name="actions-right" />
        </div>
        <div
          v-if="!hideClose && !$slots['actions-right']"
          class="el-alert__close"
          @click.stop="close"
        >
          <el-button type="icon">
            <el-icon name="i-times--16" />
          </el-button>
        </div>
      </template>
      <template v-else>
        <div class="el-alert__container">
          <div v-if="showIcon" class="el-alert__icon">
            <el-icon :name="iconName" size="16" />
          </div>
          <div class="el-alert__content">
              <div class="el-alert__title">
                <slot name="title">
                  {{ title }}
                </slot>
              </div>
              <div class="el-alert__description el-text el-text--body-24">
                <slot name="description">
                  {{ description }}
                </slot>
              </div>
            <div v-if="$slots.actions" class="el-alert__actions">
              <slot name="actions" />
            </div>
          </div>
        </div>
        <div v-if="$slots['actions-right']" class="el-alert__actions-right">
          <slot name="actions-right" />
        </div>
        <div
          v-if="!hideClose && !$slots['actions-right']"
          class="el-alert__close"
          @click.stop="close"
        >
          <el-button type="icon">
            <el-icon name="i-times--16" />
          </el-button>
        </div>
      </template>
    </div>
  </transition>
</template>

<script setup>
import { ref, onBeforeMount, computed, useSlots } from 'vue';
import ElIcon from "packages/icon"; 
import ElButton from "packages/button";
import { AlertIconTypes, AlertType } from "./AlertTypes.ts";

const emit = defineEmits(['close'])
const slots = useSlots();

const visible = ref(true);

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "info",
    validator: (value) => Object.values(AlertType).indexOf(value) !== -1,
  },
  border: {
    type: [Boolean, Object],
    default: () => ({}),
  },
  borderTop: {
    type: Boolean,
    default: false,
  },
  borderBottom: {
    type: Boolean,
    default: false,
  },
  card: {
    type: Boolean,
    default: false,
  },
  ribbon: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated behaviour will be revised
   */
  advanced: {
    type: Boolean,
    default: false,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  hideClose: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated will be removed
   */
  subtitle: {
    type: String,
    default: "",
  },
  content: {
    type: Object,
    default: () => ({}),
  },
  contentBlockType: {
    type: String,
    default: AlertType.SUCCESS,
    validator: (value) => Object.values(AlertType).indexOf(value) !== -1,
  },
  icon: {
    type: String,
    default: "",
  },
});

const alertClasses = computed(() => {

  return [
    `el-alert--${props.type}`,
    { "el-alert--transparent": props.transparent },
    { "el-alert--with-top-border": cBorder.value.top && !cBorder.value.bottom },
    { "el-alert--with-bottom-border": cBorder.value.bottom && !cBorder.value.top },
    { "el-alert--with-top-bottom-borders": cBorder.value.top && cBorder.value.bottom },
    { "el-alert--with-card": props.card },
    { "el-alert--ribbon": props.ribbon },
    { "el-alert-advance": isAdvancedMode.value },
  ];
});

const iconName = computed(() => {
  return props.icon || AlertIconTypes[props.type];
});

const isContent = computed(() => {
  return (
    props.content.title?.length > 0 ||
    props.content.texts?.length > 0 ||
    !!slots?.content
  );
});

const isSubtitle = computed(() => {
  return props.subtitle.length > 0 || !!slots?.subtitle;
});

const hasTitle = computed(() => {
  return props.title?.length > 0 || !!slots?.title;
});

const isAdvancedMode = computed(() => {
  return isSubtitle.value || isContent.value || props.advanced;
});

const cBorder = computed(() => {
  if (
    typeof props.border === "boolean" &&
    !props.borderTop &&
    !props.borderBottom
  ) {
    return { top: true, bottom: true };
  }

  if (props.borderTop || props.borderBottom) {
    return { top: props.borderTop, bottom: props.borderBottom };
  }

  return props.border;
});

onBeforeMount(() => {
  if (process.env.NODE_ENV !== "production") {
    (props.subtitle || slots?.subtitle) &&
      console.warn(
        "[UI Kit Warn][Alert] Subtitle is deprecated. Please use description body."
      );
    (props.border?.top || props.border?.bottom) &&
      console.warn(
        "[UI Kit Warn][Alert] Border object is deprecated. Please use borderTop and borderBottom properties."
      );
    props.advanced &&
      console.warn("[UI Kit Warn][Alert] Advanced is deprecated.");
  }
});

const close = () => {
  visible.value = false;
  emit('close');
}

</script>

<style lang="scss">
  @import "../../../themes/acronis/src/alert.scss";
</style>
