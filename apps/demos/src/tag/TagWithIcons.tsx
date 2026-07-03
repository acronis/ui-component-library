import { Tag } from '@spec-lab/ui-react';
import { CircleCheckIcon, CircleInfoIcon, CircleSmallIcon, CircleTimesIcon, CircleWarningIcon } from '@spec-lab/icons-react/stroke-mono'
export function TagWithIcons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" icon={<CircleCheckIcon className="h-4 w-4" />}>
        Active
      </Tag>
      <Tag variant="info" icon={<CircleInfoIcon className="h-4 w-4" />}>
        Info
      </Tag>
      <Tag variant="warning" icon={<CircleWarningIcon className="h-4 w-4" />}>
        Warning
      </Tag>
      <Tag
        variant="critical"
        icon={<CircleWarningIcon className="h-4 w-4" />}
      >
        Critical
      </Tag>
      <Tag variant="danger" icon={<CircleTimesIcon className="h-4 w-4" />}>
        Error
      </Tag>
      <Tag variant="neutral" icon={<CircleSmallIcon className="h-4 w-4" />}>
        Neutral
      </Tag>
    </div>
  );
}
