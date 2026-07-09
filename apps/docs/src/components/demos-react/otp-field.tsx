'use client';

import { OTPField, OTPFieldInput, OTPFieldSeparator } from '@spec-lab/ui-react';

export function OTPFieldDemo() {
  return (
    <OTPField length={6}>
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldSeparator />
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldInput />
    </OTPField>
  );
}
