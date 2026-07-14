import { Tag } from '@constructor-lab/ui-react';
import {
  CircleCheckIcon,
  CircleClockIcon,
  CircleSmallIcon,
  CircleTimesIcon,
  CircleWarningIcon,
} from '@constructor-lab/icons-react/stroke-mono';
export function TagStatus() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" icon={<CircleCheckIcon className="h-4 w-4" />}>
        Completed
      </Tag>
      <Tag variant="info" icon={<CircleClockIcon className="h-4 w-4" />}>
        In Progress
      </Tag>
      <Tag variant="warning" icon={<CircleWarningIcon className="h-4 w-4" />}>
        Pending
      </Tag>
      <Tag variant="danger" icon={<CircleTimesIcon className="h-4 w-4" />}>
        Failed
      </Tag>
      <Tag variant="neutral" icon={<CircleSmallIcon className="h-4 w-4" />}>
        Draft
      </Tag>
    </div>
  );
}
