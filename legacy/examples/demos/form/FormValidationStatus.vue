<script setup>
  import AcvCard from '@/components/card/card.vue';

  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import AcvCol from '@/components/column/column.vue';
  import { reactive, ref } from 'vue';
  // import AcvCheckboxGroup from 'packages/checkbox';
  // import AcvRadioGroup from 'packages/radio';
  import AcvCombobox from '@/components/combobox/combobox.vue';
  import AcvDatePicker from '@/components/date-picker/datePicker.vue';
  import AcvFilePicker from '@/components/file-picker/filePicker.vue';
  import AcvForm from '@/components/form/form.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';
  import AcvOption from '@/components/option/option.vue';
  import AcvRadio from '@/components/radio/radio.vue';
  import AcvRow from '@/components/row/row.vue';
  import AcvSelect from '@/components/select/select.vue';

  // let AcvDatePicker;
  //
  // onBeforeMount(() => {
  //   import('@/components/date-picker/datePicker.vue').then((module) => {
  //     AcvDatePicker = module.default;
  //   });
  // });

  const formWithStatuses = ref(null);
  const model = reactive({
    name: '',
    age: '',
    payment: 'card',
    delivery: '',
    company: '',
    promocode: '',
    date: '',
    proofOfPurchase: '',
    vehicles: [],
    vehicleList: {
      car: false,
      bike: false,
      boat: false
    }
  });
  const status = reactive({});
  const rules = ref({
    name: [
      { required: true, message: 'Say your name' },
      { min: 2, max: 32, message: 'Your name should be 2 to 32 length' }
    ],
    age: [
      { validator: (_, value, callback) => {
        if (!value) {
          return callback([new Error('Please input the age')]);
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('Please input digits'));
          }
          else {
            if (value < 18) {
              callback(new Error('Age must be greater than 18'));
            }
            else {
              callback();
            }
          }
        }, 1000);
      } }
    ],
    payment: [
      { required: true, message: 'Please select payment type' }
    ],
    date: [
      { required: true, message: 'Please select date' }
    ],
    delivery: [
      { required: true, message: 'Please select delivery type' }
    ],
    company: [
      { required: true, message: 'Please select your company' }
    ],
    promocode: [
      {
        validator(rule, value, callback) {
          if (model.delivery === 'Express delivery' && value) {
            return callback(rule.message);
          }

          return callback();
        },
        message: 'Please input valid promo code'
      }
    ]
  });
  const loading = ref(false);
  function onStatusChange({ name, value }) {
    status[name] = value;
  }

  function onSubmitformWithStatuses() {
    loading.value = true;
    setTimeout(() => loading.value = false, 2000);
  }

  const resetForm = () => formWithStatuses.value.resetFields();
</script>

