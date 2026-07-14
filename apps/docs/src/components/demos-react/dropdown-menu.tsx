'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@constructor-lab/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function DropdownMenuDemo() {
  const mount = useShadowMount();
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger
        render={<Button variant="secondary">Open menu</Button>}
      />
      <DropdownMenuContent portalContainer={mount} className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem shortcut="⇧⌘P">Profile</DropdownMenuItem>
        <DropdownMenuItem shortcut="⌘S">Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
