import { Tag } from '@constructor-lab/ui-react';

export function TagVersion() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" size="sm">
        v2.0
      </Tag>
      <Tag variant="info" size="sm">
        v1.5
      </Tag>
      <Tag variant="neutral" size="sm">
        v1.0
      </Tag>
      <Tag variant="warning" size="sm">
        Deprecated
      </Tag>
    </div>
  );
}
