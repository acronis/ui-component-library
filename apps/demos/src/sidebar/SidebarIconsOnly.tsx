import {
  SidebarPrimary,
  SidebarPrimaryContent,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
} from '@spec-lab/ui-react';
import { CalendarIcon, CogIcon, FolderHouseIcon, InboxIcon } from '@spec-lab/icons-react/stroke-mono'

// The rail's collapsed state IS icon-only mode: `expanded={false}` keeps every
// row's label in the DOM as `sr-only` (accessible name) while visually showing
// just the icon — no separate "icon-only" variant needed.
export function SidebarIconsOnly() {
  return (
    <div className="flex h-[400px] overflow-hidden rounded-lg border">
      <SidebarPrimary expanded={false}>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<FolderHouseIcon />}>
                Home
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<InboxIcon />}>
                Inbox
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<CalendarIcon />}>
                Calendar
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<CogIcon />}>
                Settings
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
      </SidebarPrimary>
      <div className="flex flex-1 items-center justify-center bg-background p-4">
        <p className="text-sm text-muted-foreground">
          Icon-only sidebar view
        </p>
      </div>
    </div>
  );
}
