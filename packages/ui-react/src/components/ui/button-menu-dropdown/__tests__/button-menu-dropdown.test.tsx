import { createRef, type Ref } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  ButtonMenuDropdown,
  ButtonMenuDropdownContent,
  ButtonMenuDropdownItem,
  ButtonMenuDropdownSection,
  ButtonMenuDropdownTrigger,
} from '../button-menu-dropdown';

function DemoMenu(props: { contentRef?: Ref<HTMLDivElement> }) {
  return (
    <ButtonMenuDropdown open>
      <ButtonMenuDropdownTrigger>Actions</ButtonMenuDropdownTrigger>
      <ButtonMenuDropdownContent ref={props.contentRef}>
        <ButtonMenuDropdownSection>
          <ButtonMenuDropdownItem icon={<svg data-testid="leading-icon" />}>
            Rename
          </ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem shortcut="⌘C">Copy</ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem cascade>Move to</ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem disabled>Delete</ButtonMenuDropdownItem>
        </ButtonMenuDropdownSection>
      </ButtonMenuDropdownContent>
    </ButtonMenuDropdown>
  );
}

describe('ButtonMenuDropdown', () => {
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
    expect(item).toContainElement(icon);
    // The label text node follows the leading icon in DOM order.
    expect(item.firstElementChild).toContainElement(icon);
    expect(item.textContent).toBe('Rename');
  });

  it('renders a trailing shortcut hint', () => {
    render(<DemoMenu />);
    const item = screen.getByRole('menuitem', { name: /Copy/ });
    const shortcut = screen.getByText('⌘C');
    expect(item).toContainElement(shortcut);
    expect(shortcut).toHaveClass(
      'text-[var(--ui-button-menu-dropdown-extras-shortcut-label-color)]'
    );
  });

  it('renders a trailing cascade chevron', () => {
    render(<DemoMenu />);
    const item = screen.getByRole('menuitem', { name: 'Move to' });
    const chevron = item.querySelector('svg');
    expect(chevron).toBeInTheDocument();
    expect(chevron).toHaveClass(
      'text-[var(--ui-button-menu-dropdown-extras-cascade-icon-color)]'
    );
  });

  it('marks a disabled item', () => {
    render(<DemoMenu />);
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
      'data-disabled'
    );
  });

  it('forwards the ref to the content popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DemoMenu contentRef={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute('role', 'menu');
  });
});
