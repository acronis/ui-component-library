<template>
  
      <template v-if="!responsiveScore">
        <preview-group class="qa-password-score">
          <preview name="Default" span="8" align-items="stretch">
            <el-password
              label="Password"
              :score="0"
            >
            </el-password>
          </preview>
          <preview name="With description" span="8" align-items="stretch">
            <el-password
              label="Password"
              :score="0"
              description="Must contain at least 5 characters"
            >
            </el-password>
          </preview>
          <preview name="When error" span="8" align-items="stretch">
            <el-password
              label="Password"
              :score="0"
              description="Must contain at least 5 characters"
              is-error
            >
            </el-password>
          </preview>
          <preview name="Password weak" span="8" align-items="stretch">
            <el-password
              v-model="p21"
              label="Password"
              :score="1"
            >
            </el-password>
          </preview>
          <preview name="Password normal" span="8" align-items="stretch">
            <el-password
              v-model="p22"
              label="Password"
              :score="2"
            >
            </el-password>
          </preview>
          <preview name="Password strong" span="8" align-items="stretch">
            <el-password
              v-model="p22"
              label="Password"
              :score="3"
            >
            </el-password>
          </preview>
        </preview-group>
      </template>
      <template v-else>
        <preview-group class="qa-password-responsive-score">
          <preview name="Responsive score" span="8" align-items="stretch">
            <el-password
              label="Password"
              v-model="p31"
              :score="p31Score"
            >
            </el-password>
          </preview>
        </preview-group>
      </template>
    
</template>

<script setup>
import { ref, computed } from 'vue';

import ElPassword from 'packages/password';

import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const p21 = ref('pas');
const p22 = ref('password');
const p31 = ref('passw');

const p31Score = computed(() => {
  const len = p31.value.length;
  return len === 0 ? 0 : len <= 6 ? 1 : len <= 8 ? 2 : 3;
})

const props = defineProps({
  responsiveScore: {
    type: Boolean,
    default: false
  }
});
</script>
