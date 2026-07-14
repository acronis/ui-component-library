'use client';

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@constructor-lab/ui-react';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';

export function ButtonGroupDemo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <ButtonGroup>
        <Button variant="secondary">Day</Button>
        <Button variant="secondary">Week</Button>
        <Button variant="secondary">Month</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="secondary" aria-label="First page">
          <ChevronFirstIcon />
        </Button>
        <Button variant="secondary" aria-label="Previous page">
          <ChevronLeftIcon />
        </Button>
        <Button variant="secondary" aria-label="Next page">
          <ChevronRightIcon />
        </Button>
        <Button variant="secondary" aria-label="Last page">
          <ChevronLastIcon />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <Button variant="secondary">example.com</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="secondary">Copy</Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">Paste</Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical">
        <Button variant="secondary">Top</Button>
        <Button variant="secondary">Middle</Button>
        <Button variant="secondary">Bottom</Button>
      </ButtonGroup>
    </div>
  );
}
