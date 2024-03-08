<template>
  <preview-group class="qa-icon-state-change">
    <preview name="Notification state" span="6">
      <div>
        <el-icon
          v-if='!iconState1'
          name="i-notifications-d-o--16"
          color="brand-primary">
        </el-icon>
        <el-icon
          v-else
          name="i-notifications-with-state-d-o--16"
          state="i-state-alert-d--16"
          color="brand-primary">
        </el-icon>
      </div>
      <div class="my-8"></div>
      <el-checkbox v-model="iconState1">Toogle</el-checkbox>
    </preview>
    <preview name="Downloading state" span="6">
      <div>
        <el-icon
          v-if='!iconState2'
          name="i-folder-d-o--16"
          color="brand-primary">
        </el-icon>
        <el-icon
          v-else
          name="i-folder-with-state-d-o--16"
          state="i-state-download-d--16"
          color="brand-primary">
        </el-icon>
      </div>
      <div class="my-8"></div>
      <el-checkbox :modelValue="iconState2">Toogle</el-checkbox>
    </preview>
    <preview name="Uploading state" span="6">
      <div>
        <el-icon
          v-if='!iconState3'
          name="i-folder-d-o--16"
          color="brand-primary">
        </el-icon>
        <el-icon
          v-else
          name="i-folder-with-state-d-o--16"
          state="i-state-upload-d--16"
          color="brand-primary">
        </el-icon>
      </div>
      <div class="my-8"></div>
      <el-checkbox v-model="iconState3">Toogle</el-checkbox>
    </preview>
    <preview name="Paused state" span="6">
      <div>
        <el-icon
          v-if='!iconState4'
          name="i-folder-d-o--16"
          color="brand-primary">
        </el-icon>
        <el-icon
          v-else
          name="i-folder-with-state-d-o--16"
          state="i-state-pause-d--16"
          color="brand-primary">
        </el-icon>
      </div>
      <div class="my-8"></div>
      <el-checkbox v-model="iconState4">Toogle</el-checkbox>
    </preview>
  </preview-group>
</template>

<script setup>
import { ref } from 'vue';
import ElIcon from 'packages/icon';
import ElCheckbox from 'packages/checkbox';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const iconState1 = ref(true);
const iconState2 = ref(true);
const iconState3 = ref(true);
const iconState4 = ref(true);
</script>