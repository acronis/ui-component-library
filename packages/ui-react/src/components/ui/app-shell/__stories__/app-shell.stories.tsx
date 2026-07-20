import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowsExpandIcon,
  BoltIcon,
  BoxIcon,
  BriefcaseIcon,
  BuildingIcon,
  ChartGrowthIcon,
  ChevronLeftIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CircleHelpIcon,
  HeadsetIcon,
  InboxIcon,
  LayoutGridIcon,
  MonitorIcon,
  PanelRightIcon,
  PlusIcon,
  SendIcon,
  ServerIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { AcronisIcon } from '@constructor-lab/icons-react/solid-mono';

import { Button } from '../../button';
import { ButtonIcon } from '../../button-icon';
import {
  PageHeader,
  PageHeaderBreadcrumb,
  PageHeaderRow,
  PageHeaderTitle,
} from '../../page-header';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
} from '../../empty';
import {
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
} from '../../sidebar-primary';
import {
  SidebarSecondary,
  SidebarSecondaryCollapseTrigger,
  SidebarSecondaryCollapsedBreadcrumb,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
  SidebarSecondaryMenuSubTrigger,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '../../sidebar-secondary';
import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellPanel,
  AppShellPanelCollapsed,
  AppShellPanelContent,
  AppShellPanelTrigger,
  AppShellSidebar,
  useAppShell,
  type AppShellPanelState,
} from '../app-shell';

// Stories realizing the Figma app-shell layouts: Basic layout (node 6226-24149)
// and Inner page (node 6226-24150). The shell is a three-region horizontal
// composition — [sidebars] | [body: header + main] | [AI/chat panel] — and each
// story below fixes one unique arrangement of those regions (primary
// expanded/collapsed, one or two secondary panels, the chat rail docked /
// collapsed / full / absent, and the inner-page breadcrumb variants).
const meta = {
  title: 'UI/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- shared slot content (the exact components + values from the Figma) ----

function LogoMark() {
  return (
    <span className="flex items-center gap-2">
      <AcronisIcon aria-hidden="true" />
      <span className="leading-[1.15] group-data-[state=collapsed]/sidebar:hidden">
        <span className="block text-base font-semibold">Acronis</span>
        <span className="block text-sm">Cyber Platform</span>
      </span>
    </span>
  );
}

// The dark top-level rail. `expanded` fixes the width so a story renders one
// deterministic state (the collapse trigger stays live for manual poking).
function PrimaryNav({ expanded }: { expanded?: boolean }) {
  return (
    <SidebarPrimary expanded={expanded} aria-label="Primary">
      <SidebarPrimaryHeader>
        <LogoMark />
      </SidebarPrimaryHeader>
      <SidebarPrimaryContent>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />} selected>
              Assets
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<ShieldCheckIcon />}>
              Protection management
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<BriefcaseIcon />}>
              Clients
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<HeadsetIcon />}>
              Service desk
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<BoltIcon />}>
              Automation
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<LayoutGridIcon />}>
              Marketplace
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<ChartGrowthIcon />}>
              Partner portal
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<BuildingIcon />}>
              My company
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </SidebarPrimarySection>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<InboxIcon />}>
              My inbox
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<StarIcon />}>
              Favorites
            </SidebarPrimaryMenuItem>
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
  );
}

