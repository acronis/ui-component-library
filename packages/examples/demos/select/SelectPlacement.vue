<script>
  import { AcvOption, AcvSelect } from '@/components';
  import { generateLongOptions } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      return {
        placement: {
          default: generateLongOptions()()
        }
      };
    }
  };
</script>

<template>
  <PreviewGroup class="qa-select-placement">
    <Preview
      name="Bottom start"
      span="8"
    >
      <AcvSelect
        v-model="placement.default.value"
        popper-max-width="552px"
        popper-placement="bottom-start"
        label="Label"
      >
        <AcvOption
          v-for="item in placement.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Bottom"
      span="8"
    >
      <AcvSelect
        v-model="placement.default.value"
        popper-max-width="552px"
        popper-placement="bottom"
        label="Label"
      >
        <AcvOption
          v-for="item in placement.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Bottom end"
      span="8"
    >
      <AcvSelect
        v-model="placement.default.value"
        popper-max-width="552px"
        popper-placement="bottom-end"
        label="Label"
      >
        <AcvOption
          v-for="item in placement.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Top start"
      span="8"
    >
      <AcvSelect
        v-model="placement.default.value"
        popper-max-width="552px"
        popper-placement="top-start"
        label="Label"
        size="small"
      >
        <AcvOption
          v-for="item in placement.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Top"
      span="8"
    >
      <AcvSelect
        v-model="placement.default.value"
        popper-max-width="552px"
        popper-placement="top"
        label="Label"
        size="small"
      >
        <AcvOption
          v-for="item in placement.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Top end"
      span="8"
    >
      <AcvSelect
        v-model="placement.default.value"
        popper-max-width="552px"
        popper-placement="top-end"
        size="small"
      >
        <AcvOption
          v-for="item in placement.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
