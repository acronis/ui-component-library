<template>
  <div
    class="el-upload-dragger"
    :class="{
      'is-dragover': dragcounter > 0
    }"
    :style="{
      'width': formatDimension(width),
      'height': formatDimension(height)
    }"
    @drop.prevent="onDrop"
    @dragover.prevent
    @dragenter.prevent="onDragover"
    @dragleave.prevent="onDragLeave"
  >
    <div
      class="el-upload-dragger__inner-mask"
      :class="{ 'is-dragover': dragcounter > 0 }"
    />
    <slot v-if="displayDefault">
      <div class="el-upload-dragger__content">
        <el-icon
          name="i-upload--24"
          size="96"
          color="brand-primary"
        />
        <div
          class="el-text el-text--display-regular mt-24 el-upload-dragger__text"
          :title="t('el.upload.text')"
        >
          {{ t('el.upload.text') }}
        </div>
        <div
          class="el-text el-text--body-24 el-text--color-fixed-lighter mt-8 el-upload-dragger__text"
          :title="t('el.upload.tip')"
        >
          {{ t('el.upload.tip') }}
        </div>
        <div class="mx-24">
          <el-button
            class="mt-24"
            type="primary"
            @click.prevent="onClick"
          >
            {{ browseButtonText }}
          </el-button>
        </div>
      </div>
    </slot>
    <slot
      v-if="dragcounter"
      name="drag"
    >
      <div class="el-upload-dragger__content">
        <el-icon
          name="i-upload--24"
          size="96"
          color="brand-primary"
        />
        <div
          class="el-text el-text--display-regular mt-24 el-upload-dragger__text"
          :title="t('el.upload.text')"
        >
          {{ t('el.upload.text') }}
        </div>
        <div
          class="el-text el-text--body-24 el-text--color-fixed-lighter mt-8 el-upload-dragger__text"
          :title="t('el.upload.tip')"
        >
          {{ t('el.upload.tip') }}
        </div>
        <div class="mx-24">
          <el-button
            class="mt-24 drag-hidden"
            type="primary"
          >
            {{ browseButtonText }}
          </el-button>
        </div>
      </div>
    </slot>
  </div>
</template>
<script>
  import ElIcon from 'packages/icon';
  import ElButton from 'packages/button';
  import Locale from '@/mixins/locale';

  export default {
    name: 'ElUploadDrag',
    components: {
      ElIcon,
      ElButton
    },
    mixins: [Locale],
    props: {
      disabled: Boolean,
      width: [Number, String],
      height: [Number, String],
      buttonText: String,
      visibleOnDragOver: Boolean
    },
    data() {
      return {
        dragcounter: 0
      };
    },

    computed: {
      displayDefault() {
        return !this.dragcounter || this.visibleOnDragOver;
      },
      browseButtonText() {
        return this.buttonText || this.t('el.upload.browseButton');
      }
    },

    methods: {
      formatDimension(prop) {
        if (prop !== undefined) {
          if (typeof prop === 'number') {
            return prop.toString().concat('px');
          }
          return prop;
        }
        return '100%';
      },
      onDragover() {
        /* istanbul ignore else  */
        if (!this.disabled) {
          this.dragcounter++;
        }
      },
      onDragLeave() {
        this.dragcounter--;
      },
      onDrop(e) {
        /* istanbul ignore else  */
        if (!this.disabled) {
          this.dragcounter = 0;
          this.$emit('file', e.dataTransfer.files);
        }
      },
      onClick() {
        this.$emit('click');
      }
    }
  };
</script>
