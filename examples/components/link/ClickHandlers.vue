<template>
  
      <preview-group>
        <preview name="Default" span="8">
          <el-link class="el-text el-text--body-24" @click="handleClick">Check Console</el-link>
        </preview>
        <preview name="href + click handler" span="10">
          <div class="el-text el-text--body-24 el-size--width-100">
            <div class="el-text el-text--body-24 el-size--width-100">
              <span>If there are both href and click handler, it would trigger both.</span>
              <el-link href="#/web/button" @click="handleClick">Link</el-link>
            </div>
          </div>
        </preview>
      </preview-group>
    
</template>

<script setup>
  import ElLink from 'packages/link';
  
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';

  const handleClick = () => console.log("Link is clicked");
</script>
