import { Chip } from '@spec-lab/ui-react';
import { CircleCheckIcon, EnvelopeIcon, StarIcon, UserIcon } from '@spec-lab/icons-react/stroke-mono'
import { HeartIcon, TagIcon } from '../icons/missing-icons';
export function ChipWithIcons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip icon={<UserIcon className="h-4 w-4" />}>User</Chip>
      <Chip icon={<EnvelopeIcon className="h-4 w-4" />}>Email</Chip>
      <Chip icon={<TagIcon className="h-4 w-4" />}>Tag</Chip>
      <Chip icon={<StarIcon className="h-4 w-4" />}>Favorite</Chip>
      <Chip icon={<HeartIcon className="h-4 w-4" />}>Like</Chip>
      <Chip icon={<CircleCheckIcon className="h-4 w-4" />}>Verified</Chip>
    </div>
  );
}
