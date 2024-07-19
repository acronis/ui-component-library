<script>
  import AcvSpinner from '../spinner/spinner.vue';

  export default {

    components: { AcvSpinner },

    data() {
      return {
        visible: false,
        fullscreen: true,
        background: null,
        opacity: 0,
        color: null,
        size: null,
        text: null,
        textColor: null
      };
    },

    methods: {
      handleAfterLeave() {
        this.$emit('afterLeave');
      }
    }
  };
</script>

<template>
  <transition
    name="acv-loading-fade"
    @after-leave="handleAfterLeave"
  >
    <div
      v-show="visible"
      class="acv-loading"
      :class="{ 'is-fullscreen': fullscreen }"
    >
      <div
        class="acv-loading__backdrop"
        :style="`opacity: ${opacity || 1}`"
        :class="{ [`acv-loading__backdrop--color-${background}`]: background }"
      />
      <div class="acv-loading__content">
        <AcvSpinner
          :color="color || 'brand-secondary'"
          :size="size || 'sm'"
        />
        <div
          v-if="text"
          class="mt-16"
        >
          <span
            class="acv-text acv-text--body-24"
            :class="{ [`acv-text--color-${textColor}`]: textColor }"
          >
            {{ text }}
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.acv-loading-parent {
  &.relative {
    position: relative !important;
  }

  &.hidden {
    overflow: hidden !important;
  }
}

.acv-loading {
  line-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  position: absolute;
  inset: 0;
  z-index: var(--acv-z-index-normal);

  .backdrop {
    border-radius: inherit;
    background-color: transparent;
    position: absolute;
    inset: 0;

    /* TODO add all colors */
    &.color-primary {
      background-color: var(--acv-color-primary);
    }

    &.color-secondary {
      background-color: var(--acv-color-secondary);
    }
  }

  .content {
    text-align: center;
    z-index: inherit;
  }

  &.fullscreen {
    position: fixed;
    z-index: var(--acv-z-index-loading);
  }
}

.acv-loading-fade-enter,
.acv-loading-fade-leave-active {
  opacity: 0;
}

.acv-loading__backdrop--color-solid-brand-lightest {
  opacity: .95 !important;
}
</style>