// The white section-navigation panel (second rail).
function SecondaryNav({
  expanded,
  label = 'Protection',
}: {
  expanded?: boolean;
  label?: string;
}) {
  return (
    <SidebarSecondary expanded={expanded} aria-label={label}>
      <SidebarSecondaryHeader label={label} />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
              Dashboard
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="#" icon={<ServerIcon />}>
              Devices
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>
            Configuration
          </SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuSub defaultOpen>
              <SidebarSecondaryMenuSubTrigger icon={<BoxIcon />}>
                Policies
              </SidebarSecondaryMenuSubTrigger>
              <SidebarSecondaryMenuSubContent>
                <SidebarSecondaryMenuSubItem href="#" selected>
                  Backup
                </SidebarSecondaryMenuSubItem>
                <SidebarSecondaryMenuSubItem href="#">
                  Antivirus
                </SidebarSecondaryMenuSubItem>
                <SidebarSecondaryMenuSubItem href="#">
                  Vulnerability assessment
                </SidebarSecondaryMenuSubItem>
              </SidebarSecondaryMenuSubContent>
            </SidebarSecondaryMenuSub>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
      <SidebarSecondaryCollapsedBreadcrumb
        parentLabel={label}
        currentLabel="Dashboard"
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

// The tertiary panel is not a new component — it is a second SidebarSecondary
// used in a "tertiary" role (Figma: shown when a screen needs two section
// panels). Per the design it cannot be collapsed, so it renders no collapse
// trigger and stays expanded.
function TertiaryNav() {
  return (
    <SidebarSecondary aria-label="Managed devices">
      <SidebarSecondaryHeader label="Managed devices" />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>Devices</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#" icon={<ServerIcon />} selected>
              Workstations
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="#" icon={<MonitorIcon />}>
              Virtual machines
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="#" icon={<BoxIcon />}>
              Mobile devices
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
    </SidebarSecondary>
  );
}

// The in-page section tree (Figma inner page): a static "General" group over a
// collapsible sub-tree — the "Extra nav" that only inner pages carry.
function InnerPageNav() {
  return (
    <SidebarSecondary aria-label="Tenant name">
      <SidebarSecondaryHeader label="General" />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#">Overview</SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="#" selected>
              Profile
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
        <SidebarSecondarySection expandable defaultOpen>
          <SidebarSecondarySectionLabel>Services</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#">Backup</SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="#">Recovery</SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
        <SidebarSecondarySection expandable>
          <SidebarSecondarySectionLabel>Management</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#">Users</SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="#">Roles</SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
        <SidebarSecondarySection>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
    </SidebarSecondary>
  );
}

// The body top bar (Figma "Page header"): a page title on the left, actions on
// the right. When the chat rail is hidden, the right side carries the affordance
// that re-opens it.
function TopBar({
  title = 'Assets',
  breadcrumb,
  showOpenChat = false,
}: {
  title?: string;
  breadcrumb?: React.ReactNode;
  showOpenChat?: boolean;
}) {
  return (
    <AppShellHeader className={breadcrumb ? 'h-auto py-3' : undefined}>
      <PageHeader className="w-full flex-1 gap-1 pb-0">
        {breadcrumb != null && (
          <PageHeaderBreadcrumb>{breadcrumb}</PageHeaderBreadcrumb>
        )}
        <PageHeaderRow>
          <PageHeaderTitle>{title}</PageHeaderTitle>
          <span className="flex items-center gap-2">
            {showOpenChat && (
              <Button variant="secondary">
                <SparklesIcon />
                Acronis AI
              </Button>
            )}
            <span className="text-sm text-[var(--ui-text-on-surface-secondary)]">
              admin@acronis.com
            </span>
          </span>
        </PageHeaderRow>
      </PageHeader>
    </AppShellHeader>
  );
}

// The dashed "Content" placeholder from the mockups.
function ContentPlaceholder({ label = 'Content' }: { label?: string }) {
  return (
    <div className="flex h-full min-h-64 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function PageBody({
  title,
  breadcrumb,
  showOpenChat,
  children,
}: {
  title?: string;
  breadcrumb?: React.ReactNode;
  showOpenChat?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <AppShellBody>
      <TopBar title={title} breadcrumb={breadcrumb} showOpenChat={showOpenChat} />
      <AppShellMain className="p-6">
        {children ?? <ContentPlaceholder />}
      </AppShellMain>
    </AppShellBody>
  );
}

// The "Acronis AI" chat rail header: its title switches with the panel state,
// and its buttons flip that state through AppShellPanelTrigger (collapse to the
// rail, expand to full / dock back). Rendered inside AppShellPanelContent.
function ChatHeader() {
  const { panelState } = useAppShell();
  const full = panelState === 'full';
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
      <SparklesIcon
        aria-hidden="true"
        className="text-[var(--ui-text-on-surface-link-idle)]"
      />
      <span className="flex-1 font-semibold">
        {full ? 'Chat title' : 'Acronis AI'}
      </span>
      <ButtonIcon variant="ghost" aria-label="New chat">
        <PlusIcon />
      </ButtonIcon>
      <ButtonIcon
        variant="ghost"
        aria-label={full ? 'Dock chat' : 'Expand chat'}
        render={<AppShellPanelTrigger to={full ? 'docked' : 'full'} />}
      >
        {full ? <PanelRightIcon /> : <ArrowsExpandIcon />}
      </ButtonIcon>
      <ButtonIcon
        variant="ghost"
        aria-label="Collapse chat"
        render={<AppShellPanelTrigger to="collapsed" />}
      >
        <ChevronsRightIcon />
      </ButtonIcon>
    </header>
  );
}

function ChatComposer() {
  return (
    <footer className="shrink-0 border-t border-border p-3">
      <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
        <span className="flex-1 text-sm text-muted-foreground">
          Ask Acronis AI…
        </span>
        <ButtonIcon variant="secondary" aria-label="Send">
          <SendIcon />
        </ButtonIcon>
      </div>
    </footer>
  );
}

function ChatTranscript() {
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-auto p-4">
      <div className="self-start rounded-lg bg-[var(--ui-background-surface-secondary)] px-3 py-2 text-sm">
        How can I help you protect your workloads today?
      </div>
      <div className="self-end rounded-lg bg-[var(--ui-background-brand-primary)] px-3 py-2 text-sm text-[var(--ui-text-on-brand-primary)]">
        Show me devices missing a backup.
      </div>
    </div>
  );
}

