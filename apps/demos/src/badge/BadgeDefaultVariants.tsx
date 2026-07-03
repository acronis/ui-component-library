import { Badge } from '@spec-lab/ui-react';

export function BadgeDefaultVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge>Default</Badge>
      <Badge variant="neutral">Secondary</Badge>
      <Badge variant="danger">Destructive</Badge>
      <Badge variant="neutral">Outline</Badge>
    </div>
  );
}
