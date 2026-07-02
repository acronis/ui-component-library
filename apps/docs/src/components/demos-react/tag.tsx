'use client';

import { Tag } from '@spec-lab/ui-react';
import { CircleCheckIcon } from '@spec-lab/icons-react/stroke-mono';

export function TagDemo() {
  return (
    <>
      <Tag variant="info">Info</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="critical">Critical</Tag>
      <Tag variant="danger">Danger</Tag>
      <Tag variant="neutral">Neutral</Tag>
      <Tag variant="ai">AI</Tag>
      <Tag variant="success" icon={<CircleCheckIcon />}>
        Protected
      </Tag>
    </>
  );
}
