<script>
  import AcvCascader from '@/components/cascader/cascader.vue';
  import AcvIcon from '@/components/icon/icon.vue';

  export default {
    components: {
      AcvIcon,
      AcvCascader
    },
    data: () => ({
      dialogBasicVisible: false,
      options: [
        {
          value: 'guide',
          label: 'Guide',
          children: [{
            value: 'disciplines',
            label: 'Disciplines',
            children: []
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'side nav',
              label: 'Side Navigation'
            }, {
              value: 'top nav',
              label: 'Top Navigation'
            }]
          }],
          divider: true
        },
        {
          value: 'component',
          label: 'Component',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout'
            }, {
              value: 'color',
              label: 'Color'
            }, {
              value: 'typography',
              label: 'Typography'
            }, {
              value: 'icon',
              label: 'Icon'
            }, {
              value: 'button',
              label: 'Button'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio'
            }, {
              value: 'checkbox',
              label: 'Checkbox'
            }, {
              value: 'input',
              label: 'Input'
            }, {
              value: 'input-number',
              label: 'InputNumber'
            }, {
              value: 'select',
              label: 'Select'
            }, {
              value: 'cascader',
              label: 'Cascader'
            }, {
              value: 'switch',
              label: 'Switch',
              divider: true
            }, {
              value: 'slider',
              label: 'Slider'
            }, {
              value: 'time-picker',
              label: 'TimePicker'
            }, {
              value: 'date-picker',
              label: 'DatePicker',
              divider: true
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker',
              children: []
            }, {
              value: 'upload',
              label: 'Upload'
            }, {
              value: 'rate',
              label: 'Rate'
            }, {
              value: 'form',
              label: 'Form'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table'
            }, {
              value: 'tag',
              label: 'Tag'
            }, {
              value: 'progress',
              label: 'Progress'
            }, {
              value: 'tree',
              label: 'Tree'
            }, {
              value: 'pagination',
              label: 'Pagination'
            }, {
              value: 'badge',
              label: 'Badge'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert'
            }, {
              value: 'loading',
              label: 'Loading'
            }, {
              value: 'message',
              label: 'Message'
            }, {
              value: 'message-box',
              label: 'MessageBox'
            }, {
              value: 'notification',
              label: 'Notification'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu'
            }, {
              value: 'tabs',
              label: 'Tabs'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb'
            }, {
              value: 'dropdown',
              label: 'Dropdown'
            }, {
              value: 'steps',
              label: 'Steps'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog'
            }, {
              value: 'tooltip',
              label: 'Tooltip'
            }, {
              value: 'popover',
              label: 'Popover'
            }, {
              value: 'card',
              label: 'Card'
            }, {
              value: 'carousel',
              label: 'Carousel'
            }, {
              value: 'collapse',
              label: 'Collapse'
            }]
          }]
        },
        {
          value: 'resource',
          label: 'Resource',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'docs',
            label: 'Design Documentation'
          }]
        }
      ],
      optionsTwo: [
        {
          value: 'guide',
          label: 'Guide',
          disabled: true,
          children: [{
            value: 'disciplines',
            label: 'Disciplines',
            children: [{
              value: 'consistency',
              label: 'Consistency'
            }, {
              value: 'feedback',
              label: 'Feedback'
            }, {
              value: 'efficiency',
              label: 'Efficiency'
            }, {
              value: 'controllability',
              label: 'Controllability'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'side nav',
              label: 'Side Navigation'
            }, {
              value: 'top nav',
              label: 'Top Navigation'
            }]
          }]
        },
        {
          value: 'resource',
          label: 'Resource',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'docs',
            label: 'Design Documentation'
          }]
        }
      ],
      valueOne: '',
      valueTwo: '',
      valueThree: '',
      valueFour: '',
      valueFive: '',
      valueSix: '',
      valueSeven: '',
      valueEight: ''
    }),
    methods: {
      handleChange(value) {
        console.log('Change event fired');
        console.log(value);
      },
      handleSelect(value, label, path) {
        console.log('Select event fired');
        console.log(`${value},${label},${path}`);
      }
    }
  };
</script>

<template>
  <PreviewGroup class="qa-card-basic">
    <Preview
      name="Number of children"
      span="6"
    >
      <AcvCascader
        v-model="valueSeven"
        :options="options"
        @change="handleChange"
        @select="handleSelect"
      >
        <template #default="{ node } = {}">
          <span v-if="node && node.label">{{ node.label }}</span>
          <span v-if="node && node.children">({{ node.children.length }})</span>
        </template>
      </AcvCascader>
    </Preview>
    <Preview
      name="Icons"
      span="6"
    >
      <AcvCascader
        v-model="valueSeven"
        :options="options"
        @change="handleChange"
        @select="handleSelect"
      >
        <template #default="{ node = {}, active = false } = {}">
          <span
            v-if="node && node.children && node.children.length > 4"
            class="mr-8"
          >
            <AcvIcon
              name="exclamation-circle--16"
              :color="active ? 'fixed-primary' : 'brand-primary'"
            />
          </span><span>{{ node.label }}</span>
        </template>
      </AcvCascader>
    </Preview>
  </PreviewGroup>
</template>
