import { Tag } from '@spec-lab/ui-react';

export function TagEnvironment() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success">Production</Tag>
      <Tag variant="warning">Staging</Tag>
      <Tag variant="info">Development</Tag>
      <Tag variant="neutral">Testing</Tag>
    </div>
  );
}
