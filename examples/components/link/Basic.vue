<template>
  
        <preview-group>
          <preview name="Default" span="8">
            <el-link class="el-text el-text--body-24" href="#/web/button">Link</el-link>
          </preview>
          <preview name="In text" span="10">
            <div class="el-text el-text--body-24 el-size--width-100">
              <span>Now the appliance is not available as a location, as it is in the "Maintenance" state.</span>
              <el-link href="#/web/button">Learn more</el-link>
            </div>
          </preview>
          <preview name="Disabled" span="6">
            <el-link disabled class="el-text el-text--body-24" href="#/web/button">Disabled</el-link>
          </preview>
        </preview-group>
    
</template>

<script setup>
  import ElLink from 'packages/link';
  
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';
</script>
