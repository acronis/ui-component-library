import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Field, FieldControl, FieldError, FieldLabel } from '@spec-lab/ui-react';
import { InputBox } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@spec-lab/ui-react';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Please select a country.'),
  city: z.string().optional(),
});

const countryItems = {
  us: 'United States',
  gb: 'United Kingdom',
  de: 'Germany',
  fr: 'France',
};

export function FormLayoutTwoColumn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Two-column row */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>First name</FieldLabel>
                <FieldControl render={<InputBox placeholder="Jane" {...field} />} />
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>Last name</FieldLabel>
                <FieldControl render={<InputBox placeholder="Doe" {...field} />} />
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        {/* Two-column row */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>Email</FieldLabel>
                <FieldControl
                  render={<InputBox type="email" placeholder="jane@example.com" {...field} />}
                />
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>
                  Phone{' '}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </FieldLabel>
                <FieldControl
                  render={<InputBox type="tel" placeholder="+1 555 000 0000" {...field} />}
                />
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        {/* Two-column row */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="country"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>Country</FieldLabel>
                <Select
                  items={countryItems}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger onBlur={field.onBlur}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="city"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>
                  City{' '}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </FieldLabel>
                <FieldControl render={<InputBox placeholder="San Francisco" {...field} />} />
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
