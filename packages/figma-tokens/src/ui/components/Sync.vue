<script setup>
  import { Button } from '@acronis-platform/figma-ds-vue-plugin';
  import { emit as emitFigma, on } from '@create-figma-plugin/utilities';
  import { downloadFile } from '../utils';
  import testJson from '../../../data/test.plugin.json';

  const emit = defineEmits(['update:isLoading']);

  function handleUploadJson() {
    console.log('handleUploadJson');

    emitFigma('REQ_UPLOAD_JSON', testJson);
  }

  function handleDownloadJson() {
    emit('update:isLoading', true);
    const defaultFilename = `${`${Date.now()}export`}.plugin.json`;
    on('RES_SERIALIZE_JSON', (json) => {
      downloadFile(json, defaultFilename);
      console.log('RES_SERIALIZE_JSON', json);
      emit('update:isLoading', false);
      // isLoading.value = false;
    });

    setTimeout(() => emitFigma('REQ_SERIALIZE_JSON'), 100);

    // downloadFile(JSON.stringify(json), defaultFilename);

    setTimeout(() => emit('update:isLoading', false), 3000);
  }
</script>

<template>
  <div class="sync">
    <Button @click="handleDownloadJson">
      Download all
    </Button>
    <Button @click="handleDownloadJson">
      Download tokens
    </Button>
    <Button
      secondary
      @click="handleUploadJson"
    >
      Upload
    </Button>
<!--    <Button secondary>-->
<!--      Remap instances-->
<!--    </Button>-->
  </div>
</template>

<style scoped>
.sync {
  padding: 10px;

  button + button {
    margin-top: 10px;
  }
}
</style>
