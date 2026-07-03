import {
  Label,
  RadioGroup,
  Radio,
} from '@spec-lab/ui-react';

export function RadioGroupHorizontal() {
  return (
    <RadioGroup defaultValue="yes" className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <Radio value="yes" id="r4-yes" />
        <Label htmlFor="r4-yes">Yes</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="no" id="r4-no" />
        <Label htmlFor="r4-no">No</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="maybe" id="r4-maybe" />
        <Label htmlFor="r4-maybe">Maybe</Label>
      </div>
    </RadioGroup>
  );
}
