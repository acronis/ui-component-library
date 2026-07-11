import { Tag } from '@spec-lab/ui-react';
import {
  CircleCheckIcon,
  CircleClockIcon,
} from '@spec-lab/icons-react/stroke-mono';
export function TagMixedSizes() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold">Project Alpha</h4>
          <Tag variant="success" icon={<CircleCheckIcon className="h-4 w-4" />}>
            Active
          </Tag>
        </div>
        <p className="mb-3 text-sm text-gray-600">
          A high-priority project with multiple components.
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag variant="danger" size="sm">
            Urgent
          </Tag>
          <Tag variant="info" size="sm">
            Frontend
          </Tag>
          <Tag variant="success" size="sm">
            Backend
          </Tag>
          <Tag variant="warning" size="sm">
            v2.0
          </Tag>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold">Project Beta</h4>
          <Tag variant="warning" icon={<CircleClockIcon className="h-4 w-4" />}>
            In Progress
          </Tag>
        </div>
        <p className="mb-3 text-sm text-gray-600">
          A medium-priority project in development phase.
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag variant="info" size="sm">
            Medium
          </Tag>
          <Tag variant="neutral" size="sm">
            Design
          </Tag>
          <Tag variant="info" size="sm">
            Development
          </Tag>
          <Tag variant="warning" size="sm">
            Beta
          </Tag>
        </div>
      </div>
    </div>
  );
}
