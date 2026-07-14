import { useState } from 'react';
import {
  SidebarPrimary,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
  SidebarPrimarySection,
  SidebarSecondary,
  SidebarSecondaryContent,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuItemExtras,
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
  SidebarSecondaryMenuSubTrigger,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
  Tag,
} from '@constructor-lab/ui-react';
import {
  CalendarIcon,
  CircleHelpIcon,
  CogIcon,
  FileTextIcon,
  FolderHouseIcon,
  InboxIcon,
  MagnifierIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { BarChartIcon } from '../icons/missing-icons';

// The Constructor Lab nav is genuinely two-tier: an icon rail (SidebarPrimary)
// paired with a labeled panel (SidebarSecondary) that carries the grouped,
// sub-item-bearing navigation the rail alone can't express (no section labels
// or disclosures on Primary — see sidebar-primary.tsx).
export function SidebarFull() {
  const [activeItem, setActiveItem] = useState('home');

  const mainNavItems = [
    { id: 'home', title: 'Home', icon: FolderHouseIcon },
    { id: 'inbox', title: 'Inbox', icon: InboxIcon, badge: '7' },
    { id: 'calendar', title: 'Calendar', icon: CalendarIcon },
    { id: 'search', title: 'Search', icon: MagnifierIcon },
    { id: 'settings', title: 'Settings', icon: CogIcon },
  ];

  const projectNavItems = [
    {
      id: 'projects',
      title: 'Projects',
      icon: FileTextIcon,
      subItems: [
        { id: 'project-1', title: 'Project Alpha' },
        { id: 'project-2', title: 'Project Beta' },
        { id: 'project-3', title: 'Project Gamma' },
      ],
    },
    {
      id: 'team',
      title: 'Team',
      icon: UsersIcon,
      subItems: [
        { id: 'team-members', title: 'Members' },
        { id: 'team-roles', title: 'Roles' },
        { id: 'team-permissions', title: 'Permissions' },
      ],
    },
  ];

  const analyticsNavItems = [
    { id: 'analytics', title: 'Analytics', icon: BarChartIcon },
    { id: 'reports', title: 'Reports', icon: FileTextIcon },
    { id: 'security', title: 'Security', icon: ShieldCheckIcon, tag: 'NEW' },
  ];

  const activeTitle =
    mainNavItems.find((item) => item.id === activeItem)?.title ??
    projectNavItems
      .flatMap((item) => item.subItems)
      .find((item) => item.id === activeItem)?.title ??
    projectNavItems.find((item) => item.id === activeItem)?.title ??
    analyticsNavItems.find((item) => item.id === activeItem)?.title ??
    'Dashboard';

  return (
    <div className="flex h-[600px] overflow-hidden rounded-lg border">
      <SidebarPrimary>
        <SidebarPrimaryHeader>
          <span className="flex items-center gap-2">
            <FolderHouseIcon aria-hidden="true" />
            <span className="text-sm font-semibold group-data-[state=collapsed]/sidebar:hidden">
              Constructor Lab
            </span>
          </span>
        </SidebarPrimaryHeader>

        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              {mainNavItems.map((item) => (
                <SidebarPrimaryMenuItem
                  key={item.id}
                  href="#"
                  icon={<item.icon />}
                  selected={activeItem === item.id}
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveItem(item.id);
                  }}
                >
                  {item.title}
                  {item.badge && (
                    <SidebarPrimaryMenuItemExtras
                      variant="tag"
                      tag={
                        <Tag variant="neutral" size="sm">
                          {item.badge}
                        </Tag>
                      }
                    />
                  )}
                </SidebarPrimaryMenuItem>
              ))}
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>

        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<UserIcon />}>
              Account
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
              Help & Support
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>

      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>
              Workspace
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              {projectNavItems.map((item) => (
                <SidebarSecondaryMenuSub key={item.id} defaultOpen>
                  <SidebarSecondaryMenuSubTrigger
                    icon={<item.icon />}
                    selected={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                  >
                    {item.title}
                  </SidebarSecondaryMenuSubTrigger>
                  <SidebarSecondaryMenuSubContent>
                    {item.subItems.map((subItem) => (
                      <SidebarSecondaryMenuSubItem
                        key={subItem.id}
                        href="#"
                        selected={activeItem === subItem.id}
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveItem(subItem.id);
                        }}
                      >
                        {subItem.title}
                      </SidebarSecondaryMenuSubItem>
                    ))}
                  </SidebarSecondaryMenuSubContent>
                </SidebarSecondaryMenuSub>
              ))}
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>

          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>
              Insights
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              {analyticsNavItems.map((item) => (
                <SidebarSecondaryMenuItem
                  key={item.id}
                  href="#"
                  icon={<item.icon />}
                  selected={activeItem === item.id}
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveItem(item.id);
                  }}
                >
                  {item.title}
                  {item.tag && (
                    <SidebarSecondaryMenuItemExtras
                      variant="tag"
                      tag={
                        <Tag variant="info" size="sm">
                          {item.tag}
                        </Tag>
                      }
                    />
                  )}
                </SidebarSecondaryMenuItem>
              ))}
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{activeTitle}</h1>
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="h-[200px] rounded-xl bg-muted/50" />
        </div>
      </div>
    </div>
  );
}
