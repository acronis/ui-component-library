<template>
  
      <preview-group>
        <preview name="always-display-error = true (Default)" span="12">
          <el-table
            row-key="id"
            :data="model"
            :default-sort = "{ prop: 'url', order: 'descending'}"
            border-bottom>
            <el-table-column label="email Validator" class="alwaysDisplayError-column">
              <template #default="scope">
                <div>
                  <el-form
                    :model="scope.row"
                    :rules="rules"
                  >
                    <el-form-item prop="email">
                      <el-input
                        ref="input"
                        v-model="scope.row.email"
                        :value="scope.row.email"
                        size="small"
                        type="string"
                      />
                    </el-form-item>
                  </el-form>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </preview>
      </preview-group>
    
</template>
<script setup>
import { ref } from 'vue';
import Preview from 'examples/components/preview.vue';

import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElTableColumn from 'packages/table-column';
import ElTable from 'packages/table';


import PreviewGroup from 'examples/components/preview-group.vue';

const model = ref([
  {
    "id": 1,
    "email": "valid@email.com"
  },
  {
    "id": 2,
    "email": ""
  },
  {
    "id": 3,
    "text": ""
  }
]);

const rules = ref({
  email: {
    validator: (_, value, callback) => {
      if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
        callback('Incorrect email address format. Please use a valid email address.');
      }
    }
  }
});
</script>