import { useState } from 'react';
import {
  ButtonIcon,
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
  SidebarPrimarySection,
  SidebarSecondary,
  SidebarSecondaryCollapseTrigger,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '@constructor-lab/ui-react';
import {
  BoltIcon,
  BriefcaseIcon,
  BuildingIcon,
  ChartGrowthIcon,
  ChartPieIcon,
  ChevronsLeftIcon,
  CircleHelpIcon,
  CircleUserIcon,
  CoinsIcon,
  CogIcon,
  HeadsetIcon,
  InboxIcon,
  LayoutGridIcon,
  MagnifierIcon,
  MonitorIcon,
  PlusIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@constructor-lab/icons-react/stroke-mono';

// The console navigation group as designed: SidebarPrimary (product rail) paired
// with SidebarSecondary (the section panel for the selected product area).
// Figma `SidebarGroup`, variant `section=Intelligence` — node 5357:36714.
const productNav = [
  { id: 'intelligence', title: 'Intelligence', icon: ChartPieIcon },
  { id: 'assets', title: 'Assets', icon: MonitorIcon },
  { id: 'protection', title: 'Protection', icon: ShieldCheckIcon },
  { id: 'clients', title: 'Clients', icon: BriefcaseIcon },
  { id: 'service-desk', title: 'Service desk', icon: HeadsetIcon },
  { id: 'sales-billing', title: 'Sales and billing', icon: CoinsIcon },
  { id: 'automation', title: 'Automation', icon: BoltIcon },
  { id: 'marketplace', title: 'Marketplace', icon: LayoutGridIcon },
  { id: 'partner-portal', title: 'Partner portal', icon: ChartGrowthIcon },
  { id: 'my-company', title: 'My company', icon: BuildingIcon },
  { id: 'settings', title: 'Settings', icon: CogIcon },
];

const personalNav = [
  { id: 'my-inbox', title: 'My inbox', icon: InboxIcon },
  { id: 'favorites', title: 'Favorites', icon: StarIcon },
  { id: 'profile', title: 'Profile', icon: CircleUserIcon },
];

const dashboards = [
  { id: 'overview', title: 'Overview' },
  { id: 'business-overview', title: 'Business overview' },
  { id: 'sales-marketing', title: 'Sales and marketing' },
  { id: 'm365-licenses', title: 'Microsoft 365 licenses' },
];

// The design collapses this section and hides its list, so the row labels are
// representative rather than specced.
const operations = [
  { id: 'alerts', title: 'Alerts' },
  { id: 'activities', title: 'Activities' },
  { id: 'audit-log', title: 'Audit log' },
];

export function SidebarGroupIntelligence() {
  const [activePage, setActivePage] = useState('overview');

  return (
    // 800px is the design's own SidebarPrimary container height — anything
    // shorter scrolls the product rail and hides the personal section.
    <div className="flex h-[800px] overflow-hidden rounded-lg border">
      <SidebarPrimary aria-label="Products">
        <SidebarPrimaryHeader>
          <span className="flex items-center gap-2">
            <ShieldCheckIcon aria-hidden="true" />
            <span className="text-sm font-semibold group-data-[state=collapsed]/sidebar:hidden">
              Acronis Cyber Platform
            </span>
          </span>
        </SidebarPrimaryHeader>

        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<MagnifierIcon />}>
                Search
                <SidebarPrimaryMenuItemExtras
                  variant="shortcut"
                  shortcut="⌘/"
                />
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>

          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              {productNav.map((item) => (
                <SidebarPrimaryMenuItem
                  key={item.id}
                  href="#"
                  icon={<item.icon />}
                  selected={item.id === 'intelligence'}
                >
                  {item.title}
                </SidebarPrimaryMenuItem>
              ))}
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>

          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              {personalNav.map((item) => (
                <SidebarPrimaryMenuItem
                  key={item.id}
                  href="#"
                  icon={<item.icon />}
                >
                  {item.title}
                </SidebarPrimaryMenuItem>
              ))}
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>

        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
              Help
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryCollapseTrigger icon={<ChevronsLeftIcon />}>
              Collapse menu
            </SidebarPrimaryCollapseTrigger>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>

      <SidebarSecondary aria-label="Intelligence">
        <SidebarSecondaryHeader label="Intelligence" />

        <SidebarSecondaryContent>
          <SidebarSecondarySection expandable defaultOpen>
            <SidebarSecondarySectionLabel
              actions={
                <ButtonIcon aria-label="Add dashboard">
                  <PlusIcon />
                </ButtonIcon>
              }
            >
              Dashboards
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              {dashboards.map((item) => (
                <SidebarSecondaryMenuItem
                  key={item.id}
                  href="#"
                  selected={activePage === item.id}
                  onClick={(event) => {
                    event.preventDefault();
                    setActivePage(item.id);
                  }}
                >
                  {item.title}
                </SidebarSecondaryMenuItem>
              ))}
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>

          <SidebarSecondarySection expandable defaultOpen={false}>
            <SidebarSecondarySectionLabel>
              Operations
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              {operations.map((item) => (
                <SidebarSecondaryMenuItem
                  key={item.id}
                  href="#"
                  selected={activePage === item.id}
                  onClick={(event) => {
                    event.preventDefault();
                    setActivePage(item.id);
                  }}
                >
                  {item.title}
                </SidebarSecondaryMenuItem>
              ))}
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>

          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem
                href="#"
                selected={activePage === 'reports'}
                onClick={(event) => {
                  event.preventDefault();
                  setActivePage('reports');
                }}
              >
                Reports
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>

        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger
              icon={<ChevronsLeftIcon />}
              shortcut="⌘?"
            >
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>

      <div className="flex flex-1 items-center justify-center bg-background p-4">
        <p className="text-sm text-muted-foreground">Main content area</p>
      </div>
    </div>
  );
}
