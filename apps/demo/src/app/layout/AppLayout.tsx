import { Outlet } from 'react-router-dom';
import {
  AppShell,
  AppShellBody,
  AppShellMain,
  AppShellSidebar,
} from '@spec-lab/ui-react';
import { ConsoleHeader } from './ConsoleHeader';
import { ConsoleSidebar } from './ConsoleSidebar';

// The demo console frame: the kit's AppShell composite realizing the
// protection-dashboard screen spec — a collapsed primary rail + expanded
// secondary section nav (ConsoleSidebar) beside a body of the sticky global-
// search header (ConsoleHeader) over the routed main content. The sidebar is
// hidden below `md` (the rail + panel are too wide for a phone); the section
// nav stays reachable from the routed content on those widths.
export function AppLayout() {
  return (
    <AppShell className="h-screen">
      <AppShellSidebar className="hidden md:flex">
        <ConsoleSidebar />
      </AppShellSidebar>
      <AppShellBody>
        <ConsoleHeader />
        <AppShellMain className="p-6">
          <Outlet />
        </AppShellMain>
      </AppShellBody>
    </AppShell>
  );
}
