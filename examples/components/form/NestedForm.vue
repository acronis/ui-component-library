<template>
  
      <preview-group>
        <preview span="24">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="model"
              :rules="rules"
              ref="nestedItemValidationForm"
            >
              <el-form-item>
                <el-row v-for="(item, index) in model.list" :key="index" :gutter="16">
                  <el-col :span="12">
                    <el-form-item :prop="`list.${index}.name`">
                      <el-input v-model="item.name" label="Name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :prop="`list.${index}.url`">
                      <el-input v-model="item.url" label="URL"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>

              <div class="form-actions">
                <el-button @click="resetForm('nestedItemValidation')" type="secondary">Reset</el-button>
                <el-button native-type="submit">Submit</el-button>
              </div>

            </el-form>
          </el-card>
        </preview>
      </preview-group>
    
</template>
<script setup>
import { ref } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElCard from 'packages/card';
import ElRow from 'packages/row';
import ElCol from 'packages/col';


import PreviewGroup from 'examples/components/preview-group.vue';

const nestedItemValidationForm = ref(null);
const model = ref({
  list: [
    { name: '', url: 'http://' },
    { name: '', url: 'http://' }
  ]
});
const rules = ref({
  list: {
    type: 'array',
    defaultField: {
      type: 'object',
      fields: {
        name: { type: 'string', required: true, message: 'invalid name' },
        url: { type: 'url', required: true, message: 'invalid url' }
      }
    }
  }
})

const resetForm = () => nestedItemValidationForm.value.resetFields();
</script>
<style lang="scss" scoped>
  .full-width {
    width: 100%;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>