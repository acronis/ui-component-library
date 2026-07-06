import { Button } from '@spec-lab/ui-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@spec-lab/ui-react';
import { CogIcon, UserIcon } from '@spec-lab/icons-react/stroke-mono';
import { CreditCardIcon, KeyboardIcon } from '../icons/missing-icons';
export function DropdownMenuWithLabels() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" />}>
        Account
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<UserIcon />} shortcut="⇧⌘P">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem icon={<CreditCardIcon />} shortcut="⌘B">
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem icon={<CogIcon />} shortcut="⌘S">
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem icon={<KeyboardIcon />} shortcut="⌘K">
          Keyboard shortcuts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
