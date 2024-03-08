<template>
  <preview-group>
    <preview
      span="6"
      name="Small"
    >
      <DialogSmallWidth />
    </preview>
    <preview
      span="6"
      name="Medium"
    >
      <DialogMediumWidth />
    </preview>
    <preview
      span="6"
      name="Large"
    >
      <DialogLargeWidth />
    </preview>
  </preview-group>
</template>

<script>
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
import DialogSmallWidth from 'examples/components/dialog/clean/DialogSmallWidth.vue';
import DialogMediumWidth from 'examples/components/dialog/clean/DialogMediumWidth.vue';
import DialogLargeWidth from 'examples/components/dialog/clean/DialogLargeWidth.vue';

export default {
  components: {
    Preview,
    PreviewGroup,
    DialogSmallWidth,
    DialogMediumWidth,
    DialogLargeWidth
  }
};
</script>
