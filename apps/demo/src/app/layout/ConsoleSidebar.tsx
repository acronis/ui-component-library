import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BoxIcon,
  ChevronLeftIcon,
  ChevronsLeftIcon,
  CircleHelpIcon,
  CogIcon,
  LayoutGridIcon,
  LayoutIcon,
  LayoutTableIcon,
  MessageIcon,
  MonitorIcon,
  PuzzleIcon,
  ServerIcon,
} from '@spec-lab/icons-react/stroke-mono';
import { AcronisIcon } from '@spec-lab/icons-react/solid-mono';
import {
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
  SidebarSecondary,
  SidebarSecondaryCollapseTrigger,
  SidebarSecondaryCollapsedBreadcrumb,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '@spec-lab/ui-react';
import { useLocale } from '../context/LocaleContext';

// The routed sections live at root paths inside the demo (no /console nesting):
// `/dashboard`, `/data`, `/chat`, `/settings`. The primary rail is the collapsed
// icon rail of top-level areas; the secondary panel is the expanded section nav —
// both mirror the AppShell "WithSecondary" story (the protection-dashboard
// realization) and drive React Router navigation via each menu item's `render`
// (Base UI composition) with a `<Link>`.

interface NavItem {
  /** The last path segment used for selection. */
  section: string;
  /** Relative link target; defaults to `section` when the link is a single segment. */
  to?: string;
  /** i18n key for the label; when absent, `label` is used verbatim. */
  labelKey?: string;
  /** Static label (for entries with no i18n string, e.g. the catalog). */
  label?: string;
  icon: React.ReactNode;
}

const primaryItems: NavItem[] = [
  { section: 'dashboard', labelKey: 'navigation.dashboard', icon: <MonitorIcon /> },
  { section: 'data', labelKey: 'navigation.data', icon: <LayoutTableIcon /> },
  { section: 'chat', labelKey: 'navigation.chat', icon: <MessageIcon /> },
  { section: 'settings', labelKey: 'navigation.settings', icon: <CogIcon /> },
];

const overviewItems: NavItem[] = [
  { section: 'dashboard', labelKey: 'navigation.dashboard', icon: <LayoutGridIcon /> },
  { section: 'data', labelKey: 'navigation.data', icon: <ServerIcon /> },
];

const workspaceItems: NavItem[] = [
  { section: 'chat', labelKey: 'navigation.chat', icon: <MessageIcon /> },
  { section: 'settings', labelKey: 'navigation.settings', icon: <CogIcon /> },
];

// Spec-driven catalog: the last path segment is unique per entry, so it doubles
// as the selection key while the link points at the nested `catalog/*` route.
const catalogItems: NavItem[] = [
  {
    section: 'components',
    to: 'catalog/components',
    label: 'Components',
    icon: <BoxIcon />,
  },
  {
    section: 'patterns',
    to: 'catalog/patterns',
    label: 'Patterns',
    icon: <PuzzleIcon />,
  },
  {
    section: 'screens',
    to: 'catalog/screens',
    label: 'Screens',
    icon: <LayoutIcon />,
  },
];

function useCurrentSection(): string {
  const { pathname } = useLocation();
  return pathname.split('/').filter(Boolean).pop() ?? '';
}

function LogoMark() {
  return (
    <span className="flex items-center gap-2">
      <AcronisIcon aria-hidden="true" />
      <span className="leading-[1.15] group-data-[state=collapsed]/sidebar:hidden">
        <span className="block text-base font-semibold">Constructor Lab</span>
        <span className="block text-sm">Console</span>
      </span>
    </span>
  );
}

function PrimaryNav({ currentSection }: { currentSection: string }) {
  const { t } = useLocale();

  return (
    <SidebarPrimary expanded={false} aria-label="Primary">
      <SidebarPrimaryHeader>
        <LogoMark />
      </SidebarPrimaryHeader>
      <SidebarPrimaryContent>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            {primaryItems.map((item) => (
              <SidebarPrimaryMenuItem
                key={item.section}
                icon={item.icon}
                selected={currentSection === item.section}
                render={<Link to={item.section} />}
              >
                {t(item.labelKey)}
              </SidebarPrimaryMenuItem>
            ))}
          </SidebarPrimaryMenu>
        </SidebarPrimarySection>
      </SidebarPrimaryContent>
      <SidebarPrimaryFooter>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem
            icon={<CircleHelpIcon />}
            render={<button type="button" />}
          >
            Help
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryCollapseTrigger icon={<ChevronsLeftIcon />}>
            Collapse menu
          </SidebarPrimaryCollapseTrigger>
        </SidebarPrimaryMenu>
      </SidebarPrimaryFooter>
    </SidebarPrimary>
  );
}

function SecondaryNav({ currentSection }: { currentSection: string }) {
  const { t } = useLocale();
  const areaLabel = 'Console';

  const label = (item: NavItem): string =>
    item.label ?? (item.labelKey ? t(item.labelKey) : item.section);

  const renderSection = (title: string, items: NavItem[]) => (
    <SidebarSecondarySection>
      <SidebarSecondarySectionLabel>{title}</SidebarSecondarySectionLabel>
      <SidebarSecondaryMenu>
        {items.map((item) => (
          <SidebarSecondaryMenuItem
            key={item.section}
            icon={item.icon}
            selected={currentSection === item.section}
            render={<Link to={item.to ?? item.section} />}
          >
            {label(item)}
          </SidebarSecondaryMenuItem>
        ))}
      </SidebarSecondaryMenu>
    </SidebarSecondarySection>
  );

  const currentItem =
    [...overviewItems, ...workspaceItems, ...catalogItems].find(
      (item) => item.section === currentSection
    ) ?? overviewItems[0];

  return (
    <SidebarSecondary>
      <SidebarSecondaryHeader label={areaLabel} />
      <SidebarSecondaryContent>
        {renderSection('Overview', overviewItems)}
        {renderSection('Workspace', workspaceItems)}
        {renderSection('Catalog', catalogItems)}
      </SidebarSecondaryContent>
      <SidebarSecondaryCollapsedBreadcrumb
        parentLabel={areaLabel}
        currentLabel={label(currentItem)}
      />
      <SidebarSecondaryFooter>
        <SidebarSecondaryMenu>
          <SidebarSecondaryCollapseTrigger icon={<ChevronLeftIcon />}>
            Collapse menu
          </SidebarSecondaryCollapseTrigger>
        </SidebarSecondaryMenu>
      </SidebarSecondaryFooter>
    </SidebarSecondary>
  );
}

export function ConsoleSidebar() {
  const currentSection = useCurrentSection();

  return (
    <>
      <PrimaryNav currentSection={currentSection} />
      <SecondaryNav currentSection={currentSection} />
    </>
  );
}
