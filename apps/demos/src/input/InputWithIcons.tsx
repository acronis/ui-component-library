import { Input } from '@spec-lab/ui-react';
import { EnvelopeIcon, LockIcon, MagnifierIcon } from '@spec-lab/icons-react/stroke-mono'
export function InputWithIcons() {
  return (
    <div className="space-y-4">
      <div className="relative">
        <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input className="pl-10" type="email" placeholder="Email" />
      </div>
      <div className="relative">
        <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input className="pl-10" type="password" placeholder="Password" />
      </div>
      <div className="relative">
        <MagnifierIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input className="pl-10" type="search" placeholder="Search..." />
      </div>
    </div>
  );
}
