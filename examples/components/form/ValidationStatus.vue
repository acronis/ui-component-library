<template>
  
      <preview-group>
        <preview span="12">
          <el-row class="mb-24 full-width">
            <el-col :span="12">
              <div>
                <span class="el-text el-text--subheading">
                  touched:
                </span>
                {{ status.touched }}
              </div>
              <div>
                <span class="el-text el-text--subheading">
                  untouched:
                </span>
                {{ status.untouched }}
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="el-text el-text--subheading">
                  valid:
                </span>
                {{ status.valid }}
              </div>
              <div>
                <span class="el-text el-text--subheading">
                  invalid:
                </span>
                {{ status.invalid }}
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="el-text el-text--subheading">
                  dirty:
                </span>
                {{ status.dirty }}
              </div>
              <div>
                <span class="el-text el-text--subheading">
                  pristine:
                </span>
                {{ status.pristine }}
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="el-text el-text--subheading">
                  isValidating:
                </span>
                {{ status.isValidating }}
              </div>
              <div>
                <span class="el-text el-text--subheading">
                  isSubmitting:
                </span>
                {{ status.isSubmitting }}
              </div>
            </el-col>
          </el-row>
          <el-card class="full-width px-24 py-24">
            <el-form
              ref="formWithStatuses"
              :model="model"
              :rules="rules"
              :loading="loading"
              @submit="onSubmitformWithStatuses"
              @status="onStatusChange">
              <el-form-item prop="name">
                <el-input v-model="model.name" label="Name" />
              </el-form-item>
              <el-form-item prop="age">
                <el-input
                  type="number"
                  v-model.number="model.age"
                  label="Age"
                  min="1"
                  max="100"
                  step="1"
                />
              </el-form-item>
              <el-form-item prop="payment" label="Payment method">
                <el-radio-group v-model="model.payment">
                  <el-radio class="radio mr-16" label="card">Card</el-radio>
                  <el-radio class="radio mr-16" label="paypal">Paypal</el-radio>
                  <el-radio class="radio" label="cash">By cash</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="vehicles" label="Vehicles">
                <el-checkbox-group v-model="model.vehicles">
                  <el-checkbox
                    class="mr-16"
                    label="car"
                    :checked="model.vehicleList.car"
                  >Car</el-checkbox>
                  <el-checkbox
                    class="mr-16"
                    label="bike"
                    :checked="model.vehicleList.bike"
                  >Bike</el-checkbox>
                  <el-checkbox
                    label="boat"
                    :checked="model.vehicleList.boat"
                  >Boat</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item prop="company">
                <el-combobox v-model="model.company" label="Your company:" placeholder="Not Selected">
                  <el-option value="Acronis">Acronis</el-option>
                  <el-option value="Parallels">Parallels</el-option>
                </el-combobox>
              </el-form-item>
              <el-form-item prop="date">
                <el-date-picker
                  v-model="model.date"
                  type="date"
                  placeholder="Not Selected"
                  label='Delivery date:'>
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="proofOfPurchase">
                <el-file-picker
                  v-model="model.proofOfPurchase"
                  embed-in-form-item
                  instruction-text="Upload proof of purchase receipt"
                >
                </el-file-picker>
              </el-form-item>
              <el-form-item prop="delivery">
                <el-select
                  v-model="model.delivery"
                  label="Delivery type:"
                  placeholder="Not Selected"
                >
                  <el-option value="Express delivery">Express delivery</el-option>
                  <el-option value="Pickup from the store">Pickup from the store</el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                prop="promocode"
                v-if="model.delivery === 'Express delivery'"
              >
                <el-input v-model="model.promocode" type="textarea" label="Promo code:"></el-input>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="resetForm" type="secondary" :disabled="loading">Reset</el-button>
                <el-button native-type="submit" :loading="loading" :disabled="status.invalid">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
      </preview-group>
    
</template>
<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElCard from 'packages/card';
import ElCheckbox from 'packages/checkbox';
import ElCheckboxGroup from 'packages/checkbox';
import ElCol from 'packages/col';
import ElCombobox from 'packages/combobox';
import ElFilePicker from 'packages/file-picker';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElOption from 'packages/option';
import ElRadio from 'packages/radio';
import ElRadioGroup from 'packages/radio';
import ElRow from 'packages/row';
import ElSelect from 'packages/select';

import PreviewGroup from 'examples/components/preview-group.vue';

let ElDatePicker;

onBeforeMount(() => {
  import('packages/date-picker').then((module) => {
    ElDatePicker = module.default;
  });
});

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
        } else {
          if (value < 18) {
            callback(new Error('Age must be greater than 18'));
          } else {
            callback();
          }
        }
      }, 1000);
    }}
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
      validator: function (rule, value, callback) {
        if (model.delivery === 'Express delivery' && value) {
          return callback(rule.message);
        }

        return callback();
      }.bind(this),
      message: 'Please input valid promo code'
    }
  ]
});
const loading = ref(false);
const onStatusChange = ({ name, value }) => {
  status[name] = value;
};

const onSubmitformWithStatuses = () => {
  loading.value = true;
  setTimeout(() => loading.value = false, 2000);
};

const resetForm = () => formWithStatuses.value.resetFields();
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