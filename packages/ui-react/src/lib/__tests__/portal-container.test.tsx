import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { PortalContainerProvider } from '../portal-container';

// Tooltip is used as the probe because `defaultOpen` mounts its portal
// synchronously (the same technique tooltip.test.tsx uses for the explicit
// `portalContainer` prop). Any of the portaling components would exercise the
// same shared `usePortalContainer` default.
describe('PortalContainerProvider', () => {
  it('routes a portaling component into the provider container by default', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <PortalContainerProvider container={container}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Helpful hint</TooltipContent>
        </Tooltip>
      </PortalContainerProvider>
    );

    expect(container).toContainElement(screen.getByText('Helpful hint'));
    container.remove();
  });

  it('lets an explicit portalContainer prop win over the provider', () => {
    const provided = document.createElement('div');
    const explicit = document.createElement('div');
    document.body.append(provided, explicit);

    render(
      <PortalContainerProvider container={provided}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent portalContainer={explicit}>
            Helpful hint
          </TooltipContent>
        </Tooltip>
      </PortalContainerProvider>
    );

    const hint = screen.getByText('Helpful hint');
    expect(explicit).toContainElement(hint);
    expect(provided).not.toContainElement(hint);

    provided.remove();
    explicit.remove();
  });
});
