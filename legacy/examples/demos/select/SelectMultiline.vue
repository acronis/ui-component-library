<script>
  import { AcvOption, AcvSelect } from '@/components';

  const multiLine = {
    value: '',
    options: [
      {
        label: 'Antimalware software status',
      },
      {
        label: 'AutoRun feature status',
      },
      {
        label: 'Backup status',
      },
      {
        label: 'CPU temperature',
      }
    ]
  };

  multiLine.options = multiLine.options.map((e) => {
    e.value = e.label;
    e.subLabel = 'Monitors whether antimalware software is installed, turned on.';
    e.rightIcons = [
      {
        name: 'i-adv--16',
        color: 'brand-primary'
      },
      {
        name: 'i-windows--16',
        color: 'fixed-lightest'
      },
      {
        name: 'i-apple--16',
        color: 'fixed-lightest'
      },
      {
        name: 'i-linux--16',
        color: 'brand-primary'
      }
    ];
    return e;
  });

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      return {
        basic: {
          multiLine
        }
      };
    }
  };
</script>

<template>
  <PreviewGroup class="qa-select-basic">
    <Preview
      name="With icons"
      span="24"
    >
      <AcvSelect
        v-model="basic.multiLine.value"
        filterable
        label="Label"
      >
        <AcvOption
          v-for="item in basic.multiLine.options"
          :key="item.value"
          :label="item.label"
          :sub-label="item.subLabel"
          :value="item.value"
          :right-icons="item.rightIcons"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Without icons"
      span="24"
    >
      <AcvSelect
        v-model="basic.multiLine.value"
        filterable
        label="Label"
      >
        <AcvOption
          v-for="item in basic.multiLine.options"
          :key="item.value"
          :label="item.label"
          :sub-label="item.subLabel"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
