<template>
  <preview name="Account activation" span="8">
    <el-button @click="activationDialogVisible = true">Account activation form</el-button>
    <el-form
      :model="activationForm"
      @submit="onSubmit"
      :inline-message="false"
    >
      <el-dialog
        :show-close="false"
        v-model:visible="activationDialogVisible">
        <el-card>
          <div class="mx-24 my-24">
            <div
              class="el-text el-text--display-medium mb-8 el-text--align-center"
            >
              Account activation
            </div>
            <div
              class="el-text el-text--body-24 el-text--align-center"
              style="color: rgb(45,49,56,.6);"
            >
              username
            </div>
          </div>
          <el-form-item class="mx-24 my-24">
            <el-input
              v-model="activationForm.password1"
              label="Set password"
              type="password"
            />
          </el-form-item>
          <el-form-item class="mx-24 mt-24 mb-16">
            <el-input
              v-model="activationForm.password2"
              label="Confirm password"
              type="password"
            />
          </el-form-item>
          <el-form-item class="mx-24 my-16">
            <el-checkbox
              v-model="activationForm.acceptAgreement"
            >
              I accept the <a>End-Use License Agreement</a>
            </el-checkbox>
          </el-form-item>
          <el-divider></el-divider>
          <div
            class="mx-24 mt-24 el-text--align-center">
            <el-button
              @click="activationDialogVisible = false;"
              native-type="submit"
              fluid
            >
              Activate account
            </el-button>
            <el-button
              @click="activationDialogVisible = false;"
              class="my-16"
              type="ghost"
            >Cancel</el-button>
          </div>
        </el-card>
      </el-dialog>
    </el-form>
  </preview>
</template>
<script setup>
import { ref, reactive } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElCard from 'packages/card';
import ElCheckbox from 'packages/checkbox';
import ElDivider from 'packages/divider';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElDialog from 'packages/dialog';

const activationDialogVisible = ref(false);

const onSubmit = () => {};
const activationForm = reactive({
  password1: '',
  password2: '',
  acceptAgreement: true
});
</script>