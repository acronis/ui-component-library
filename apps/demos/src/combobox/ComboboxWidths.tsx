import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@spec-lab/ui-react';

type Option = { value: string; label: string };

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

const countries: Option[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
];

export function ComboboxWidths() {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-[200px]">
        <Combobox items={languages}>
          <ComboboxInput placeholder="Select language..." clearable />
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

      <div className="w-[320px]">
        <Combobox items={countries}>
          <ComboboxInput placeholder="Select country..." clearable />
          <ComboboxContent>
            <ComboboxEmpty>No country found.</ComboboxEmpty>
            <ComboboxList>
              {(country: Option) => (
                <ComboboxItem key={country.value} value={country}>
                  {country.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
}
