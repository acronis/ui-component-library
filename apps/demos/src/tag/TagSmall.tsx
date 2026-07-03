import { Tag } from '@spec-lab/ui-react';

export function TagSmall() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" size="sm">
        Success
      </Tag>
      <Tag variant="info" size="sm">
        Info
      </Tag>
      <Tag variant="warning" size="sm">
        Warning
      </Tag>
      <Tag variant="critical" size="sm">
        Critical
      </Tag>
      <Tag variant="danger" size="sm">
        Danger
      </Tag>
      <Tag variant="neutral" size="sm">
        Neutral
      </Tag>
    </div>
  );
}
