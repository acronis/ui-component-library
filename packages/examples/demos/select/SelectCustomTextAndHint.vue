<script>
  import { AcvOption, AcvSelect } from '@/components';
  import { gg } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      return {
        customText: {
          default: gg()([]),
          weeks: {
            value: [],
            options: [
              'First',
              'Second',
              'Third',
              'Fourth',
              'Last'
            ]
          },
          days: {
            value: [],
            options: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday'
            ]
          }
        }
      };
    },
    computed: {
      displayText() {
        return `You selected ${this.customText.default.value.length} option(s)`;
      },
      weeksDisplayText() {
        const { value, options } = this.customText.weeks;
        return value.length === options.length ? 'All weeks' : value.join(', ');
      },
      daysDisplayText() {
        const { value, options } = this.customText.days;
        return value.length === options.length ? 'All days' : value.join(', ');
      }
    }
  };
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Customization"
      span="8"
    >
      <AcvSelect
        v-model="customText.default.value"
        multiple
        label="Label"
        custom-hint="Select option"
        :custom-text="displayText"
      >
        <AcvOption
          v-for="item in customText.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :icon="item.icon"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Select weeks"
      span="8"
    >
      <AcvSelect
        v-model="customText.weeks.value"
        multiple
        label="Weeks"
        :custom-hint="weeksDisplayText"
        :custom-text="weeksDisplayText"
        select-all
      >
        <AcvOption
          v-for="item in customText.weeks.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Select days"
      span="8"
    >
      <AcvSelect
        v-model="customText.days.value"
        multiple
        label="Days"
        :custom-hint="daysDisplayText"
        :custom-text="daysDisplayText"
        select-all
      >
        <AcvOption
          v-for="item in customText.days.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
