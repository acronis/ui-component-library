import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@spec-lab/shadcn-uikit/react';
import { CalendarIcon, CogIcon, FolderHouseIcon, InboxIcon } from '@spec-lab/icons-react/stroke-mono'
export function SidebarIconsOnly() {
  return (
    <div className="h-[400px] border rounded-lg overflow-hidden flex">
      <SidebarProvider defaultOpen={true}>
        <Sidebar collapsible="none" className="w-16">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Home"
                      className="justify-center"
                    >
                      <FolderHouseIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Inbox"
                      className="justify-center"
                    >
                      <InboxIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Calendar"
                      className="justify-center"
                    >
                      <CalendarIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Settings"
                      className="justify-center"
                    >
                      <CogIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex items-center justify-center p-4 bg-background">
          <p className="text-sm text-muted-foreground">
            Icon-only sidebar view
          </p>
        </div>
      </SidebarProvider>
    </div>
  );
}
