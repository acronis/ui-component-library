'use client';

import { useState } from 'react';
import { FormLayout, type FormLayoutField } from '@constructor-lab/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

const FIELDS: FormLayoutField[] = [
  { name: 'firstName', label: 'First name', required: true },
  { name: 'lastName', label: 'Last name', required: true },
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
];

export function FormLayoutDemo() {
  const mount = useShadowMount();
  const [values, setValues] = useState<Record<string, unknown>>({
    firstName: 'Ada',
    lastName: 'Lovelace',
    role: 'editor',
    seats: 5,
    plan: 'pro',
    notify: true,
  });
  return (
    <div style={{ maxWidth: 560 }}>
      <FormLayout
        columns={2}
        fields={FIELDS}
        values={values}
        onValueChange={(name, value) =>
          setValues((v) => ({ ...v, [name]: value }))
        }
        onSubmit={() => {}}
        onCancel={() => {}}
        submitLabel="Save profile"
        portalContainer={mount}
      />
    </div>
  );
}
