<template>
  <preview-group>
    <preview span="6" name="Small">
      <DialogWidthSmall/>
    </preview>
    <preview span="6" name="Medium">
      <DialogWidthMedium/>
    </preview>
    <preview span="6" name="Large">
      <DialogWidthLarge/>
    </preview>
  </preview-group>
</template>

<script>
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
import DialogWidthSmall from 'examples/components/dialog/width/DialogWidthSmall.vue';
import DialogWidthMedium from 'examples/components/dialog/width/DialogWidthMedium.vue';
import DialogWidthLarge from 'examples/components/dialog/width/DialogWidthLarge.vue';

export default {
  components: {
    PreviewGroup,
    Preview,
    DialogWidthSmall,
    DialogWidthMedium,
    DialogWidthLarge
  }
};
</script>
