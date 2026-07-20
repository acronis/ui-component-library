# AppShell

The full-page application scaffold: a sidebar column beside a body column of a
sticky header over the scrolling main content, plus an optional right-hand
AI/chat panel. A **slot-based layout** — drop `SidebarPrimary` /
`SidebarSecondary` into the sidebar, a `PageHeader` (title / breadcrumbs) into
the header, your page into main, and the chat UI into `AppShellPanel`.

Mapped to the Basic layout Figma (node `6226-24149`).

## When to use

- The top-level frame of an authenticated app screen.

## When not to use

- A marketing / auth page — use the (future) Auth Layout.
- A sub-region of a page — use `Section` / `Stack` / `Grid`.

## Parts

| Export                   | Element  | Purpose                                              |
| ------------------------ | -------- | ---------------------------------------------------- |
| `AppShell`               | `div`    | The full-height row.                                 |
| `AppShellSidebar`        | `aside`  | Left nav column (SidebarPrimary [+ Secondary]).      |
| `AppShellBody`           | `div`    | The body column filling the rest.                    |
| `AppShellHeader`         | `header` | Sticky top bar (page title / breadcrumbs + actions). |
| `AppShellMain`           | `main`   | Scrolling page content.                              |
| `AppShellFooter`         | `footer` | Optional bottom bar.                                 |
| `AppShellPanel`          | `aside`  | Optional right rail — the "Acronis AI" chat.         |
| `AppShellPanelContent`   | `div`    | Panel body, shown when docked/full.                  |
| `AppShellPanelCollapsed` | `div`    | Icon rail, shown when collapsed.                     |
| `AppShellPanelTrigger`   | `button` | Switches the panel to a target `to` state.           |

## Example

```tsx
import {
  AppShell, AppShellSidebar, AppShellBody, AppShellHeader, AppShellMain,
  AppShellPanel,
} from '@constructor-lab/ui-react';

<AppShell>
  <AppShellSidebar><SidebarPrimary … /></AppShellSidebar>
  <AppShellBody>
    <AppShellHeader><PageHeader … /></AppShellHeader>
    <AppShellMain>{children}</AppShellMain>
  </AppShellBody>
  <AppShellPanel aria-label="Acronis AI">{/* chat */}</AppShellPanel>
</AppShell>;
```

See the **App Shell** pattern for the full slot assembly.
