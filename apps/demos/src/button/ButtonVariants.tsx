import { Button } from '@constructor-lab/ui-react';

export function ButtonVariants() {
  return (
    <div className="button-grid">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="secondary">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost">Link</Button>
    </div>
  );
}
