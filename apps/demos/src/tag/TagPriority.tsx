import { Tag } from '@constructor-lab/ui-react';
import { CircleWarningIcon } from '@constructor-lab/icons-react/stroke-mono';
import { TrendingDownIcon, TrendingUpIcon } from '../icons/missing-icons';
export function TagPriority() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="danger" icon={<TrendingUpIcon className="h-4 w-4" />}>
        Urgent
      </Tag>
      <Tag variant="critical" icon={<CircleWarningIcon className="h-4 w-4" />}>
        High
      </Tag>
      <Tag variant="warning" icon={<CircleWarningIcon className="h-4 w-4" />}>
        Medium
      </Tag>
      <Tag variant="info" icon={<TrendingDownIcon className="h-4 w-4" />}>
        Low
      </Tag>
    </div>
  );
}
