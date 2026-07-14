import { useState } from 'react';
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  Button,
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Form,
  Grid,
  InputText,
  InputTextArea,
} from '@constructor-lab/ui-react';

export interface FormTwoColumnDemoProps {
  // In shadow-root hosts (docs preview) pass the shadow mount so the
  // Autocomplete popup inherits its styles; omit it in a regular document.
  portalContainer?: HTMLElement | null;
}

const countries = [
  'Australia',
  'Austria',
  'Belgium',
  'Canada',
  'Denmark',
  'France',
  'Germany',
  'Ireland',
  'Netherlands',
  'Sweden',
];

export function FormTwoColumnDemo({
  portalContainer,
}: FormTwoColumnDemoProps = {}) {
  const [saved, setSaved] = useState(false);

  return (
    <Form
      className="w-full max-w-2xl"
      onFormSubmit={() => {
        setSaved(true);
      }}
    >
      {/* Paired fields sit in a container-query grid: two columns when the form
          is wide enough, one column when it isn't. */}
      <Grid container cols={2} gap="md">
        <Field name="firstName">
          <FieldLabel>First name</FieldLabel>
          <FieldControl render={<InputText placeholder="Ada" required />} />
          <FieldError match="valueMissing">Required.</FieldError>
        </Field>
        <Field name="lastName">
          <FieldLabel>Last name</FieldLabel>
          <FieldControl
            render={<InputText placeholder="Lovelace" required />}
          />
          <FieldError match="valueMissing">Required.</FieldError>
        </Field>
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <FieldControl
            render={
              <InputText type="email" placeholder="ada@example.com" required />
            }
          />
          <FieldError match="valueMissing">Required.</FieldError>
          <FieldError match="typeMismatch">Enter a valid email.</FieldError>
        </Field>
        <Field name="phone">
          <FieldLabel>Phone</FieldLabel>
          <FieldControl
            render={<InputText type="tel" placeholder="+1 555 0100" />}
          />
        </Field>
      </Grid>

      {/* Full-width fields stack in the Form's own column. */}
      <Field name="country">
        <FieldLabel>Country</FieldLabel>
        <Autocomplete items={countries}>
          <AutocompleteInput placeholder="Start typing…" clearable />
          <AutocompleteContent portalContainer={portalContainer}>
            <AutocompleteEmpty>
              No match — keep what you typed.
            </AutocompleteEmpty>
            <AutocompleteList>
              {(item: string) => (
                <AutocompleteItem key={item} value={item}>
                  {item}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      </Field>

      <Field name="notes">
        <FieldLabel>Notes</FieldLabel>
        <FieldControl render={<InputTextArea placeholder="Anything else?" />} />
      </Field>

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {saved ? 'Saved ✓' : ''}
        </span>
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
