<template>
  <template v-if="isIntegerOnly">
    <preview-group class="qa-numpicker-integer">
      <preview name="Default" span="6">
        <el-num-picker v-model="num5" label="Label"  :integer-only="true"></el-num-picker>
      </preview>
      <preview name="With min,max and suffix" span="8">
        <el-num-picker
          v-model="num10"
          label="Label"
          :min="2"
          :max="100"
          suffix=" %"
          :integer-only="true"
        ></el-num-picker>
      </preview>
    </preview-group>
  </template>
  <template v-else-if="isStrict">
    <preview-group class="qa-numpicker-step-strictly">
      <preview name="Default" span="6">
        <el-num-picker v-model="num6" :step="10" label="Label"  :step-strictly="true" :min="10" :max="100"></el-num-picker>
      </preview>
      <preview name="Default" span="6">
        <el-num-picker v-model="num7" :step="10" label="Label"  :step-strictly="true" :min="10" :max="100" suffix="GB"></el-num-picker>
      </preview>
    </preview-group>
  </template>
  <template v-else-if="isDisabled">
    <preview-group class="qa-numpicker-disabled">
      <preview name="Default" span="6">
        <el-num-picker v-model="num8" label="Label" disabled></el-num-picker>
      </preview>
    </preview-group>
  </template>
  <template v-else-if="isInfinity">
    <preview-group class="qa-numpicker-infinity">
      <preview name="Default" span="6">
        <el-num-picker v-model="num9" label="Label" infinity></el-num-picker>
      </preview>
    </preview-group>
  </template>
  <template v-else>
    <preview-group class="qa-numpicker-basic">
      <preview name="Default" span="6">
        <el-num-picker
          v-model="num1"
          :min="1"
          :max="10"
          label="Label"
          @change="handleChange"
        >
        </el-num-picker>
      </preview>
      <preview name="With step" span="6">
        <el-num-picker
          v-model="num2"
          :min="1"
          :max="10"
          :step="2"
          label="Label"
          @change="handleChange"
        >
        </el-num-picker>
      </preview>
      <preview name="With prefix" span="6">
        <el-num-picker
          v-model="num3"
          :min="1"
          :max="10"
          prefix="-"
          label="Label"
          @change="handleChange"
        >
        </el-num-picker>
      </preview>
      <preview name="With suffix" span="6">
        <el-num-picker
          v-model="num4"
          :min="1"
          :max="10"
          suffix="%"
          label="Label"
          @change="handleChange"
        >
        </el-num-picker>
      </preview>
    </preview-group>
  </template>
</template>

<script setup>
import { ref } from 'vue';

import ElNumPicker from 'packages/num-picker';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const num1 = ref(1);
const num2 = ref(1);
const num3 = ref(1);
const num4 = ref(1);
const num5 = ref(1);
const num6 = ref(30);
const num7 = ref(40);
const num8 = ref(1);
const num9 = ref(1);
const num10 = ref(20);


const handleChange = (value) => {
  console.log(value);
};

const props = defineProps({
  isBasic: {
    type: Boolean
  },
  isIntegerOnly: {
    type: Boolean
  },
  isStrict: {
    type: Boolean
  },
  isDisabled: {
    type: Boolean
  },
  isInfinity: {
    type: Boolean
  }
});

</script>
