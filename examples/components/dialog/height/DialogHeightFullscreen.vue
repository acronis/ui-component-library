<template>
  <el-button @click="showDialog = true">
    Height fullscreen
  </el-button>
  <el-dialog
    v-model:visible="showDialog"
    width-size="medium"
    height-size="fullscreen"
    variant="fullscreen"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <el-button @click="showLongContent = !showLongContent">
        Toggle content
      </el-button>
      {{ content }}
    </div>
  </el-dialog>
</template>

<script setup>
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import { ref, computed } from 'vue';

const showLongContent = ref(false);
const count = computed(() => (showLongContent.value ? 333 : 1));
const content = computed(() => ('Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it.'.repeat(count.value)));
const showDialog = ref(false);
</script>
