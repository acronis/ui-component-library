import {
  SidebarSecondary,
  SidebarSecondaryContent,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '@constructor-lab/ui-react';
import {
  CogIcon,
  FolderHouseIcon,
  MagnifierIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { BarChartIcon } from '../icons/missing-icons';

// Labeled section groups have no equivalent on SidebarPrimary (the icon rail
// has no section-label part) — SidebarSecondary is the ui-react part that
// actually models "grouped, labeled navigation".
export function SidebarWithSections() {
  return (
    <div className="flex h-[400px] overflow-hidden rounded-lg border">
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>Main</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<FolderHouseIcon />}
                selected
              >
                Dashboard
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<MagnifierIcon />}>
                Search
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>

          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>Tools</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" icon={<BarChartIcon />}>
                Analytics
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<CogIcon />}>
                Settings
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
      <div className="flex flex-1 items-center justify-center bg-background p-4">
        <p className="text-sm text-muted-foreground">Content with sections</p>
      </div>
    </div>
  );
}