// The chat rail. The docked/full content and the collapsed icon rail are both
// slotted; AppShellPanel shows the right one for the current state. State is
// flipped by the triggers in ChatHeader and the opener below — nothing here
// tracks state, the shell does.
function ChatRail() {
  return (
    <AppShellPanel aria-label="Acronis AI">
      <AppShellPanelContent>
        <ChatHeader />
        <ChatTranscript />
        <ChatComposer />
      </AppShellPanelContent>
      <AppShellPanelCollapsed>
        <ButtonIcon
          variant="ghost"
          aria-label="Open Acronis AI"
          render={<AppShellPanelTrigger to="docked" />}
        >
          <SparklesIcon />
        </ButtonIcon>
      </AppShellPanelCollapsed>
    </AppShellPanel>
  );
}

function Frame({
  panelState,
  children,
}: {
  panelState?: AppShellPanelState;
  children: React.ReactNode;
}) {
  // The shell fills the viewport with no surrounding gap; every column stretches
  // to the full shell height and the main area scrolls. `defaultPanelState` seeds
  // the chat rail — the triggers then drive it (uncontrolled), so every story is
  // interactive.
  return (
    <AppShell className="h-screen" defaultPanelState={panelState}>
      {children}
    </AppShell>
  );
}

// ================= Basic layout (node 6226-24149) =================

export const Expanded: Story = {
  name: 'Primary expanded · chat',
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav />
      </AppShellSidebar>
      <PageBody title="Intelligence" />
      <ChatRail />
    </Frame>
  ),
};

export const CollapsedPrimary: Story = {
  name: 'Primary collapsed · chat',
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
      </AppShellSidebar>
      <PageBody title="Intelligence" />
      <ChatRail />
    </Frame>
  ),
};

export const NoChat: Story = {
  name: 'Primary collapsed · no chat',
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
      </AppShellSidebar>
      <PageBody title="Intelligence" showOpenChat />
    </Frame>
  ),
};

export const WithSecondary: Story = {
  name: 'Secondary expanded · chat',
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
        <SecondaryNav />
      </AppShellSidebar>
      <PageBody title="Dashboard" />
      <ChatRail />
    </Frame>
  ),
};

export const SecondaryCollapsed: Story = {
  name: 'Secondary collapsed · chat',
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
        <SecondaryNav expanded={false} />
      </AppShellSidebar>
      <PageBody title="Dashboard" />
      <ChatRail />
    </Frame>
  ),
};

export const WithTertiary: Story = {
  name: 'Two secondary panels (tertiary role)',
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
        <SecondaryNav label="Assets" />
        <TertiaryNav />
      </AppShellSidebar>
      <PageBody title="Workstations" />
      <ChatRail />
    </Frame>
  ),
};

export const ChatCollapsed: Story = {
  name: 'Chat collapsed to rail',
  render: () => (
    <Frame panelState="collapsed">
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
      </AppShellSidebar>
      <PageBody title="Intelligence" />
      <ChatRail />
    </Frame>
  ),
};

export const ChatFull: Story = {
  name: 'Chat expanded to full',
  // `panelState="full"` grows the panel to fill the shell; AppShellBody hides
  // itself (via the shared state), so the chat takes over the content area.
  render: () => (
    <Frame panelState="full">
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
      </AppShellSidebar>
      <PageBody title="Intelligence" />
      <ChatRail />
    </Frame>
  ),
};

// ================= Inner page (node 6226-24150) =================

const clientsBreadcrumb = (
  <span>
    Clients <span aria-hidden="true">/</span> Tenant name
  </span>
);

const serviceDeskBreadcrumb = (
  <span>
    Service desk <span aria-hidden="true">/</span> ID-1002
  </span>
);

export const InnerPageWithNav: Story = {
  name: 'Inner page · with extra nav',
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
        <InnerPageNav />
      </AppShellSidebar>
      <PageBody title="Tenant name" breadcrumb={clientsBreadcrumb}>
        <ContentPlaceholder label="Profile" />
      </PageBody>
      <ChatRail />
    </Frame>
  ),
};

export const InnerPageWithoutNav: Story = {
  name: 'Inner page · without extra nav',
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav expanded={false} />
      </AppShellSidebar>
      <PageBody title="ID-1002 / Ticket name" breadcrumb={serviceDeskBreadcrumb}>
        <div className="grid h-full grid-cols-[16rem_1fr] gap-4">
          <ContentPlaceholder />
          <ContentPlaceholder />
        </div>
      </PageBody>
      <ChatRail />
    </Frame>
  ),
};

// ================= Content states =================

export const EmptyScreen: Story = {
  render: () => (
    <Frame>
      <AppShellSidebar>
        <PrimaryNav />
      </AppShellSidebar>
      <AppShellBody>
        <TopBar title="Intelligence" />
        <AppShellMain className="grid place-items-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyIcon>
                <InboxIcon />
              </EmptyIcon>
              <EmptyTitle>Nothing here yet</EmptyTitle>
              <EmptyDescription>
                When you add workloads they’ll show up on this page.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </AppShellMain>
      </AppShellBody>
    </Frame>
  ),
};
