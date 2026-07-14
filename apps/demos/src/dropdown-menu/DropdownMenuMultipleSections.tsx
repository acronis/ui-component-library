import { Button } from '@constructor-lab/ui-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@constructor-lab/ui-react';
import {
  CogIcon,
  EnvelopeIcon,
  MessagesIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { KeyboardIcon } from '../icons/missing-icons';
export function DropdownMenuMultipleSections() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" />}>
        Options
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <EnvelopeIcon className="mr-2 h-4 w-4" />
          <span>Send Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessagesIcon className="mr-2 h-4 w-4" />
          <span>Send Message</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CogIcon className="mr-2 h-4 w-4" />
          <span>Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <KeyboardIcon className="mr-2 h-4 w-4" />
          <span>Shortcuts</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
