import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@spec-lab/ui-react';
import { ScrollArea } from '@spec-lab/ui-react';
import { TokenSelector } from '@/components/playground/TokenSelector.tsx';
import { ThemeSwitcher } from '@/components/playground/ThemeSwitcher.tsx';
import { usePlaygroundStore } from '@/store/playground/playgroundStore.ts';
import { applyTokenSet } from '@/lib/playground/cssVariables.ts';
import { ThemeMode } from '@/types/playground/index.ts';

import { ArrowRotationIcon, BellIcon, CalendarIcon, ChevronDownIcon, CircleSmallIcon, FileTextIcon, InboxIcon, LayoutTableIcon, ListIcon, LockIcon, MessagesIcon, RectangleImageIcon } from '@spec-lab/icons-react/stroke-mono'
import {
  AppWindowIcon,
  AwardIcon,
  BellRingIcon,
  BookmarkIcon,
  CalendarDaysIcon,
  CheckSquareIcon,
  ClipboardListIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LayoutIconIcon,
  LayoutTemplateIcon,
  MenuIcon,
  MinusIcon,
  MousePointerIcon,
  NavigationIcon,
  NetworkIcon,
  PaletteIcon,
  PanelTopIcon,
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SquareIcon,
  TagIcon,
  ToggleLeftIcon,
  TypeIcon,
} from '@/components/icons/missing-icons';
const navigationItems = [
  {
    title: 'Design System',
    items: [
      {
        id: 'design-tokens',
        title: 'Design Tokens',
        icon: PaletteIcon,
        path: '/design-tokens',
      },
      { id: 'icons', title: 'Icons', icon: RectangleImageIcon, path: '/icons' },
    ],
  },
  {
    title: 'Components',
    items: [
      { id: 'alert', title: 'Alert', icon: BellIcon, path: '/alert' },
      { id: 'badge', title: 'Badge', icon: AwardIcon, path: '/badge' },
      {
        id: 'breadcrumb',
        title: 'Breadcrumb',
        icon: LayersIcon,
        path: '/breadcrumb',
      },
      { id: 'button', title: 'Button', icon: SquareIcon, path: '/button' },
      {
        id: 'button-group',
        title: 'Button Group',
        icon: SquareIcon,
        path: '/button-group',
      },
      {
        id: 'calendar',
        title: 'Calendar',
        icon: CalendarDaysIcon,
        path: '/calendar',
      },
      {
        id: 'carousel',
        title: 'Carousel',
        icon: RectangleHorizontalIcon,
        path: '/carousel',
      },
      { id: 'card', title: 'Card', icon: RectangleVerticalIcon, path: '/card' },
      { id: 'chart', title: 'Chart', icon: CheckSquareIcon, path: '/chart' },
      {
        id: 'checkbox',
        title: 'Checkbox',
        icon: CheckSquareIcon,
        path: '/checkbox',
      },
      { id: 'chip', title: 'Chip', icon: TagIcon, path: '/chip' },
      { id: 'combobox', title: 'Combobox', icon: ListIcon, path: '/combobox' },
      {
        id: 'container',
        title: 'Container',
        icon: ListIcon,
        path: '/container',
      },
      {
        id: 'datepicker',
        title: 'DatePicker',
        icon: CalendarIcon,
        path: '/datepicker',
      },
      { id: 'dialog', title: 'Dialog', icon: MessagesIcon, path: '/dialog' },
      {
        id: 'dropdown',
        title: 'Dropdown MenuIcon',
        icon: MenuIcon,
        path: '/dropdown-menu',
      },
      { id: 'empty', title: 'Empty State', icon: InboxIcon, path: '/empty' },
      { id: 'filter', title: 'Filter', icon: LayersIcon, path: '/filter' },
      { id: 'form', title: 'Form', icon: ClipboardListIcon, path: '/form' },
      { id: 'input', title: 'Input', icon: TypeIcon, path: '/input' },
      {
        id: 'navigation-menu',
        title: 'NavigationIcon MenuIcon',
        icon: NavigationIcon,
        path: '/navigation-menu',
      },
      {
        id: 'pagination',
        title: 'Pagination',
        icon: LayoutGridIcon,
        path: '/pagination',
      },
      {
        id: 'password-input',
        title: 'Password Input',
        icon: LockIcon,
        path: '/password-input',
      },
      {
        id: 'secondary-menu',
        title: 'Secondary MenuIcon',
        icon: MenuIcon,
        path: '/secondary-menu',
      },
      { id: 'popover', title: 'Popover', icon: PanelTopIcon, path: '/popover' },
      {
        id: 'progress',
        title: 'Progress',
        icon: ArrowRotationIcon,
        path: '/progress',
      },
      {
        id: 'radio-group',
        title: 'Radio Group',
        icon: CircleSmallIcon,
        path: '/radio-group',
      },
      { id: 'select', title: 'Select', icon: ChevronDownIcon, path: '/select' },
      {
        id: 'separator',
        title: 'Separator',
        icon: MinusIcon,
        path: '/separator',
      },
      {
        id: 'sidebar',
        title: 'Sidebar',
        icon: LayoutGridIcon,
        path: '/sidebar',
      },
      {
        id: 'sonner',
        title: 'Sonner (Toast)',
        icon: BellRingIcon,
        path: '/sonner',
      },
      {
        id: 'spinner',
        title: 'Spinner (Loading)',
        icon: ArrowRotationIcon,
        path: '/spinner',
      },
      { id: 'switch', title: 'Switch', icon: ToggleLeftIcon, path: '/switch' },
      { id: 'table', title: 'Table', icon: LayoutTableIcon, path: '/table' },
      {
        id: 'data-table',
        title: 'Data Table',
        icon: LayoutTableIcon,
        path: '/data-table',
      },
      {
        id: 'tabs',
        title: 'Tabs',
        icon: RectangleHorizontalIcon,
        path: '/tabs',
      },
      { id: 'tag', title: 'Tag', icon: BookmarkIcon, path: '/tag' },
      {
        id: 'textarea',
        title: 'Textarea',
        icon: FileTextIcon,
        path: '/textarea',
      },
      {
        id: 'tooltip',
        title: 'Tooltip',
        icon: MousePointerIcon,
        path: '/tooltip',
      },
      { id: 'tree', title: 'Tree', icon: NetworkIcon, path: '/tree' },
    ],
  },
  {
    title: 'Widgets',
    items: [
      {
        id: 'widgets',
        title: 'Dashboard Widgets',
        icon: LayoutDashboardIcon,
        path: '/widgets',
      },
    ],
  },
  {
    title: 'Layouts & Patterns',
    items: [
      {
        id: 'generic-components',
        title: 'Generic Components',
        icon: LayoutTemplateIcon,
        path: '/generic-components',
      },
      {
        id: 'layouts',
        title: 'Layouts',
        icon: LayoutIconIcon,
        path: '/layouts',
      },
      {
        id: 'patterns',
        title: 'Pattern Demos',
        icon: AppWindowIcon,
        path: '/patterns',
      },
    ],
  },
];

