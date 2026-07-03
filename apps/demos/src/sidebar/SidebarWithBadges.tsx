import {
  SidebarPrimary,
  SidebarPrimaryContent,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
  SidebarPrimarySection,
  Tag,
} from '@spec-lab/ui-react';
import { CalendarIcon, FileTextIcon, FolderHouseIcon, InboxIcon } from '@spec-lab/icons-react/stroke-mono'

export function SidebarWithBadges() {
  return (
    <div className="flex h-[400px] overflow-hidden rounded-lg border">
      <SidebarPrimary>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<FolderHouseIcon />}>
                Dashboard
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<InboxIcon />}>
                Messages
                <SidebarPrimaryMenuItemExtras
                  variant="tag"
                  tag={
                    <Tag variant="neutral" size="sm">
                      12
                    </Tag>
                  }
                />
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<CalendarIcon />}>
                Events
                <SidebarPrimaryMenuItemExtras
                  variant="tag"
                  tag={
                    <Tag variant="neutral" size="sm">
                      3
                    </Tag>
                  }
                />
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<FileTextIcon />}>
                Documents
                <SidebarPrimaryMenuItemExtras
                  variant="tag"
                  tag={
                    <Tag variant="info" size="sm">
                      NEW
                    </Tag>
                  }
                />
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
      </SidebarPrimary>
      <div className="flex flex-1 items-center justify-center bg-background p-4">
        <p className="text-sm text-muted-foreground">Main content area</p>
      </div>
    </div>
  );
}
