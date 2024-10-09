<script setup>
  import AcvButton from '@/components/button/button.vue';

  import AcvCard from '@/components/card/card.vue';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import AcvDivider from '@/components/divider/divider.vue';
  import AcvForm from '@/components/form/form.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';
  import { reactive, ref } from 'vue';

  const activationDialogVisible = ref(false);

  function onSubmit() {}
  const activationForm = reactive({
    password1: '',
    password2: '',
    acceptAgreement: true
  });
</script>

<template>
  <Preview
    name="Account activation"
    span="8"
  >
    <AcvButton @click="activationDialogVisible = true">
      Account activation form
    </AcvButton>
    <AcvForm
      :model="activationForm"
      :inline-message="false"
      @submit="onSubmit"
    >
      <AcvDialog
        v-model:visible="activationDialogVisible"
        :show-close="false"
      >
        <AcvCard>
          <div class="mx-24 my-24">
            <div
              class="acv-text acv-text--display-medium mb-8 acv-text--align-center"
            >
              Account activation
            </div>
            <div
              class="acv-text acv-text--body-24 acv-text--align-center"
              style="color: rgb(45 49 56 / .6);"
            >
              username
            </div>
          </div>
          <AcvFormItem class="mx-24 my-24">
            <AcvInput
              v-model="activationForm.password1"
              label="Set password"
              type="password"
            />
          </AcvFormItem>
          <AcvFormItem class="mx-24 mt-24 mb-16">
            <AcvInput
              v-model="activationForm.password2"
              label="Confirm password"
              type="password"
            />
          </AcvFormItem>
          <AcvFormItem class="mx-24 my-16">
            <AcvCheckbox
              v-model="activationForm.acceptAgreement"
            >
              I accept the <a>End-Use License Agreement</a>
            </AcvCheckbox>
          </AcvFormItem>
          <AcvDivider />
          <div
            class="mx-24 mt-24 acv-text--align-center"
          >
            <AcvButton
              native-type="submit"
              fluid
              @click="activationDialogVisible = false;"
            >
              Activate account
            </AcvButton>
            <AcvButton
              class="my-16"
              type="ghost"
              @click="activationDialogVisible = false;"
            >
              Cancel
            </AcvButton>
          </div>
        </AcvCard>
      </AcvDialog>
    </AcvForm>
  </Preview>
</template>
