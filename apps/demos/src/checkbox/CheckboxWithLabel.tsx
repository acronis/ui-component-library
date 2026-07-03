import { Checkbox, Label } from '@spec-lab/ui-react';

export function CheckboxWithLabel() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
        Accept terms and conditions
      </Label>
    </div>
  );
}
