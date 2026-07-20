import {
  SidebarPrimary,
  SidebarPrimaryContent,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
  SidebarSecondary,
  SidebarSecondaryContent,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
  SidebarSecondaryMenuSubTrigger,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '@constructor-lab/ui-react';
import {
  BriefcaseIcon,
  CloudShieldIcon,
  GaugeIcon,
  LayoutGridIcon,
  MonitorIcon,
  ServerIcon,
} from '@constructor-lab/icons-react/stroke-mono';

export function SidebarNavigationDemo() {
  return (
    <div className="flex h-[520px] overflow-hidden rounded-md border border-border">
      <SidebarPrimary>
        <SidebarPrimaryHeader>
          <span className="text-base font-semibold group-data-[state=collapsed]/sidebar:hidden">
            Acronis
          </span>
        </SidebarPrimaryHeader>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<GaugeIcon />}>
                Dashboard
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem
                href="#"
                icon={<CloudShieldIcon />}
                selected
              >
                Protection
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<BriefcaseIcon />}>
                Clients
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<LayoutGridIcon />}>
                Marketplace
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
      </SidebarPrimary>

      <SidebarSecondary>
        <SidebarSecondaryHeader label="Protection" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>
              Overview
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<MonitorIcon />}
                selected
              >
                Devices
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="#" icon={<ServerIcon />}>
                Workloads
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>
              Policies
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuSub defaultOpen>
                <SidebarSecondaryMenuSubTrigger icon={<CloudShieldIcon />}>
                  Plans
                </SidebarSecondaryMenuSubTrigger>
                <SidebarSecondaryMenuSubContent>
                  <SidebarSecondaryMenuSubItem href="#" selected>
                    Backup
                  </SidebarSecondaryMenuSubItem>
                  <SidebarSecondaryMenuSubItem href="#">
                    Antivirus
                  </SidebarSecondaryMenuSubItem>
                  <SidebarSecondaryMenuSubItem href="#">
                    Patch management
                  </SidebarSecondaryMenuSubItem>
                </SidebarSecondaryMenuSubContent>
              </SidebarSecondaryMenuSub>
              <SidebarSecondaryMenuItem href="#">
                Exclusions
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    </div>
  );
}
