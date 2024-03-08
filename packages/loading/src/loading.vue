<template>
  <transition
    name="el-loading-fade"
    @after-leave="handleAfterLeave"
  >
    <div
      v-show="visible"
      class="el-loading"
      :class="{'is-fullscreen': fullscreen}"
    >
      <div
        class="el-loading__backdrop"
        :style="`opacity: ${opacity || 1}`"
        :class="{[`el-loading__backdrop--color-${background}`]: background}"
      />
      <div class="el-loading__content">
        <el-spinner
          :color="color || 'brand-secondary'"
          :size="size || 'sm'"
        />
        <div
          v-if="text"
          class="mt-16"
        >
          <span
            class="el-text el-text--body-24"
            :class="{[`el-text--color-${textColor}`]: textColor}"
          >
            {{ text }}
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import ElSpinner from 'packages/spinner';

  export default {

    components: { ElSpinner },

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
        this.$emit('after-leave');
      }
    }
  };
</script>
