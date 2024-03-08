<template>
  <div class="el-loading-complex">
    <div
      v-if="isLoading"
      class="el-loading-complex__backdrop"
      :style="`opacity: ${opacity}`"
      :class="{
        [`el-loading__backdrop--color-${background}`]: background,
        [`el-loading-complex__backdrop--inline`]: inline
      }"
    >
      <div
        class="el-loading-complex__spinner"
        :class="{[`el-loading-complex__spinner--${size}px`]: size}"
      >
        <el-spinner
          :color="color"
          :size="size"
        />
      </div>
      <span
        v-if="inline"
        class="el-text el-text--body-24"
        :class="{[`el-text--color-${textColor}`]: textColor}"
      >
        {{ text }}
      </span>
      <div
        v-if="(header || text || actionLabel) && !inline"
        class="el-text el-loading-complex__text my-8"
        :class="{
          [`el-text--color-${textColor}`]: textColor,
          ['mt-16']: size === '48'
        }"
      >
        <p class="el-text el-text--strong">
          {{ header }}
        </p>
        <p
          class="el-text el-text--body-24"
          :class="{[`el-text--color-${textColor}`]: textColor}"
        >
          {{ text }}
        </p>
        <el-button
          v-if="actionLabel"
          type="ghost"
          class="mt-8"
          :class="{['mt-16']: size === '48'}"
          @click="action"
        >
          {{ actionLabel }}
        </el-button>
      </div>
    </div>
    <div class="el-loading-complex__slot">
      <slot />
    </div>
  </div>
</template>

<script>
import ElSpinner from 'packages/spinner';

export default {
  name: 'ElLoadingComplex',
  components: {
    ElSpinner
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    header: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: 'fixed-primary'
    },
    actionLabel: {
      type: String,
      default: ''
    },
    action: {
      type: Function,
      default: () => {
      }
    },
    size: {
      type: String,
      default: '48'
    },
    opacity: {
      type: String,
      default: '1'
    },
    background: {
      type: String,
      default: 'brand-secondary'
    },
    color: {
      type: String,
      default: 'brand-primary'
    },
    inline: {
      type: Boolean,
      default: false
    }
  }
};
</script>