<template>
  <PreviewGroup>
    <Preview span="12">
      <AcvRow class="mb-24 full-width">
        <AcvCol :span="12">
          <div>
            <span class="acv-text acv-text--subheading">
              touched:
            </span>
            {{ status.touched }}
          </div>
          <div>
            <span class="acv-text acv-text--subheading">
              untouched:
            </span>
            {{ status.untouched }}
          </div>
        </AcvCol>
        <AcvCol :span="12">
          <div>
            <span class="acv-text acv-text--subheading">
              valid:
            </span>
            {{ status.valid }}
          </div>
          <div>
            <span class="acv-text acv-text--subheading">
              invalid:
            </span>
            {{ status.invalid }}
          </div>
        </AcvCol>
        <AcvCol :span="12">
          <div>
            <span class="acv-text acv-text--subheading">
              dirty:
            </span>
            {{ status.dirty }}
          </div>
          <div>
            <span class="acv-text acv-text--subheading">
              pristine:
            </span>
            {{ status.pristine }}
          </div>
        </AcvCol>
        <AcvCol :span="12">
          <div>
            <span class="acv-text acv-text--subheading">
              isValidating:
            </span>
            {{ status.isValidating }}
          </div>
          <div>
            <span class="acv-text acv-text--subheading">
              isSubmitting:
            </span>
            {{ status.isSubmitting }}
          </div>
        </AcvCol>
      </AcvRow>
      <AcvCard class="full-width px-24 py-24">
        <AcvForm
          ref="formWithStatuses"
          :model="model"
          :rules="rules"
          :loading="loading"
          @submit="onSubmitformWithStatuses"
          @status="onStatusChange"
        >
          <AcvFormItem prop="name">
            <AcvInput
              v-model="model.name"
              label="Name"
            />
          </AcvFormItem>
          <AcvFormItem prop="age">
            <AcvInput
              v-model.number="model.age"
              type="number"
              label="Age"
              min="1"
              max="100"
              step="1"
            />
          </AcvFormItem>
          <AcvFormItem
            prop="payment"
            label="Payment method"
          >
            <AcvRadioGroup v-model="model.payment">
              <AcvRadio
                class="radio mr-16"
                label="card"
              >
                Card
              </AcvRadio>
              <AcvRadio
                class="radio mr-16"
                label="paypal"
              >
                Paypal
              </AcvRadio>
              <AcvRadio
                class="radio"
                label="cash"
              >
                By cash
              </AcvRadio>
            </AcvRadioGroup>
          </AcvFormItem>
          <AcvFormItem
            prop="vehicles"
            label="Vehicles"
          >
            <AcvCheckboxGroup v-model="model.vehicles">
              <AcvCheckbox
                class="mr-16"
                label="car"
                :checked="model.vehicleList.car"
              >
                Car
              </AcvCheckbox>
              <AcvCheckbox
                class="mr-16"
                label="bike"
                :checked="model.vehicleList.bike"
              >
                Bike
              </AcvCheckbox>
              <AcvCheckbox
                label="boat"
                :checked="model.vehicleList.boat"
              >
                Boat
              </AcvCheckbox>
            </AcvCheckboxGroup>
          </AcvFormItem>
          <AcvFormItem prop="company">
            <AcvCombobox
              v-model="model.company"
              label="Your company:"
              placeholder="Not Selected"
            >
              <AcvOption value="Acronis">
                Acronis
              </AcvOption>
              <AcvOption value="Parallels">
                Parallels
              </AcvOption>
            </AcvCombobox>
          </AcvFormItem>
          <AcvFormItem prop="date">
            <AcvDatePicker
              v-model="model.date"
              type="date"
              placeholder="Not Selected"
              label="Delivery date:"
            />
          </AcvFormItem>
          <AcvFormItem prop="proofOfPurchase">
            <AcvFilePicker
              v-model="model.proofOfPurchase"
              embed-in-form-item
              instruction-text="Upload proof of purchase receipt"
            />
          </AcvFormItem>
          <AcvFormItem prop="delivery">
            <AcvSelect
              v-model="model.delivery"
              label="Delivery type:"
              placeholder="Not Selected"
            >
              <AcvOption value="Express delivery">
                Express delivery
              </AcvOption>
              <AcvOption value="Pickup from the store">
                Pickup from the store
              </AcvOption>
            </AcvSelect>
          </AcvFormItem>
          <AcvFormItem
            v-if="model.delivery === 'Express delivery'"
            prop="promocode"
          >
            <AcvInput
              v-model="model.promocode"
              type="textarea"
              label="Promo code:"
            />
          </AcvFormItem>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              :disabled="loading"
              @click="resetForm"
            >
              Reset
            </AcvButton>
            <AcvButton
              native-type="submit"
              :loading="loading"
              :disabled="status.invalid"
            >
              Submit
            </AcvButton>
          </div>
        </AcvForm>
      </AcvCard>
    </Preview>
  </PreviewGroup>
</template>

<style scoped>
  .full-width {
    width: 100%;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
