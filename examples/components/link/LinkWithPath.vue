<template>
  
      <preview-group>
        <preview name="Windows Path" span="8">
          <el-link class="el-text el-text--body-24 el-size--width-100" href="#/web/utilities">
      <span v-text-middle-ellipsis:show-hover-hint>
        C:\Users\ui.kit\Desktop\Folder\testfile.txt
      </span>
          </el-link>
        </preview>
        <preview name="Linux/Mac Path" span="8">
          <el-link class="el-text el-text--body-24  el-size--width-100" href="#/web/utilities">
        <span v-text-middle-ellipsis:show-hover-hint>
          /users/ui.kit/desktop/folder/testfile.txt
        </span>
          </el-link>
        </preview>
      </preview-group>
    
</template>

<script setup>
  import ElLink from 'packages/link';
  import ElTextMiddleEllipsis from 'packages/text-middle-ellipsis';
  
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';
</script>
