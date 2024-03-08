<template>
  <preview-group>
    <preview
      span="6"
      name="Basic Usage"
    >
      <DialogBasicUsage />
    </preview>
    <preview
      span="6"
      name="Without Footer"
    >
      <DialogWithoutFooter />
    </preview>
    <preview
      span="6"
      name="Without Header"
    >
      <DialogWithoutHeader />
    </preview>
    <preview
      span="6"
      name="Minimal Height"
    >
      <DialogWithMinimalHeight />
    </preview>
  </preview-group>
</template>

<script>
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
import DialogBasicUsage from 'examples/components/dialog/basic/DialogBasicUsage.vue';
import DialogWithoutFooter from 'examples/components/dialog/basic/DialogWithoutFooter.vue';
import DialogWithoutHeader from 'examples/components/dialog/basic/DialogWithoutHeader.vue';
import DialogWithMinimalHeight from 'examples/components/dialog/basic/DialogWithMinimalHeight.vue';

export default {
  components: {
    DialogWithMinimalHeight,
    DialogWithoutHeader,
    DialogWithoutFooter,
    DialogBasicUsage,
    Preview,
    PreviewGroup
  }
};
</script>

<style lang="scss">
.demo-box.demo-dialog {
  .full-image {
    width: 100%;
  }

  .el-dialog__wrapper {
    margin: 0;
  }

  .image-skeleton {
    height: 96px;
    width: 96px;
    border-radius: 8px;
    background-color: #2668c5;
    opacity: .3;
  }

  .clean-content-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  $sizes: 384px, 464px, 624px;
  @each $width in $sizes {
    .max-width-#{$width} {
      max-width: $width;
    }
  }
}
</style>

<style lang="scss">
.upload-tip {
  color: #8492a6;
  font-size: 12px;
  margin-top: 7px;
}
.demo-container {
  width: 600px;
  height: 450px;
  margin: auto;
}
</style>
