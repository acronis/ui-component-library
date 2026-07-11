import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Field, FieldError, FieldLabel } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import { Checkbox } from '@spec-lab/ui-react';
import { Label } from '@spec-lab/ui-react';
import { RadioGroup, Radio } from '@spec-lab/ui-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@spec-lab/ui-react';

const formSchema = z.object({
  notifications: z.boolean(),
  marketing: z.boolean(),
  security: z.boolean(),
  language: z.string({
    message: 'Please select a language.',
  }),
  theme: z.enum(['light', 'dark', 'system'], {
    message: 'Please select a theme.',
  }),
});

const languageItems = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
};

export function FormSettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notifications: true,
      marketing: false,
      security: true,
      theme: 'system',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <div className="w-full max-w-md rounded-lg border p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium mb-3">Email Notifications</h4>
          <Controller
            control={form.control}
            name="notifications"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                label="Receive email notifications"
                description="Get notified about important updates"
              />
            )}
          />
          <Controller
            control={form.control}
            name="marketing"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                label="Marketing emails"
                description="Receive emails about new products and features"
              />
            )}
          />
          <Controller
            control={form.control}
            name="security"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                label="Security alerts"
                description="Get notified about security updates"
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="language"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Language</FieldLabel>
              <Select
                items={languageItems}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger onBlur={field.onBlur}>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
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
          name="theme"
          render={({ field, fieldState }) => (
            <div className="space-y-3">
              <Label>Theme</Label>
              {/* Individually-labeled Radios (per radio.test.tsx): a group-level
                  Field would broadcast its own aria-labelledby to every Radio it
                  contains, so each option needs its own id/Label pair instead. */}
              <RadioGroup
                aria-label="Theme"
                value={field.value}
                onValueChange={field.onChange}
                className="gap-1"
              >
                <div className="flex items-center gap-3">
                  <Radio value="light" id="theme-light" />
                  <Label htmlFor="theme-light" className="font-normal">
                    Light
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Radio value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="font-normal">
                    Dark
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Radio value="system" id="theme-system" />
                  <Label htmlFor="theme-system" className="font-normal">
                    System
                  </Label>
                </div>
              </RadioGroup>
              {fieldState.error && (
                <p className="text-sm text-[var(--ui-text-on-status-danger)]">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Button type="submit" className="w-full">
          Save settings
        </Button>
      </form>
    </div>
  );
}
