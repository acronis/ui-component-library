---
'@constructor-lab/ui-react': minor
---

feat(app-shell): add `AppShellPanel` right-rail region for the AI/chat panel

The Figma app-shell layouts (Basic layout node 6226-24149, Inner page node
6226-24150) model the shell as a three-region row — sidebars, body, and a
right-hand "Acronis AI" chat rail — but `AppShell` only had the sidebar + body
columns. `AppShellPanel` is the new `<aside>` for that rail.

The panel has a built-in three-way state — `docked` (fixed rail), `collapsed`
(~48px icon rail), and `full` (fills the body, which hides). Because the panel
and the body coordinate, the state lives on the `AppShell` root
(`panelState` / `defaultPanelState` / `onPanelStateChange`, controllable) and is
shared via context. New parts drive it: `AppShellPanelContent` (docked/full),
`AppShellPanelCollapsed` (the rail), `AppShellPanelTrigger` (`to`-target button),
and the `useAppShell()` hook. The AppShell stories are rebuilt to cover every
unique layout state from both mockups (primary expanded/collapsed, one or two
secondary panels — the tertiary role, chat docked/collapsed/full/absent, and the
inner-page breadcrumb variants).
