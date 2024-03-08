<template>
  <preview-group>
    <preview
      span="6"
      name="Wrap Content"
    >
      <DialogWrapContentHeight />
    </preview>
    <preview
      span="6"
      name="Fixed"
    >
      <DialogFixedHeight />
    </preview>
  </preview-group>
</template>

<script>
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
import DialogWrapContentHeight from 'examples/components/dialog/clean/DialogWrapContentHeight.vue';
import DialogFixedHeight from 'examples/components/dialog/clean/DialogFixedHeight.vue';

export default {
  components: {
    Preview,
    PreviewGroup,
    DialogWrapContentHeight,
    DialogFixedHeight
  }
};
</script>
