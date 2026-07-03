import { Tag } from '@spec-lab/ui-react';
import { CircleCheckIcon, CircleInfoIcon, CircleSmallIcon, CircleTimesIcon, CircleWarningIcon } from '@spec-lab/icons-react/stroke-mono'
export function TagSmallWithIcons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag
        variant="success"
        size="sm"
        icon={<CircleCheckIcon className="size-3" />}
      >
        Active
      </Tag>
      <Tag variant="info" size="sm" icon={<CircleInfoIcon className="size-3" />}>
        Info
      </Tag>
      <Tag
        variant="warning"
        size="sm"
        icon={<CircleWarningIcon className="size-3" />}
      >
        Warning
      </Tag>
      <Tag
        variant="critical"
        size="sm"
        icon={<CircleWarningIcon className="size-3" />}
      >
        Critical
      </Tag>
      <Tag
        variant="danger"
        size="sm"
        icon={<CircleTimesIcon className="size-3" />}
      >
        Error
      </Tag>
      <Tag
        variant="neutral"
        size="sm"
        icon={<CircleSmallIcon className="size-3" />}
      >
        Neutral
      </Tag>
    </div>
  );
}
