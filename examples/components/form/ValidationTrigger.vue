<template>
  
      <preview-group>
        <preview span="10" name="Default (blur + debouncedInput)">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="defaultForm.model"
              :rules="defaultForm.rules"
              ref="defaultFormRef"
              @status="updateDefaultFormStatus"
            >
              <el-form-item prop="name">
                <el-input v-model="defaultForm.model.name" label="Name"></el-input>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="resetDefaultForm" type="secondary">Reset</el-button>
                <el-button native-type="submit" :disabled="defaultForm.status.invalid">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
        <preview span="10" name="submit">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="submitForm.model"
              :rules="submitForm.rules"
              ref="submitFormRef"
              @status="updateSubmitFormStatus"
            >
              <el-form-item prop="name">
                <el-input v-model="submitForm.model.name" label="Name"></el-input>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="resetSubmitForm" type="secondary">Reset</el-button>
                <el-button native-type="submit">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
        <preview span="10" name="blur">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="blurForm.model"
              :rules="blurForm.rules"
              ref="blurFormRef"
              @status="updateBlurFormRefStatus"
            >
              <el-form-item prop="name">
                <el-input v-model="blurForm.model.name" label="Name"></el-input>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="resetBlurForm" type="secondary">Reset</el-button>
                <el-button native-type="submit" :disabled="blurForm.status.invalid">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
        <preview span="10" name="debounce-input">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="debouncedInputForm.model"
              :rules="debouncedInputForm.rules"
              ref="debouncedInputFormRef"
              @status="updateDebouncedInputFormRefStatus">
              <el-form-item prop="name">
                <el-input v-model="debouncedInputForm.model.name" label="Name"></el-input>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="resetDebouncedInputForm" type="secondary">Reset</el-button>
                <el-button native-type="submit" :disabled="debouncedInputForm.status.invalid">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
        <preview span="10" name="change - select">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="changeSelectForm.model"
              :rules="changeSelectForm.rules"
              ref="changeSelectFormRef"
              @status="updateChangeSelectFormRefStatus"
            >
              <el-form-item prop="name">
                <el-select v-model="changeSelectForm.model.name" label="Name" multiple>
                  <el-option label="Name 1" value="1" checkbox></el-option>
                  <el-option label="Name 2" value="2" checkbox></el-option>
                </el-select>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="resetChangeSelectForm" type="secondary">Reset</el-button>
                <el-button native-type="submit" :disabled="changeSelectForm.status.invalid">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
        <preview span="10" name="change - input">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="changeInputForm.model"
              :rules="changeInputForm.rules"
              ref="changeInputFormRef"
              @status="updateChangeInputFormRefStatus"
            >
              <el-form-item prop="name">
                <el-input v-model="changeInputForm.model.name" label="Name"></el-input>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="resetChangeInputForm" type="secondary">Reset</el-button>
                <el-button native-type="submit" :disabled="changeInputForm.status.invalid">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
      </preview-group>
    
</template>

<script setup>
import { ref, reactive } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElCard from 'packages/card';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElOption from 'packages/option';
import ElSelect from 'packages/select';

import PreviewGroup from 'examples/components/preview-group.vue';

const defaultForm = reactive({
  model: {
    name: ''
  },
  rules: {
    name: [
      { required: true },
      { min: 6, max: 32, message: 'Your name should be 6 to 32 length' }
    ]
  },
  status: {}
});
const defaultFormRef = ref(null);

const updateDefaultFormStatus = ({ name, value }) => {
  defaultForm.status[name] = value;
};

const resetDefaultForm = () => defaultFormRef.value.resetFields();

const submitForm = reactive({
  model: {
    name: ''
  },
  rules: {
    name: [
      { required: true, trigger: 'submit' },
      { min: 6, max: 32, message: 'Your name should be 6 to 32 length', trigger: 'submit' }
    ]
  },
  status: {}
});
const submitFormRef = ref(null);

const updateSubmitFormStatus = ({ name, value }) => {
  submitForm.status[name] = value;
};

const resetSubmitForm = () => submitFormRef.value.resetFields();

const blurFormRef = ref(null);
const blurForm = reactive({
  model: {},
  rules: {
    name: [
      { required: true, trigger: 'blur' },
      { min: 6, max: 32, message: 'Your name should be 6 to 32 length', trigger: 'blur' }
    ]
  },
  status: {}
});

const updateBlurFormRefStatus = ({ name, value }) => blurForm.status[name] = value;

const resetBlurForm = () => blurFormRef.value.resetFields();

const debouncedInputFormRef = ref(null);
const debouncedInputForm = reactive({
  model: {},
  rules: {
    name: [
      { required: true, trigger: 'debounce-input' },
      { min: 6, max: 32, message: 'Your name should be 6 to 32 length', trigger: 'debounce-input' }
    ]
  },
  status: {}
});

const updateDebouncedInputFormRefStatus = ({ name, value }) => debouncedInputForm.status[name] = value;

const resetDebouncedInputForm = () => debouncedInputFormRef.value.resetFields();

const changeSelectFormRef = ref(null);
const changeSelectForm = reactive({
  model: {},
  rules: {
    name: [
      { required: true, trigger: 'change' }
    ]
  },
  status: {}
});

const updateChangeSelectFormRefStatus = ({ name, value }) => changeSelectForm.status[name] = value;

const resetChangeSelectForm = () => changeSelectFormRef.value.resetFields();

const changeInputFormRef = ref(null);
const changeInputForm = reactive({
  model: {},
  rules: {
    name: [
      { required: true, trigger: 'change' },
      { min: 6, max: 32, message: 'Your name should be 6 to 32 length', trigger: 'change' }
    ]
  },
  status: {}
});

const updateChangeInputFormRefStatus = ({ name, value }) => {
  changeInputForm.status[name] = value;
}

const resetChangeInputForm = () => changeInputFormRef.value.resetFields();
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
