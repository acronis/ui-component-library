<template>
  
      <div class="qa-input-mask">
        <preview-group>
          <preview span="8" name="MAC address" align-items='stretch'>
            <el-input
              v-model="input1"
              :mask="{
                mask: '**-**-**-**-**-**'
              }"
              placeholder='A8-B6-E0-91-D7-AE'
              label="MAC address"
            />

          </preview>
          <preview span="8" name="IP address" align-items='stretch'>
            <el-input
              :mask="{
                mask: '0[00].0[00].0[00].0[00]'
              }"
              placeholder='192.168.0.1'
              v-model="input2"
              label="IP address"
            />
          </preview>
          <preview span="8" name="CVE" align-items='stretch'>
            <el-input
              :mask="{
                mask: 'CVE-0000-0000000'
              }"
              placeholder='CVE-0000-0000000'
              v-model="input3"
              label="CVE"
              prefix-value="CVE-"
            />
          </preview>
          <preview span="8" name="MAC address with delay mask" align-items='stretch'>
            <el-input
              v-model="input4"
              :debounce-process-mask="500"
              :mask="{
                mask: '**-**-**-**-**-**'
              }"
              placeholder='A8-B6-E0-91-D7-AE'
              label="MAC address"
            />
          </preview>
          <preview span="8" name="IP address with delay mask" align-items='stretch'>
            <el-input
              :mask="{
                mask: '0[00].0[00].0[00].0[00]'
              }"
              placeholder='192.168.0.1'
              v-model="input5"
              :debounce-process-mask="500"
              label="IP address"
            />
          </preview>
          <preview span="8" name="CVE with delay mask" align-items='stretch'>
            <el-input
              :mask="{
                mask: 'CVE-0000-0000000'
              }"
              placeholder='CVE-0000-0000000'
              v-model="input6"
              :debounce-process-mask="500"
              label="CVE"
              prefix-value="CVE-"
            />
          </preview>
        </preview-group>
      </div>
    
</template>

<script setup>
import { ref } from 'vue';

import ElInput from 'packages/input';

import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
const input4 = ref('');
const input5 = ref('');
const input6 = ref('');
</script>