<template>
  <preview name="Add storage" span="8">
    <el-button @click="addStorageDialogVisible = true">Add storage form</el-button>
    <el-form :model="addStorageForm" @submit="onSubmit" :inline-message="false">
      <el-dialog
        v-model:visible="addStorageDialogVisible"
        title="Add File Sync & Share storage"
        width-size="medium">
        <el-tabs v-model="addStorageForm.storageType">
          <el-tab-pane label="S3" name="s3"></el-tab-pane>
          <el-tab-pane label="Azure" name="azure"></el-tab-pane>
          <el-tab-pane label="File repository" name="fileRepository"></el-tab-pane>
        </el-tabs>
        <template v-if="addStorageForm.storageType === 's3'">
          <div class="mx-24">
            <el-form-item class="my-16">
              <el-radio v-model="addStorageForm.s3Choice" label="amazon" class="mr-24">Amazon</el-radio>
              <el-radio v-model="addStorageForm.s3Choice" label="s3Compatible">S3-compatible</el-radio>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addStorageForm.serverAddress" label="Server address" />
            </el-form-item>
            <el-form-item class="mt-24">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item>
                    <el-input v-model="addStorageForm.accessKeyId" label="Access key ID" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <el-input v-model="addStorageForm.accessKeySecret" label="Secret access key" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="mt-24">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item>
                    <el-select v-model="addStorageForm.region" label="Bucket region">
                      <el-option label="US East (N. Virginia)" value="us-east-1"></el-option>
                      <el-option label="US East (Ohio)" value="us-east-2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <el-input v-model="addStorageForm.bucketName" label="Bucket Name" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <el-divider class="my-24"></el-divider>
          <div class="mx-24 mb-24">
            <el-form-item>
              <el-input v-model="addStorageForm.name" label="Name" />
            </el-form-item>
            <div class="el-text el-text--caption">This storage will appear to your partners as: Cloud storage (name)</div>
          </div>
        </template>
        <template v-if="addStorageForm.storageType === 'azure'">
          <div class="mx-24 my-16 el-text el-text--body-24">
            Microsoft Azure offers two deployment models for cloud resources: the "classic" deployment model and the Azure Resource Manager. In the classic model, each Azure resource (virtual machine, SQL database, etc.) was managed individually. The Azure Resource Manager, introduced in 2014, enables users to create groups of related services so that closely coupled resources can be deployed, managed, and monitored together.
          </div>
        </template>
        <template v-if="addStorageForm.storageType === 'fileRepository'">
          <div class="mx-24 my-16 el-text el-text--body-24">
            The File Repository allows Admins and Modules Power users to upload files for all users to view. These files can be attached to forms if needed.
          </div>
        </template>
        <template v-slot:footer>
          <el-button type="secondary" native-type="button" @click="addStorageDialogVisible = false">Cancel</el-button>
          <el-button native-type="submit" @click="addStorageDialogVisible = false;">Done</el-button>
        </template>
      </el-dialog>
    </el-form>
  </preview>
</template>
<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElCol from 'packages/col';
import ElDivider from 'packages/divider';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElOption from 'packages/option';
import ElRadio from 'packages/radio';
import ElRow from 'packages/row';
import ElSelect from 'packages/select';
import ElTabs from 'packages/tabs';
import ElTabPane from 'packages/tab-pane';
import ElDialog from 'packages/dialog';

const addStorageDialogVisible = ref(false);
const onSubmit = () => {};
const addStorageForm = reactive({
  storageType: 's3',
  s3Choice: '',
  serverAddress: '',
  accessKeyId: '',
  accessKeySecret: '',
  region: 'us-east-1',
  bucketName: '',
  name: ''
});
</script>