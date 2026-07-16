import type { ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The runtime props
// reference the `FormLayoutField[]` descriptor + an indexed portal type that
// AutoTypeTable can't render cleanly; this companion documents the caller-facing
// shape. (The runtime types live in form-layout.tsx; this file is never bundled.)

/** Props for `FormLayout`. See `FormLayoutField` for the field descriptor. */
export interface FormLayoutProps {
  /** The fields, in order. Each descriptor's `type` selects the control. */
  fields: unknown[];
  /** Current values, keyed by field name. */
  values: Record<string, unknown>;
  /** Called with the changed field's name and next value (one handler for all controls). */
  onValueChange: (name: string, value: unknown) => void;
  /** Called with the full values object on submit. */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** Per-field error messages, keyed by field name. */
  errors?: Record<string, string>;
  /** Column count. `2` uses a responsive grid that collapses to one column (default 1). */
  columns?: 1 | 2;
  /** Disable the whole form. */
  disabled?: boolean;
  /** Submit button label (default "Save"). */
  submitLabel?: ReactNode;
  /** Cancel button label (shown only when `onCancel` is set). */
  cancelLabel?: ReactNode;
  /** Called when the cancel button is activated; its presence renders the cancel button. */
  onCancel?: () => void;
  /** Portal container for popup controls (Select). Pass a shadow-root mount. */
  portalContainer?: HTMLElement | null;
}

/** A single field descriptor for `FormLayout.fields`. */
export interface FormLayoutField {
  /** Key into `values` / the submitted object. */
  name: string;
  /** Visible label. */
  label: string;
  /** Control to render (default "text"). */
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'textarea'
    | 'select'
    | 'number'
    | 'checkbox'
    | 'switch'
    | 'radio';
  /** Helper text under the control. */
  description?: ReactNode;
  /** Placeholder for text-like controls. */
  placeholder?: string;
  /** Mark required (adds a marker + native `required`). */
  required?: boolean;
  /** Disable just this field. */
  disabled?: boolean;
  /** Options for `select` / `radio`. */
  options?: { value: string; label: string }[];
  /** Bounds for `number`. */
  min?: number;
  max?: number;
  step?: number;
  /** Span the full row in a multi-column layout (default true for `textarea`). */
  fullWidth?: boolean;
}
