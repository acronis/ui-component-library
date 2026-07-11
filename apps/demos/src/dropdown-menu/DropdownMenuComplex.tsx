import { useState } from 'react';
import { Button } from '@spec-lab/ui-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@spec-lab/ui-react';
import {
  ChevronDownIcon,
  CloudIcon,
  EnvelopeIcon,
  MessagesIcon,
  UserIcon,
} from '@spec-lab/icons-react/stroke-mono';
import {
  CreditCardIcon,
  ExternalLinkIcon,
  LifeBuoyIcon,
  LogOutIcon,
  PlusCircleIcon,
  UserPlusIcon,
} from '../icons/missing-icons';
export function DropdownMenuComplex() {
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showActivityBar, setShowActivityBar] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" />}>
        Advanced Menu
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<UserIcon />} shortcut="⇧⌘P">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem icon={<CreditCardIcon />} shortcut="⌘B">
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
        >
          Activity Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<UserPlusIcon />}>
            Invite Team
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem icon={<EnvelopeIcon />}>
              By Email
            </DropdownMenuItem>
            <DropdownMenuItem icon={<MessagesIcon />}>
              By Message
            </DropdownMenuItem>
            <DropdownMenuItem icon={<PlusCircleIcon />}>
              More Options
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<ExternalLinkIcon />}>GitHub</DropdownMenuItem>
        <DropdownMenuItem icon={<LifeBuoyIcon />}>Support</DropdownMenuItem>
        <DropdownMenuItem icon={<CloudIcon />} disabled>
          API (Coming Soon)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<LogOutIcon />} shortcut="⇧⌘Q">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
