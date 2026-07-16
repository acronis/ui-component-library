import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Field, FieldControl, FieldDescription, FieldLabel } from '../field';
import { Form } from '../form';
import { Grid } from '../grid';
import { InputBox } from '../input';
import { InputTextArea } from '../input-text-area';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '../number-field';
import { Radio, RadioGroup } from '../radio';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Switch } from '../switch';

// PROTOTYPE (see context/opinionated-composites-proposal.md, Tier 1).
//
// FormLayout is the config-driven form composite: `<FormLayout fields={…} />`.
// It maps a flat field-descriptor list onto the right ui-react control, wiring
// each control's *differing* change convention (native onChange /
// onValueChange / onCheckedChange) behind one uniform `onValueChange(name,
// value)`, and lays the fields out with the shared Form rhythm (or a responsive
// Grid for `columns={2}`) — so every form reads the same way. Built on Form /
// Field / Grid and the bare controls; compose those directly for anything the
// descriptor can't express.

export type FormLayoutFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'number'
  | 'checkbox'
  | 'switch'
  | 'radio';

export interface FormLayoutOption {
  value: string;
  label: string;
}

export interface FormLayoutField {
  /** Key into `values` / the submitted object. */
  name: string;
  /** Visible label. */
  label: string;
  /** Which control to render. Defaults to `text`. */
  type?: FormLayoutFieldType;
  /** Helper text under the control. */
  description?: ReactNode;
  /** Placeholder for text-like controls. */
  placeholder?: string;
  /** Mark required (adds a marker + native `required`). */
  required?: boolean;
  /** Disable just this field. */
  disabled?: boolean;
  /** Options for `select` / `radio`. */
  options?: FormLayoutOption[];
  /** Bounds for `number`. */
  min?: number;
  max?: number;
  step?: number;
  /** Span the full row in a multi-column layout (default true for `textarea`). */
  fullWidth?: boolean;
}

export interface FormLayoutProps {
  /** The form's fields, in order. */
  fields: FormLayoutField[];
  /** Current values, keyed by field name. */
  values: Record<string, unknown>;
  /** Called with the changed field's name and its next value. */
  onValueChange: (name: string, value: unknown) => void;
  /** Called with the full values object on submit. */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** Per-field error messages, keyed by field name. */
  errors?: Record<string, string>;
  /** Column count. `2` uses a responsive grid that collapses to one column. */
  columns?: 1 | 2;
  /** Disable the whole form. */
  disabled?: boolean;
  /** Submit button label. */
  submitLabel?: ReactNode;
  /** Cancel button label. Renders a cancel button only when `onCancel` is set. */
  cancelLabel?: ReactNode;
  /** Called when the cancel button is activated. */
  onCancel?: () => void;
  /** Portal container for popup controls (Select). Pass a shadow-root mount. */
  portalContainer?: HTMLElement | null;
  className?: string;
}

function ErrorText({ children }: { children: ReactNode }) {
  // Controlled error, shown as a plain message (not tied to native validity).
  return (
    <p className="text-sm text-[var(--ui-text-on-status-danger)]">{children}</p>
  );
}

export function FormLayout({
  fields,
  values,
  onValueChange,
  onSubmit,
  errors,
  columns = 1,
  disabled = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  portalContainer,
  className,
}: FormLayoutProps) {
  const renderField = (field: FormLayoutField) => {
    const {
      name,
      label,
      type = 'text',
      description,
      placeholder,
      required,
      options,
      min,
      max,
      step,
    } = field;
    const fieldDisabled = disabled || field.disabled;
    const error = errors?.[name];
    const value = values[name];

    // Checkbox / Switch carry their own label, so they don't use Field furniture.
    if (type === 'checkbox') {
      return (
        <Checkbox
          name={name}
          label={label}
          description={description}
          checked={Boolean(value)}
          onCheckedChange={(checked) => onValueChange(name, checked)}
          disabled={fieldDisabled}
        />
      );
    }
    if (type === 'switch') {
      return (
        <Switch
          label={label}
          checked={Boolean(value)}
          onCheckedChange={(checked) => onValueChange(name, checked)}
          disabled={fieldDisabled}
        />
      );
    }

    let control: ReactNode;
    switch (type) {
      case 'textarea':
        control = (
          <FieldControl
            render={
              <InputTextArea
                value={String(value ?? '')}
                onChange={(event) => onValueChange(name, event.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={fieldDisabled}
              />
            }
          />
        );
        break;
      case 'select':
        control = (
          <Select
            value={value == null ? undefined : String(value)}
            onValueChange={(next) => onValueChange(name, next)}
            disabled={fieldDisabled}
          >
            <SelectTrigger aria-label={label}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent portalContainer={portalContainer}>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;
      case 'number':
        control = (
          <NumberField
            value={typeof value === 'number' ? value : null}
            onValueChange={(next) => onValueChange(name, next)}
            min={min}
            max={max}
            step={step}
            disabled={fieldDisabled}
          >
            <NumberFieldGroup>
              <NumberFieldDecrement />
              <NumberFieldInput placeholder={placeholder} />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
        );
        break;
      case 'radio':
        control = (
          <RadioGroup
            value={value == null ? undefined : String(value)}
            onValueChange={(next) => onValueChange(name, next)}
            disabled={fieldDisabled}
          >
            {options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm"
              >
                <Radio value={option.value} />
                {option.label}
              </label>
            ))}
          </RadioGroup>
        );
        break;
      default:
        control = (
          <FieldControl
            render={
              <InputBox
                type={type === 'text' ? undefined : type}
                value={String(value ?? '')}
                onChange={(event) => onValueChange(name, event.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={fieldDisabled}
              />
            }
          />
        );
    }

    return (
      <Field name={name} invalid={Boolean(error)} disabled={fieldDisabled}>
        <FieldLabel>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </FieldLabel>
        {control}
        {description && !error ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
        {error ? <ErrorText>{error}</ErrorText> : null}
      </Field>
    );
  };

  const items = fields.map((field) => {
    const fullWidth = field.fullWidth ?? field.type === 'textarea';
    return (
      <div key={field.name} className={cn(fullWidth && 'col-span-full')}>
        {renderField(field)}
      </div>
    );
  });

  return (
    <Form className={className} onFormSubmit={() => onSubmit?.(values)}>
      {columns === 2 ? (
        <Grid container cols={2} gap="md">
          {items}
        </Grid>
      ) : (
        items
      )}
      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={disabled}
          >
            {cancelLabel}
          </Button>
        ) : null}
        <Button type="submit" disabled={disabled}>
          {submitLabel}
        </Button>
      </div>
    </Form>
  );
}
