import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../../button';
import { ConfirmDialog } from '../confirm-dialog';

describe('ConfirmDialog', () => {
  it('renders the title and description when open', () => {
    render(
      <ConfirmDialog
        defaultOpen
        title="Delete project?"
        description="This cannot be undone."
      />
    );
    expect(screen.getByText('Delete project?')).toBeVisible();
    expect(screen.getByText('This cannot be undone.')).toBeVisible();
  });

  it('renders exactly two footer actions with default labels', () => {
    render(<ConfirmDialog defaultOpen title="Sure?" />);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  it('uses custom action labels', () => {
    render(
      <ConfirmDialog
        defaultOpen
        title="Sure?"
        confirmLabel="Delete"
        cancelLabel="Keep"
      />
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Keep' })).toBeVisible();
  });

  it('calls onConfirm when the confirm action is activated', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<ConfirmDialog defaultOpen title="Sure?" onConfirm={onConfirm} />);
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when the cancel action is activated', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ConfirmDialog defaultOpen title="Sure?" onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('closes after confirming (controlled)', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = useState(true);
      return (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Sure?"
          onConfirm={() => {}}
        />
      );
    }
    render(<Harness />);
    expect(screen.getByText('Sure?')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(screen.queryByText('Sure?')).not.toBeInTheDocument();
  });

  it('opens from a trigger (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(
      <ConfirmDialog title="Sure?" trigger={<Button>Delete account</Button>} />
    );
    // Closed initially — the title is not rendered.
    expect(screen.queryByText('Sure?')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete account' }));
    expect(screen.getByText('Sure?')).toBeVisible();
  });

  it('marks the confirm action destructive', () => {
    render(
      <ConfirmDialog
        defaultOpen
        title="Delete?"
        destructive
        confirmLabel="Delete"
      />
    );
    const confirm = screen.getByRole('button', { name: 'Delete' });
    // Destructive maps to the destructive container token (not the primary one).
    expect(confirm.className).toContain('ui-button-destructive');
  });
});
