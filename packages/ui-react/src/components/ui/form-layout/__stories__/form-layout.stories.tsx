import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormLayout, type FormLayoutField } from '../form-layout';

const FIELDS: FormLayoutField[] = [
  {
    name: 'fullName',
    label: 'Full name',
    required: true,
    placeholder: 'Ada Lovelace',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'you@example.com',
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    placeholder: 'Select a role',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' },
    ],
  },
  { name: 'seats', label: 'Seats', type: 'number', min: 1, max: 100 },
  {
    name: 'plan',
    label: 'Plan',
    type: 'radio',
    options: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
    ],
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    description: 'Shown on your public profile.',
  },
  { name: 'notify', label: 'Email notifications', type: 'switch' },
  {
    name: 'terms',
    label: 'I accept the terms',
    type: 'checkbox',
    required: true,
  },
];

const INITIAL = {
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  role: 'editor',
  seats: 5,
  plan: 'pro',
  bio: 'Mathematician and writer.',
  notify: true,
  terms: false,
};

type ExampleProps = {
  columns?: 1 | 2;
  disabled?: boolean;
  errors?: Record<string, string>;
  submitLabel?: string;
  withCancel?: boolean;
};

function Example({ withCancel, ...props }: ExampleProps) {
  const [values, setValues] = useState<Record<string, unknown>>(INITIAL);
  return (
    <div style={{ maxWidth: props.columns === 2 ? 640 : 420 }}>
      <FormLayout
        fields={FIELDS}
        values={values}
        onValueChange={(name, value) =>
          setValues((v) => ({ ...v, [name]: value }))
        }
        onSubmit={() => {}}
        onCancel={withCancel ? () => {} : undefined}
        {...props}
      />
    </div>
  );
}

const meta = {
  title: 'Components/FormLayout',
  component: FormLayout,
  parameters: { layout: 'padded' },
  // Satisfy the required props at the type level; every story overrides via its
  // own stateful `render`.
  args: { fields: FIELDS, values: {}, onValueChange: () => {} },
  argTypes: {
    columns: {
      control: 'inline-radio',
      options: [1, 2],
      description: 'Column count (2 collapses to 1 on narrow widths).',
      table: { category: 'Layout' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    submitLabel: { control: 'text', table: { category: 'Content' } },
    fields: { control: false, table: { category: 'Data' } },
    values: { control: false, table: { category: 'Data' } },
    onValueChange: { control: false, table: { category: 'Events' } },
    onSubmit: { control: false, table: { category: 'Events' } },
    errors: { control: false, table: { category: 'State' } },
  },
} satisfies Meta<typeof FormLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

// Every field type in one vertical form: text, email, select, number, radio,
// textarea, switch, checkbox.
export const Default: Story = {
  render: () => <Example columns={1} submitLabel="Save profile" withCancel />,
};

// Responsive two-column layout; the textarea spans the full row.
export const TwoColumn: Story = {
  render: () => <Example columns={2} submitLabel="Save" withCancel />,
};

// Per-field error messages, keyed by field name.
export const WithErrors: Story = {
  render: () => (
    <Example
      columns={1}
      errors={{
        email: 'Enter a valid email address.',
        terms: 'You must accept the terms to continue.',
      }}
    />
  ),
};

// Whole-form disabled state.
export const Disabled: Story = {
  render: () => <Example columns={1} disabled />,
};
