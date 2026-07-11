import {
  Button,
  InputText,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@spec-lab/ui-react';

// ui-react's `InputText` is a full field wrapper (its own <div>; `className`
// lands on the inner <input>, not the wrapper), so a bare `col-span-2` on the
// component itself has no effect on the grid layout below. Wrap it in a div
// that carries the grid placement instead, and keep the row label as a
// standalone `Label` (rather than InputText's own `label` prop) so it stays
// in its own grid column.
const fields = [
  { id: 'width', label: 'Width', defaultValue: '100%' },
  { id: 'maxWidth', label: 'Max. width', defaultValue: '300px' },
  { id: 'height', label: 'Height', defaultValue: '25px' },
  { id: 'maxHeight', label: 'Max. height', defaultValue: 'none' },
];

export function PopoverWithForm() {
  return (
    <div className="flex justify-center rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Settings
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              {fields.map(({ id, label, defaultValue }) => (
                <div key={id} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={id}>{label}</Label>
                  <div className="col-span-2">
                    <InputText
                      id={id}
                      defaultValue={defaultValue}
                      className="h-8"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
