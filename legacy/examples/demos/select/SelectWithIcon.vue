<script>
  import AcvOption from '@/components/option/option.vue';
  import AcvSelect from '@/components/select/select.vue';
  import { ggWithIcon } from '../../__mocks__/data.select.generateOptions.js';

  const statuses = [
    {
      label: 'Not defined',
      icon: 'i-ban-o--16',
      color: 'brand-light'
    },
    {
      label: 'Approved',
      icon: 'i-check-circle--16',
      color: 'fixed-success'
    },
    {
      label: 'Declined',
      icon: 'i-times-circle--16',
      color: 'fixed-danger'
    }
  ];

  export default {
    components: {
      AcvSelect,
      AcvOption,
    },
    data() {
      return {
        basic: {
          defaultWithIcon: ggWithIcon()(),
          withoutLabelIcon: ggWithIcon()(),
          translucentLabelIcon: ggWithIcon()(),
          smallWithIcon: ggWithIcon()(),
          smallWithPredefinedIcon: ggWithIcon()(statuses[0]),
          disabledWithIcon: ggWithIcon()(),
        }
      };
    }
  };
</script>

<template>
  <PreviewGroup class="qa-select-basic-with-icon">
    <Preview
      name="Default with icon"
      span="8"
    >
      <AcvSelect
        v-model="basic.defaultWithIcon.value"
        show-selected-icon
        label="Label"
        placeholder-icon="i-info-circle--16"
        placeholder-icon-color="fixed-info"
      >
        <AcvOption
          v-for="item in basic.defaultWithIcon.options"
          :key="item.value"
          :label="item.label"
          :selected="basic.defaultWithIcon.value === item.value"
          :value="item.value"
          :icon="item.icon"
          :icon-color="item.color"
          @click="basic.defaultWithIcon.value = item.value"
        />
      </AcvSelect>
    </Preview>

    <Preview
      name="Without label"
      span="8"
    >
      <AcvSelect
        v-model="basic.withoutLabelIcon.value"
        show-selected-icon
        placeholder-icon="i-info-circle--16"
        placeholder-icon-color="fixed-info"
      >
        <AcvOption
          v-for="item in basic.withoutLabelIcon.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :icon="item.icon"
          :icon-color="item.color"
          @click="basic.withoutLabelIcon.value = item.value"
        />
      </AcvSelect>
    </Preview>

    <Preview
      name="Translucent with icon"
      span="8"
      class="dark-bg"
    >
      <div class="dark-bg">
        <AcvSelect
          v-model="basic.translucentLabelIcon.value"
          show-selected-icon
          label="Label"
          placeholder-icon="i-info-circle--16"
          placeholder-icon-color="fixed-info"
          translucent
        >
          <AcvOption
            v-for="item in basic.translucentLabelIcon.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :icon="item.icon"
            :icon-color="item.color"
          />
        </AcvSelect>
      </div>
    </Preview>

    <Preview
      name="Small with icon"
      span="8"
    >
      <AcvSelect
        v-model="basic.smallWithIcon.value"
        show-selected-icon
        label="Label"
        size="small"
        placeholder-icon="i-info-circle--16"
        placeholder-icon-color="fixed-info"
      >
        <AcvOption
          v-for="item in basic.smallWithIcon.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :icon="item.icon"
          :icon-color="item.color"
        />
      </AcvSelect>
    </Preview>

    <Preview
      name="With predefined value"
      span="8"
    >
      <AcvSelect
        v-model="basic.smallWithPredefinedIcon.value"
        show-selected-icon
        label="Label"
        size="small"
      >
        <AcvOption
          v-for="item in basic.smallWithPredefinedIcon.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :icon="item.icon"
          :icon-color="item.color"
        />
      </AcvSelect>
    </Preview>

    <Preview
      name="Disabled with icon"
      span="8"
    >
      <AcvSelect
        v-model="basic.disabledWithIcon.value"
        show-selected-icon
        label="Label"
        size="small"
        placeholder-icon="i-info-circle--16"
        placeholder-icon-color="fixed-info-accent"
        disabled
      >
        <AcvOption
          v-for="item in basic.disabledWithIcon.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :icon="item.icon"
          :icon-color="item.color"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
