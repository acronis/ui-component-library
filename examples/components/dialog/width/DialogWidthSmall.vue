<template>
  <el-button @click="showDialog = true">
    Small
  </el-button>
  <el-dialog
    v-model:visible="showDialog"
    width-size="small"
    height-size="fixed-auto"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <div class="mb-8"><div class="el-text el-text--size-m">Cannot delete Cloud storage</div></div>
      <div><div class="el-text el-text--size-xs">Disable the backup service for these customers and try again. The following customers are using it: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae dolore, doloremque eaque esse ex hic magnam qui? Ab aperiam atque debitis eos et iusto quidem veniam?</div></div>

    </div>
    <template #footer-aside>
      <span class="el-text el-text--body-24">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
    </template>
    <template #footer>
      <el-button type="secondary" @click="showDialog = false">Cancel</el-button>
      <el-button @click="showDialog = false">Ok</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import { ref } from 'vue';

const showDialog = ref(false);
</script>
