<script>
  import { AcvOption, AcvOptionGroup, AcvSelect } from '@/components';

  export default {
    components: {
      AcvSelect,
      AcvOption,
      AcvOptionGroup
    },
    data() {
      return {
        slots: {
          options: [
            {
              value: 0,
              label: 'Info',
              icon: 'i-info-circle--16',
              color: '#08A69E'
            },
            {
              value: 1,
              label: 'Success',
              icon: 'i-check-circle--16',
              color: '#6F5B95'
            },
            {
              value: 2,
              label: 'Error',
              icon: 'i-times-circle--16',
              color: '#CE78F3'
            },
            {
              value: 3,
              label: 'Warning',
              icon: 'i-exclamation-triangle--16',
              color: '#24AEE2'
            },
            {
              value: 4,
              label: 'Critical',
              icon: 'clr-critical--16',
              color: '#FFBF00'
            }
          ],
          select: {
            prefix: '',
            suffix: ''
          },
          option: {
            prefix: '',
            suffix: ''
          },
          optionGroups: {
            options: [{
              label: 'Form Colors',
              options: [{
                value: 'seagreen',
                label: 'seagreen',
                color: '#08A69E'
              }, {
                value: 'violet',
                label: 'violet',
                color: '#6F5B95'
              }, {
                value: 'purple',
                label: 'purple',
                color: '#CE78F3'
              }, {
                value: 'skyblue',
                label: 'skyblue',
                color: '#24AEE2'
              }, {
                value: 'yellow',
                label: 'yellow',
                color: '#E8C94D'
              }, {
                value: 'gold',
                label: 'gold',
                color: '#FFBF00'
              }, {
                value: 'coral',
                label: 'coral',
                color: '#F15C5C'
              }]
            }, {
              label: 'Form Border Colors',
              options: [{
                value: 'seagreen-accent',
                label: 'seagreen',
                color: '#D2EFED'
              }, {
                value: 'violet-accent',
                label: 'violet',
                color: '#D7D1E2'
              }, {
                value: 'purple-accent',
                label: 'purple',
                color: '#F2DAFC'
              }, {
                value: 'skyblue-accent',
                label: 'skyblue',
                color: '#C2E9F7'
              }, {
                value: 'yellow-accent',
                label: 'yellow',
                color: '#F9F0CE'
              }, {
                value: 'gold-accent',
                label: 'gold',
                color: '#FFE8A3'
              }, {
                value: 'coral-accent',
                label: 'coral',
                color: '#FBD2D2'
              }]
            }],
            value: ''
          }
        }
      };
    }
  };
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Prefix slot"
      span="8"
    >
      <AcvSelect
        v-model="slots.optionGroups.value"
      >
        <AcvOptionGroup
          v-for="group in slots.optionGroups.options"
          :key="group.label"
          :disabled="group.disabled"
          :label="group.label"
        >
          <AcvOption
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <template #prefix>
              <div
                class="box mr-8"
                :style="{ backgroundColor: item.color }"
              />
            </template>
          </AcvOption>
        </AcvOptionGroup>
      </AcvSelect>
    </Preview>
    <Preview
      name="Suffix slot"
      span="8"
      class="preview--hidden"
    >
      <AcvSelect
        v-model="slots.optionGroups.value"
      >
        <AcvOptionGroup
          v-for="group in slots.optionGroups.options"
          :key="group.label"
          :disabled="group.disabled"
          :label="group.label"
        >
          <AcvOption
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <template #suffix>
              <div
                class="box mr-8"
                :style="{ backgroundColor: item.color }"
              />
            </template>
          </AcvOption>
        </AcvOptionGroup>
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
