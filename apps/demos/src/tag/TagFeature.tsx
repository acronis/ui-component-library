import { Tag } from '@constructor-lab/ui-react';
import { StarIcon } from '@constructor-lab/icons-react/stroke-mono';
import { ZapIcon } from '../icons/missing-icons';
export function TagFeature() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" icon={<StarIcon className="h-4 w-4" />}>
        Premium
      </Tag>
      <Tag variant="info" icon={<ZapIcon className="h-4 w-4" />}>
        Fast
      </Tag>
      <Tag variant="warning" size="sm">
        Beta
      </Tag>
      <Tag variant="neutral" size="sm">
        Legacy
      </Tag>
    </div>
  );
}
