import { Label, RadioGroup, Radio } from '@constructor-lab/ui-react';

export function RadioGroupSizes() {
  return (
    <RadioGroup defaultValue="medium" className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <Radio value="small" id="size-small" />
        <Label htmlFor="size-small">Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="medium" id="size-medium" />
        <Label htmlFor="size-medium">Medium</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="large" id="size-large" />
        <Label htmlFor="size-large">Large</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="xlarge" id="size-xlarge" />
        <Label htmlFor="size-xlarge">X-Large</Label>
      </div>
    </RadioGroup>
  );
}
