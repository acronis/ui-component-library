import { createRef, type Ref } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSection,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuContent,
  MenuSubmenuTrigger,
  MenuTrigger,
} from '../menu';

function DemoMenu(props: { contentRef?: Ref<HTMLDivElement>; onItemClick?: () => void }) {
  return (
    <Menu open>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent ref={props.contentRef}>
        <MenuSection>
          <MenuItem icon={<svg data-testid="leading-icon" />}>Rename</MenuItem>
          <MenuItem shortcut="⌘C" onClick={props.onItemClick}>
            Copy
          </MenuItem>
          <MenuItem cascade>Move to</MenuItem>
          <MenuItem disabled>Delete</MenuItem>
        </MenuSection>
      </MenuContent>
    </Menu>
  );
}

describe('Menu', () => {
  it('renders the open panel with its item labels', () => {
    render(<DemoMenu />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Copy/ })).toBeInTheDocument();
  });

  it('themes the panel from the container tokens', () => {
    render(<DemoMenu />);
    expect(screen.getByRole('menu')).toHaveClass(
      'bg-[var(--ui-button-menu-dropdown-container-color)]',
      'rounded-[var(--ui-button-menu-dropdown-container-border-radius)]'
    );
  });

  it('wires an item to its label + idle container tokens', () => {
    render(<DemoMenu />);
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveClass(
      'text-[var(--ui-button-menu-dropdown-item-label-color)]',
      'bg-[var(--ui-button-menu-dropdown-item-container-color-idle)]',
      'data-[highlighted]:bg-[var(--ui-button-menu-dropdown-item-container-color-hover)]'
    );
  });

  it('renders the leading icon before the label', () => {
    render(<DemoMenu />);
    const item = screen.getByRole('menuitem', { name: 'Rename' });
    const icon = screen.getByTestId('leading-icon');
    expect(item.firstElementChild).toContainElement(icon);
    expect(item.textContent).toBe('Rename');
  });

  it('renders a trailing shortcut hint', () => {
    render(<DemoMenu />);
    const shortcut = screen.getByText('⌘C');
    expect(shortcut).toHaveClass(
      'text-[var(--ui-button-menu-dropdown-extras-shortcut-label-color)]'
    );
  });

  it('renders a trailing cascade chevron', () => {
    render(<DemoMenu />);
    const item = screen.getByRole('menuitem', { name: 'Move to' });
    expect(item.querySelector('svg')).toHaveClass(
      'text-[var(--ui-button-menu-dropdown-extras-cascade-icon-color)]'
    );
  });

  it('marks a disabled item', () => {
    render(<DemoMenu />);
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
      'data-disabled'
    );
  });

  it('invokes an item handler on click', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<DemoMenu onItemClick={onItemClick} />);
    await user.click(screen.getByRole('menuitem', { name: /Copy/ }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it('forwards the ref to the content popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DemoMenu contentRef={ref} />);
    expect(ref.current).toHaveAttribute('role', 'menu');
  });
});

describe('Menu submenu', () => {
  function DemoSubmenu() {
    return (
      <Menu open>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuSection>
            <MenuItem>Rename</MenuItem>
            <MenuSubmenu open>
              <MenuSubmenuTrigger icon={<svg data-testid="sub-icon" />}>
                Move to
              </MenuSubmenuTrigger>
              <MenuSubmenuContent>
                <MenuSection>
                  <MenuItem>Documents</MenuItem>
                </MenuSection>
              </MenuSubmenuContent>
            </MenuSubmenu>
          </MenuSection>
        </MenuContent>
      </Menu>
    );
  }

  it('opens a nested submenu from a submenu trigger', () => {
    render(<DemoSubmenu />);
    const trigger = screen.getByRole('menuitem', { name: /Move to/ });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('data-popup-open');
    expect(trigger).toContainElement(screen.getByTestId('sub-icon'));
    expect(screen.getByRole('menuitem', { name: 'Documents' })).toBeInTheDocument();
  });
});

describe('Menu checkbox / radio / label / separator', () => {
  it('renders a checkbox item with role menuitemcheckbox', () => {
    render(
      <Menu open>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuCheckboxItem checked>Show grid</MenuCheckboxItem>
        </MenuContent>
      </Menu>
    );
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Show grid' })
    ).toBeInTheDocument();
  });

  it('renders a radio group, a label, and a separator', () => {
    render(
      <Menu open>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuLabel>Density</MenuLabel>
          <MenuSeparator />
          <MenuRadioGroup value="compact">
            <MenuRadioItem value="comfortable">Comfortable</MenuRadioItem>
            <MenuRadioItem value="compact">Compact</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );
    expect(screen.getByText('Density')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(
      screen.getByRole('menuitemradio', { name: 'Compact' })
    ).toHaveAttribute('aria-checked', 'true');
  });
});
