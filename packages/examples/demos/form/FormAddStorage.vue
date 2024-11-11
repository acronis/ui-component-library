<script setup>
  import AcvButton from '@/components/button/button.vue';

  import AcvCol from '@/components/column/column.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import AcvDivider from '@/components/divider/divider.vue';
  import AcvForm from '@/components/form/form.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';
  import AcvOption from '@/components/option/option.vue';
  import AcvRadio from '@/components/radio/radio.vue';
  import AcvRow from '@/components/row/row.vue';
  import AcvSelect from '@/components/select/select.vue';
  import AcvTabs from '@/components/tabs/tabs.vue';
  import { reactive, ref } from 'vue';

  const addStorageDialogVisible = ref(false);
  function onSubmit() {}
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

<template>
  <Preview
    name="Add storage"
    span="8"
  >
    <AcvButton @click="addStorageDialogVisible = true">
      Add storage form
    </AcvButton>
    <AcvForm
      :model="addStorageForm"
      :inline-message="false"
      @submit="onSubmit"
    >
      <AcvDialog
        v-model:visible="addStorageDialogVisible"
        title="Add File Sync & Share storage"
        width-size="medium"
      >
        <AcvTabs v-model="addStorageForm.storageType">
          <acv-tab-pane
            label="S3"
            name="s3"
          />
          <acv-tab-pane
            label="Azure"
            name="azure"
          />
          <acv-tab-pane
            label="File repository"
            name="fileRepository"
          />
        </AcvTabs>
        <template v-if="addStorageForm.storageType === 's3'">
          <div class="mx-24">
            <AcvFormItem class="my-16">
              <AcvRadio
                v-model="addStorageForm.s3Choice"
                label="amazon"
                class="mr-24"
              >
                Amazon
              </AcvRadio>
              <AcvRadio
                v-model="addStorageForm.s3Choice"
                label="s3Compatible"
              >
                S3-compatible
              </AcvRadio>
            </AcvFormItem>
            <AcvFormItem>
              <AcvInput
                v-model="addStorageForm.serverAddress"
                label="Server address"
              />
            </AcvFormItem>
            <AcvFormItem class="mt-24">
              <AcvRow :gutter="16">
                <AcvCol :span="12">
                  <AcvFormItem>
                    <AcvInput
                      v-model="addStorageForm.accessKeyId"
                      label="Access key ID"
                    />
                  </AcvFormItem>
                </AcvCol>
                <AcvCol :span="12">
                  <AcvFormItem>
                    <AcvInput
                      v-model="addStorageForm.accessKeySecret"
                      label="Secret access key"
                    />
                  </AcvFormItem>
                </AcvCol>
              </AcvRow>
            </AcvFormItem>
            <AcvFormItem class="mt-24">
              <AcvRow :gutter="16">
                <AcvCol :span="12">
                  <AcvFormItem>
                    <AcvSelect
                      v-model="addStorageForm.region"
                      label="Bucket region"
                    >
                      <AcvOption
                        label="US East (N. Virginia)"
                        value="us-east-1"
                      />
                      <AcvOption
                        label="US East (Ohio)"
                        value="us-east-2"
                      />
                    </AcvSelect>
                  </AcvFormItem>
                </AcvCol>
                <AcvCol :span="12">
                  <AcvFormItem>
                    <AcvInput
                      v-model="addStorageForm.bucketName"
                      label="Bucket Name"
                    />
                  </AcvFormItem>
                </AcvCol>
              </AcvRow>
            </AcvFormItem>
          </div>
          <AcvDivider class="my-24" />
          <div class="mx-24 mb-24">
            <AcvFormItem>
              <AcvInput
                v-model="addStorageForm.name"
                label="Name"
              />
            </AcvFormItem>
            <div class="acv-text acv-text--caption">
              This storage will appear to your partners as: Cloud storage (name)
            </div>
          </div>
        </template>
        <template v-if="addStorageForm.storageType === 'azure'">
          <div class="mx-24 my-16 acv-text acv-text--body-24">
            Microsoft Azure offers two deployment models for cloud resources: the "classic" deployment model and the Azure Resource Manager. In the classic model, each Azure resource (virtual machine, SQL database, etc.) was managed individually. The Azure Resource Manager, introduced in 2014, enables users to create groups of related services so that closely coupled resources can be deployed, managed, and monitored together.
          </div>
        </template>
        <template v-if="addStorageForm.storageType === 'fileRepository'">
          <div class="mx-24 my-16 acv-text acv-text--body-24">
            The File Repository allows Admins and Modules Power users to upload files for all users to view. These files can be attached to forms if needed.
          </div>
        </template>
        <template #footer>
          <AcvButton
            type="secondary"
            native-type="button"
            @click="addStorageDialogVisible = false"
          >
            Cancel
          </AcvButton>
          <AcvButton
            native-type="submit"
            @click="addStorageDialogVisible = false;"
          >
            Done
          </AcvButton>
        </template>
      </AcvDialog>
    </AcvForm>
  </Preview>
</template>
