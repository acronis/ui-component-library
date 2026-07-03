import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Field, FieldControl, FieldError, FieldLabel } from '@spec-lab/ui-react';
import { InputBox, InputTextArea } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@spec-lab/ui-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  subject: z.string().min(5, {
    message: 'Subject must be at least 5 characters.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Please select a priority level.',
  }),
});

const priorityItems = { low: 'Low', medium: 'Medium', high: 'High' };

export function FormContact() {
  const form = useForm<z.infer<typeof formSchema>>({
    // TO-DO.md #3: apps/demos zod 3 schemas vs zod 4 types in @hookform/resolvers — cast bypasses the false-positive
    resolver: zodResolver(formSchema as never),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Name</FieldLabel>
              <FieldControl render={<InputBox placeholder="Your name" {...field} />} />
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Email</FieldLabel>
              <FieldControl
                render={<InputBox type="email" placeholder="your@email.com" {...field} />}
              />
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="priority"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Priority</FieldLabel>
              <Select
                items={priorityItems}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger onBlur={field.onBlur}>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
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
          name="subject"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Subject</FieldLabel>
              <FieldControl
                render={<InputBox placeholder="What is this about?" {...field} />}
              />
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Message</FieldLabel>
              <FieldControl
                render={
                  <InputTextArea
                    placeholder="Your message here..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                }
              />
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Button type="submit">Send message</Button>
      </form>
    </div>
  );
}
