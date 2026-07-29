// Figma Code Connect — status: COMPLETE
// Mapped to the Basic layout design (ui-react file, node 6226-24149).
import figma from '@figma/code-connect';

import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellPanel,
  AppShellSidebar,
} from './app-shell';

figma.connect(
  AppShell,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6226-24149',
  {
    example: () => (
      <AppShell>
        <AppShellSidebar>
          {/* SidebarPrimary [+ SidebarSecondary] */}
        </AppShellSidebar>
        <AppShellBody>
          <AppShellHeader>
            {/* PageHeader (title / breadcrumbs) + actions */}
          </AppShellHeader>
          <AppShellMain>{/* page content */}</AppShellMain>
        </AppShellBody>
        <AppShellPanel>{/* Acronis AI chat rail */}</AppShellPanel>
      </AppShell>
    ),
  }
);
