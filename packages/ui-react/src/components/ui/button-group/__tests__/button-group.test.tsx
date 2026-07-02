import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../../button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '../button-group';

describe('ButtonGroup', () => {
  it('renders a role="group" container defaulting to horizontal', () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('data-orientation', 'horizontal');
    expect(group).toHaveClass('flex', 'w-fit', 'items-stretch');
  });

  it('applies vertical orientation classes and attribute', () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>One</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('data-orientation', 'vertical');
    expect(group).toHaveClass('flex-col');
  });

  it('forwards the ref to the group element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ButtonGroup ref={ref}>x</ButtonGroup>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ButtonGroupText', () => {
  it('renders a muted, bordered addon with its content', () => {
    const { container } = render(<ButtonGroupText>https://</ButtonGroupText>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('bg-muted', 'border-border', 'text-foreground');
    expect(el).toHaveTextContent('https://');
  });

  it('composes as another element via the render prop', () => {
    render(
      <ButtonGroupText render={<label htmlFor="f" />}>Label</ButtonGroupText>
    );
    const el = screen.getByText('Label');
    expect(el.tagName).toBe('LABEL');
    expect(el).toHaveAttribute('for', 'f');
    expect(el).toHaveClass('bg-muted');
  });
});

describe('ButtonGroupSeparator', () => {
  it('renders a vertical separator by default', () => {
    render(<ButtonGroupSeparator />);
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('data-orientation', 'vertical');
  });
});
