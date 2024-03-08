<template>
  <preview-group>
    <preview name="Aside with footer" span="6">
      <DialogLayoutAsideWithFooter />
    </preview>
    <preview name="Aside w/o footer" span="6">
      <DialogLayoutAsideWithoutFooter />
    </preview>
    <preview name="Body header" span="6">
      <DialogLayoutBodyHeader />
    </preview>
  </preview-group>
</template>

<script>
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
import DialogLayoutAsideWithFooter from 'examples/components/dialog/layout/DialogLayoutAsideWithFooter.vue';
import DialogLayoutAsideWithoutFooter from 'examples/components/dialog/layout/DialogLayoutAsideWithoutFooter.vue';
import DialogLayoutBodyHeader from 'examples/components/dialog/layout/DialogLayoutBodyHeader.vue';

export default {
  components: {
    Preview,
    PreviewGroup,
    DialogLayoutAsideWithFooter,
    DialogLayoutAsideWithoutFooter,
    DialogLayoutBodyHeader
  }
};
</script>
