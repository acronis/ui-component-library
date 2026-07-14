import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Field,
  FieldDescription,
  FieldLabel,
} from '@constructor-lab/ui-react';

type Option = { value: string; label: string };

const frameworks: Option[] = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
];

const languages: Option[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
];

export function ComboboxForm() {
  return (
    <div className="max-w-md space-y-4 rounded-lg border p-6">
      <Combobox items={frameworks}>
        <Field>
          <FieldLabel>Framework</FieldLabel>
          <ComboboxInput placeholder="Select framework..." clearable />
          <FieldDescription>
            Choose the framework you want to use for your project.
          </FieldDescription>
        </Field>
        <ComboboxContent>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(framework: Option) => (
              <ComboboxItem key={framework.value} value={framework}>
                {framework.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Combobox items={languages}>
        <Field>
          <FieldLabel>Programming Language</FieldLabel>
          <ComboboxInput placeholder="Select language..." clearable />
          <FieldDescription>
            Select your preferred programming language.
          </FieldDescription>
        </Field>
        <ComboboxContent>
          <ComboboxEmpty>No language found.</ComboboxEmpty>
          <ComboboxList>
            {(lang: Option) => (
              <ComboboxItem key={lang.value} value={lang}>
                {lang.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
