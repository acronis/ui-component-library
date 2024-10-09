<script setup>
  import AcvButton from '@/components/button/button.vue';

  import AcvDialog from '@/components/dialog/dialog.vue';
  import AcvDivider from '@/components/divider/divider.vue';
  import AcvForm from '@/components/form/form.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';
  import { reactive, ref } from 'vue';

  const problemReportDialogVisible = ref(false);

  function onSubmit() {}
  const problemReportForm = reactive({
    email: '',
    issue: ''
  });
</script>

<template>
  <Preview
    name="Problem report"
    span="8"
  >
    <AcvButton @click="problemReportDialogVisible = true">
      Problem report form
    </AcvButton>
    <AcvForm
      :model="problemReportForm"
      :inline-message="false"
      @submit="onSubmit"
    >
      <AcvDialog
        v-model:visible="problemReportDialogVisible"
        title="Problem Report"
        width-size="medium"
      >
        <div class="mx-24 my-24">
          <AcvFormItem class="mb-16">
            <AcvInput
              v-model="problemReportForm.email"
              label="Contact person email"
            />
          </AcvFormItem>
          <AcvFormItem label="Issue (optional)">
            <AcvInput
              v-model="problemReportForm.issue"
              placeholder="Describe the issue you are experiencing"
              type="textarea"
            />
          </AcvFormItem>
        </div>
        <AcvDivider />
        <div class="mx-24 mt-16 mb-24">
          <div class="acv-text acv-text--strong">
            Information about your cluster, that will be sent
          </div>
          <div
            class="acv-text acv-text--body-24"
            style="color: rgb(45 49 56 / 0.6);"
          >
            The report contains data about configurations of all cluster services, their usage statistics and logs (debug included), details on node hardware (IP and MAC addresses, HWIDs/names, S.M.A.R.T. statuses, and such) and software (operation systems and other). The report also may contain kernel panic and segmentation fault dumps
          </div>
        </div>
        <AcvDivider />
        <div class="mx-24 my-16">
          <div class="acv-text acv-text--body-32">
            Last report generated: 16 Mar 2017 at 11:35 PM
          </div>
        </div>
        <template #footer>
          <AcvButton
            type="secondary"
            native-type="button"
            @click="problemReportDialogVisible = false"
          >
            Cancel
          </AcvButton>
          <AcvButton
            native-type="submit"
            @click="problemReportDialogVisible = false;"
          >
            Generate and send
          </AcvButton>
        </template>
      </AcvDialog>
    </AcvForm>
  </Preview>
</template>
