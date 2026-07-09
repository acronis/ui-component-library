import { useState } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  FieldLegend,
  FieldSet,
  Radio,
  RadioGroup,
  Switch,
} from '@spec-lab/ui-react';

export function FieldGroupDemo() {
  const [channels, setChannels] = useState<string[]>(['email']);

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      {/* Multi-select: CheckboxGroup owns a string[] of the ticked names. */}
      <FieldSet>
        <FieldLegend>Notification channels</FieldLegend>
        <CheckboxGroup value={channels} onValueChange={setChannels}>
          <Checkbox name="email" label="Email" />
          <Checkbox name="sms" label="SMS" />
          <Checkbox name="push" label="Push notifications" />
        </CheckboxGroup>
        {/* Group-level error. `FieldError` needs a `Field.Root` ancestor; a
            checkbox group lives in a `FieldSet`, so surface the message directly. */}
        {channels.length === 0 && (
          <p className="text-sm text-[var(--ui-text-on-status-danger)]">
            Choose at least one channel.
          </p>
        )}
      </FieldSet>

      {/* Single-select: one RadioGroup, one legend. */}
      <FieldSet>
        <FieldLegend>Plan</FieldLegend>
        <RadioGroup defaultValue="team">
          <label className="flex items-center gap-2 text-sm">
            <Radio value="free" /> Free
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Radio value="team" /> Team
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Radio value="enterprise" /> Enterprise
          </label>
        </RadioGroup>
      </FieldSet>

      {/* Independent toggles grouped under one legend. */}
      <FieldSet>
        <FieldLegend variant="label">Advanced</FieldLegend>
        <Switch label="Enable two-factor authentication" />
        <Switch label="Share anonymous usage data" defaultChecked />
      </FieldSet>
    </div>
  );
}
