import { Button } from '@spec-lab/ui-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@spec-lab/ui-react';
import { CloudIcon, CogIcon, EnvelopeIcon, UserIcon } from '@spec-lab/icons-react/stroke-mono'
export function DropdownMenuDisabled() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <CogIcon className="mr-2 h-4 w-4" />
          <span>Settings (Coming Soon)</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <EnvelopeIcon className="mr-2 h-4 w-4" />
          <span>Contact</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <CloudIcon className="mr-2 h-4 w-4" />
          <span>Cloud Storage (Unavailable)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
