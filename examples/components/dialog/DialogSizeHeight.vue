<template>
  <preview-group>
    <preview span="8" name="Wrap Content">
      <DialogHeightWrapContent />
    </preview>
    <preview span="8" name="Wrap Content (Long Content)">
      <DialogHeightWrapLongContent />
    </preview>
  <preview span="8" name="Fixed Medium">
    <DialogHeightFixedMedium />
  </preview>
  </preview-group>
</template>

<script>
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
import DialogHeightWrapContent from 'examples/components/dialog/height/DialogHeightWrapContent.vue';
import DialogHeightWrapLongContent from 'examples/components/dialog/height/DialogHeightWrapLongContent.vue';
import DialogHeightFixedMedium from 'examples/components/dialog/height/DialogHeightFixedMedium.vue';

export default {
  components: {
    PreviewGroup,
    Preview,
    DialogHeightWrapContent,
    DialogHeightWrapLongContent,
    DialogHeightFixedMedium
  }
};
</script>
