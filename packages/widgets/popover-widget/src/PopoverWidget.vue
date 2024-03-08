<template>
  <el-popover
    ref="popover"
    popper-class="el-popover-widget"
    :offset="arrowOffset"
    :placement="placement"
    :reference="reference"
    :popper-options="{}"
    pointer="green-pulse"
    :width="width"
    :visible="visible"
    :hide-on-resize="true"
    :hide-on-scroll="false"
    :value="visible"
    trigger="manual"
  >
    <el-button
      class="el-popover-widget__close"
      icon="i-times--16"
      type="ghost"
      @click="handleClose"
    />
    <slot>
      <div
        v-if="illustration || $slots.illustration"
        class="el-popover-widget__illustration"
      >
        <slot name="illustration">
          <img
            :src="illustration"
            alt="logo"
          >
        </slot>
      </div>
      <div class="el-popover-widget__content mx-16 my-16">
        <slot name="title">
          <div
            v-if="title"
            class="el-popover-widget__title el-text--strong"
          >
            {{ title }}
          </div>
        </slot>
        <div
          v-if="description"
          class="el-popover-widget__description el-text el-text--body-24 mb-8"
          v-html="description"
        />
        <el-link
          v-if="link && linkTitle"
          :href="link"
        >
          {{ linkTitle }}
          <el-icon name="i-external-link--16" />
        </el-link>
      </div>
      <slot name="footer">
        <template
          v-if="stepIndex && totalSteps"
        >
          <el-divider />
          <div class="el-popover-widget__footer px-16 py-16">
            <span
              v-if="totalSteps >= stepIndex"
              class="el-popover-widget__counter"
            >{{ stepIndex }} {{ 'of' }} {{ totalSteps }}</span>
            <el-button
              v-if="!isLastStep"
              type="primary"
              class="next-button"
              @click="handleNext"
            >
              {{ t('el.popoverwidget.nextButtonText') }}
            </el-button>
            <el-button
              v-if="isLastStep"
              type="primary"
              class="finish-button"
              @click="handleFinish"
            >
              {{ t('el.popoverwidget.finishButtonText') }}
            </el-button>
          </div>
        </template>
      </slot>
    </slot>
  </el-popover>
</template>

<script>
import ElPopover from 'packages/popover';
import Locale from '@/mixins/locale';

/**
 * Describe $refs.popover.updatePopper
 */
 export default {
  name: 'ElPopoverWidget',
  components: {
    ElPopover
  },
  mixins: [Locale],
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    stepIndex: {
      type: Number,
      default: 0
    },

    totalSteps: {
      type: Number,
      default: 1
    },

    arrowOffset: {
      type: Number,
      default: 0
    },

    width: {
      type: Number,
      default: 240
    },

    reference: {
      type: HTMLElement,
      default: null
    },

    illustration: {
      type: String,
      default: null
    },

    link: {
      type: String,
      default: null
    },

    linkTitle: {
      type: String,
      default: null
    },

    title: {
      type: String,
      default: null
    },

    description: {
      type: String,
      default: null
    },

    placement: {
      type: String,
      default: 'top',
      validator: (value) => [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end'
      ].indexOf(value) > -1
    }
  },
  emits: ['close', 'update:visible', 'finish', 'next'],
  computed: {
    isLastStep() {
      return this.stepIndex === this.totalSteps;
    }
  },
  methods: {
    handleNext() {
      this.$emit('next');
    },

    handleFinish() {
      this.$emit('finish');
    },

    handleClose() {
      // TODO: Vue 3 migration check onClose listener
      this.onClose
        ? this.$emit('close')
        : this.$emit('update:visible', false);
    }
  }
};
</script>
