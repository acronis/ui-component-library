import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormLayout,
  type FormLayoutField,
} from '@constructor-lab/ui-react';
import { dataRowSchema } from '../../lib/validators';
import type { DataRowFormData } from '../../lib/validators';

interface NewRowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DataRowFormData) => Promise<void>;
  initialData?: Partial<DataRowFormData>;
  mode?: 'create' | 'edit';
}

const FIELDS: FormLayoutField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter name',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    placeholder: 'Select status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    name: 'category',
    label: 'Category',
    type: 'text',
    required: true,
    placeholder: 'Enter category',
  },
  { name: 'value', label: 'Value', type: 'number', required: true, min: 0 },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description (optional)',
  },
];

const defaultValues = (
  initialData?: Partial<DataRowFormData>
): Record<string, unknown> => ({
  name: initialData?.name ?? '',
  status: initialData?.status ?? 'active',
  category: initialData?.category ?? '',
  value: initialData?.value ?? 0,
  description: initialData?.description ?? '',
});

// The create/edit form — the `form-dialog` pattern: the config-driven
// `FormLayout` composite inside a `Dialog`. FormLayout maps the flat field
// descriptors onto the right controls and drives them through one controlled
// `onValueChange`; we validate on submit with the shared `dataRowSchema`.
export function NewRowDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = 'create',
}: NewRowDialogProps) {
  const [values, setValues] = React.useState<Record<string, unknown>>(() =>
    defaultValues(initialData)
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      setValues(defaultValues(initialData));
      setErrors({});
    }
  }, [open, initialData]);

  const handleValueChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (nextValues: Record<string, unknown>) => {
    const result = dataRowSchema.safeParse(nextValues);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    void (async () => {
      await onSubmit(result.data);
      onOpenChange(false);
    })();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Row' : 'Edit Row'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new data row to the table.'
              : 'Update the data row information.'}
          </DialogDescription>
        </DialogHeader>
        <FormLayout
          fields={FIELDS}
          values={values}
          onValueChange={handleValueChange}
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel={mode === 'create' ? 'Create' : 'Save Changes'}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
