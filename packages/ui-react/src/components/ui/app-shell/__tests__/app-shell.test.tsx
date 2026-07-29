import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  AppShell,
  AppShellBody,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellPanel,
  AppShellPanelTrigger,
  AppShellSidebar,
} from '../index';

describe('AppShell', () => {
  it('renders the slots with their landmark elements', () => {
    const { container } = render(
      <AppShell>
        <AppShellSidebar>nav</AppShellSidebar>
        <AppShellBody>
          <AppShellHeader>header</AppShellHeader>
          <AppShellMain>main</AppShellMain>
          <AppShellFooter>footer</AppShellFooter>
        </AppShellBody>
      </AppShell>
    );
    expect(
      container.querySelector('[data-slot="app-shell"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('aside[data-slot="app-shell-sidebar"]')
    ).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveTextContent('header');
    expect(screen.getByRole('main')).toHaveTextContent('main');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('footer');
  });

  it('renders the optional right-hand panel as a complementary aside', () => {
    const { container } = render(
      <AppShell>
        <AppShellBody>
          <AppShellMain>main</AppShellMain>
        </AppShellBody>
        <AppShellPanel className="w-96" aria-label="Acronis AI">
          chat
        </AppShellPanel>
      </AppShell>
    );
    const panel = container.querySelector('aside[data-slot="app-shell-panel"]');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveClass('w-96');
    expect(panel).toHaveAttribute('aria-label', 'Acronis AI');
  });

  it('forwards refs and merges className', () => {
    const { container } = render(
      <AppShell className="custom-shell">
        <AppShellMain>x</AppShellMain>
      </AppShell>
    );
    expect(container.querySelector('[data-slot="app-shell"]')).toHaveClass(
      'custom-shell'
    );
  });

  it('reflects the default panel state and hides the body when full', () => {
    const { container } = render(
      <AppShell defaultPanelState="full">
        <AppShellBody>body</AppShellBody>
        <AppShellPanel aria-label="Acronis AI">chat</AppShellPanel>
      </AppShell>
    );
    expect(container.querySelector('[data-slot="app-shell"]')).toHaveAttribute(
      'data-panel-state',
      'full'
    );
    expect(
      container.querySelector('[data-slot="app-shell-panel"]')
    ).toHaveAttribute('data-state', 'full');
    // The body yields the content area to the full panel.
    expect(container.querySelector('[data-slot="app-shell-body"]')).toHaveClass(
      'hidden'
    );
  });

  it('AppShellPanelTrigger switches the panel state (uncontrolled)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AppShell defaultPanelState="collapsed">
        <AppShellPanel aria-label="Acronis AI">
          <AppShellPanelTrigger to="docked">open</AppShellPanelTrigger>
        </AppShellPanel>
      </AppShell>
    );
    const shell = () => container.querySelector('[data-slot="app-shell"]');
    expect(shell()).toHaveAttribute('data-panel-state', 'collapsed');
    await user.click(screen.getByRole('button', { name: 'open' }));
    expect(shell()).toHaveAttribute('data-panel-state', 'docked');
  });

  it('AppShellPanelTrigger reports changes and honors control (controlled)', async () => {
    const user = userEvent.setup();
    const onPanelStateChange = vi.fn();
    const { container } = render(
      <AppShell panelState="docked" onPanelStateChange={onPanelStateChange}>
        <AppShellPanel aria-label="Acronis AI">
          <AppShellPanelTrigger to="collapsed">collapse</AppShellPanelTrigger>
        </AppShellPanel>
      </AppShell>
    );
    await user.click(screen.getByRole('button', { name: 'collapse' }));
    expect(onPanelStateChange).toHaveBeenCalledWith('collapsed');
    // Controlled: state stays until the prop changes.
    expect(container.querySelector('[data-slot="app-shell"]')).toHaveAttribute(
      'data-panel-state',
      'docked'
    );
  });
});