export function Layout() {
  const location = useLocation();
  const { theme, activeTokenSetId, tokenSets, customTokenSet } =
    usePlaygroundStore();

  useEffect(() => {
    const activeTokenSet = customTokenSet || tokenSets[activeTokenSetId];
    if (activeTokenSet) {
      const effectiveTheme =
        theme.mode === ThemeMode.SYSTEM
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? ThemeMode.DARK
            : ThemeMode.LIGHT
          : theme.mode;
      applyTokenSet(activeTokenSet, effectiveTheme);
    }
  }, [theme, activeTokenSetId, tokenSets, customTokenSet]);

  return (
    // TODO(uikit): re-do with approved pattern — ui-react's SidebarPrimary has a
    // different composition API (context-driven expand/collapse, its own menu-item
    // primitives) that doesn't map 1:1 onto this nav-item-list shape. Stubbed as a
    // plain semantic nav to keep app chrome navigable; revisit once this app is
    // rebuilt as the ui-react reference app.
    <div className="flex h-screen overflow-hidden">
      <nav
        aria-label="Primary"
        className="flex w-64 shrink-0 flex-col border-r border-border"
      >
        <div className="h-16 shrink-0 border-b border-border">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-3 h-full hover:bg-accent/50 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <LayoutDashboardIcon className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Constructor Lab UIKit</span>
              <span className="text-xs text-muted-foreground">
                Component Library
              </span>
            </div>
          </Link>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-2">
            {navigationItems.map((section) => (
              <div key={section.title} className="px-2 py-2">
                <div className="px-2 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </div>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.path}
                        aria-current={
                          location.pathname === item.path ? 'page' : undefined
                        }
                        className={cn(
                          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                          location.pathname === item.path
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </nav>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background text-foreground px-6">
          <h1 className="text-xl font-semibold">Shadcn UIKit - React Demo</h1>
          <div className="flex items-center gap-3">
            <TokenSelector />
            <ThemeSwitcher showLabel />
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
