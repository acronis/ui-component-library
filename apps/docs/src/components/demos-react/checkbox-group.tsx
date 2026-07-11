'use client';

import { Checkbox, CheckboxGroup } from '@spec-lab/ui-react';

export function CheckboxGroupDemo() {
  return (
    <CheckboxGroup defaultValue={['product']}>
      <Checkbox
        name="product"
        label="Product updates"
        description="News about features and improvements."
      />
      <Checkbox
        name="security"
        label="Security alerts"
        description="Important notices about your account."
      />
      <Checkbox
        name="marketing"
        label="Marketing"
        description="Tips, offers, and news."
      />
    </CheckboxGroup>
  );
}
