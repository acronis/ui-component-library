import type { Meta, StoryObj } from '@storybook/vue3';
import type { AcvAsideAnchor, AcvAsidePosition } from './aside.ts';
import { ref } from 'vue';
import AcvAside from './aside.vue';

type Story = StoryObj<typeof AcvAside>;
type Args = NonNullable<Story['args']>;

export default {
  component: AcvAside,
  title: 'Components/AcvAside',
  tags: ['autodocs'],
  render,
  argTypes: {
    anchor: {
      control: {
        type: 'select',
      },
      options: ['left', 'right', 'top', 'bottom'] satisfies AcvAsideAnchor[],
    },
    position: {
      control: {
        type: 'select',
      },
      options: ['static', 'fixed', 'sticky', 'absolute'] satisfies AcvAsidePosition[],
    },
    color: {
      control: {
        type: 'select',
      },
      options: ['transparent', 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'],
    },
    width: {
      control: {
        type: 'text',
      },
    },
  },
  args: {
    modelValue: true,
    anchor: 'left',
    position: 'static',
    collapsible: false,
    persistent: false,
    elevation: false,
    animated: true,
    responsive: true,
    width: '300px',
    default: 'Aside content goes here',
  },
} as Meta;

export const Default: Story = {};

export const RightAnchor: Story = {
  args: {
    anchor: 'right',
  },
};

export const TopAnchor: Story = {
  args: {
    anchor: 'top',
    size: '200px', // This becomes height for top/bottom
  },
};

export const BottomAnchor: Story = {
  args: {
    anchor: 'bottom',
    size: '150px', // This becomes height for top/bottom
  },
};

export const WithElevation: Story = {
  args: {
    elevation: true,
  },
};

export const WithColor: Story = {
  args: {
    color: 'primary',
  },
};

export const Collapsible: Story = {
  args: {
    collapsible: true,
  },
};

export const CollapsibleClosed: Story = {
  args: {
    collapsible: true,
    modelValue: false,
  },
};

export const FixedPosition: Story = {
  args: {
    position: 'fixed',
    elevation: true,
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: 'Aside Header',
    footer: 'Aside Footer',
    default: 'Main aside content with header and footer slots',
  },
};

export const CustomWidth: Story = {
  args: {
    size: '400px',
  },
};

export const WithPercentageWidth: Story = {
  args: {
    size: '25%',
  },
};

export const NonAnimated: Story = {
  args: {
    animated: false,
  },
};

export const NonResponsive: Story = {
  args: {
    responsive: false,
  },
};

export const WithCustomClass: Story = {
  args: {
    customClass: 'custom-aside-class',
  },
};

export const WithAccessibility: Story = {
  args: {
    ariaLabel: 'Navigation sidebar',
  },
};

function render(args: Args) {
  return {
    components: { AcvAside },
    setup() {
      const modelValue = ref(args.modelValue);

      const toggleAside = () => {
        modelValue.value = !modelValue.value;
      };

      return {
        args: {
          ...args,
          'modelValue': modelValue.value,
          'onUpdate:modelValue': (value: boolean) => {
            modelValue.value = value;
          },
        },
        modelValue,
        toggleAside,
      };
    },
    template: `
      <div style="min-height: 400px; position: relative; border: 1px solid #e0e0e0; background: #f5f5f5;">
        <div v-if="args.collapsible" style="padding: 16px;">
          <button @click="toggleAside" style="margin-bottom: 16px; padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">
            {{ modelValue ? 'Hide' : 'Show' }} Aside
          </button>
        </div>
        
        <AcvAside v-bind="args">
          <template v-if="args.header" #header>
            <div style="padding: 16px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">
              {{ args.header }}
            </div>
          </template>
          
          <div style="padding: 16px;">
            {{ args.default }}
          </div>
          
          <template v-if="args.footer" #footer>
            <div style="padding: 16px; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0;">
              {{ args.footer }}
            </div>
          </template>
        </AcvAside>
        
        <div style="padding: 20px; margin-left: ${args.anchor === 'left' ? args.size || '300px' : '0'}; margin-right: ${args.anchor === 'right' ? args.size || '300px' : '0'}; margin-top: ${args.anchor === 'top' ? args.size || '200px' : '0'}; margin-bottom: ${args.anchor === 'bottom' ? args.size || '150px' : '0'};">
          <h3>Main Content Area</h3>
          <p>This is the main content area. The aside component is positioned relative to this content.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    `,
  };
}
