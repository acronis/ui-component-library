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
        basic: {
          default: gg()(),
          defaultFilled: gg()('Option 1'),
          small: gg()(),
          smallFilled: gg()('Option 1'),
          smallWithoutLabel: gg()()
        }
      };
    }
  };
</script>

<template>
  <PreviewGroup class="qa-select-disabled">
    <Preview
      name="Default"
      span="8"
    >
      <AcvSelect
        v-model="basic.default.value"
        label="Label"
        disabled
      >
        <AcvOption
          v-for="item in basic.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="With predefined value"
      span="8"
    >
      <AcvSelect
        v-model="basic.defaultFilled.value"
        label="Label"
        disabled
      >
        <AcvOption
          v-for="item in basic.defaultFilled.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Disabled translucent"
      span="8"
      class="dark-bg"
    >
      <div class="dark-bg">
        <AcvSelect
          v-model="basic.default.value"
          label="Label"
          disabled
          translucent
        >
          <AcvOption
            v-for="item in basic.default.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </AcvSelect>
      </div>
    </Preview>
    <Preview
      name="Default"
      span="8"
    >
      <AcvSelect
        v-model="basic.small.value"
        label="Label"
        size="small"
        disabled
      >
        <AcvOption
          v-for="item in basic.small.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="With predefined value"
      span="8"
    >
      <AcvSelect
        v-model="basic.smallFilled.value"
        label="Label"
        size="small"
        disabled
      >
        <AcvOption
          v-for="item in basic.smallFilled.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Without label"
      span="8"
    >
      <AcvSelect
        v-model="basic.smallWithoutLabel.value"
        size="small"
        disabled
      >
        <AcvOption
          v-for="item in basic.smallWithoutLabel.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
