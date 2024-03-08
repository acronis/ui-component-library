<template>
  <preview name="Problem report" span="8">
    <el-button @click="problemReportDialogVisible = true">Problem report form</el-button>
    <el-form :model="problemReportForm" @submit="onSubmit" :inline-message="false">
      <el-dialog
        v-model:visible="problemReportDialogVisible"
        title="Problem Report"
        width-size="medium"
      >
        <div class="mx-24 my-24">
          <el-form-item class="mb-16">
            <el-input
              v-model="problemReportForm.email"
              label="Contact person email" />
          </el-form-item>
          <el-form-item label="Issue (optional)">
            <el-input
              v-model="problemReportForm.issue"
              placeholder="Describe the issue you are experiencing"
              type="textarea"
            />
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <div class="mx-24 mt-16 mb-24">
          <div class="el-text el-text--strong">Information about your cluster, that will be sent</div>
          <div class="el-text el-text--body-24" style="color: rgba(45, 49, 56, 0.6);">The report contains data about configurations of all cluster services, their usage statistics and logs (debug included), details on node hardware (IP and MAC addresses, HWIDs/names, S.M.A.R.T. statuses, and such) and software (operation systems and other). The report also may contain kernel panic and segmentation fault dumps</div>
        </div>
        <el-divider></el-divider>
        <div class="mx-24 my-16">
          <div class="el-text el-text--body-32">Last report generated: 16 Mar 2017 at 11:35 PM</div>
        </div>
        <template v-slot:footer>
          <el-button type="secondary" native-type="button" @click="problemReportDialogVisible = false">Cancel</el-button>
          <el-button native-type="submit" @click="problemReportDialogVisible = false;">Generate and send</el-button>
        </template>
      </el-dialog>
    </el-form>
  </preview>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElDivider from 'packages/divider';
import ElDialog from 'packages/dialog';

const problemReportDialogVisible = ref(false);

const onSubmit = () => {};
const problemReportForm = reactive({
  email: '',
  issue: ''
});
</script>