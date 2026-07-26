<script>
  export default {
    data() {
      return {
        first: {
          value: 'Option A',
          options: [{
            label: 'Option A',
            value: 'Option A'
          }, {
            label: 'Option B',
            value: 'Option B'
          }, {
            label: 'Option C',
            value: 'Option C'
          }]
        },
        second: {
          value: 'Option D',
          options: [{
            label: 'Option D',
            value: 'Option D'
          }, {
            label: 'Option E',
            value: 'Option E'
          }, {
            label: 'Option F',
            value: 'Option F'
          }]
        }
      };
    },
    methods: {
      handleChangeFirst() {
        this.second.value = 'Option D';
      }
    }
  };
</script>

<template>
  <div class="pa-24 ma-24">
    <div class="pa-8">
      <acv-select
        v-model="first.value"
        label="Label"
        @change="handleChangeFirst"
      >
        <acv-option
          v-for="item in first.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </acv-select>
    </div>
    <div class="pa-8">
      <acv-select
        v-model="second.value"
        label="Label"
      >
        <acv-option
          v-for="item in second.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </acv-select>
    </div>
  </div>
</template>
