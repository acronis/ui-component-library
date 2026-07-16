'use client';

import { StatRow } from '@constructor-lab/ui-react';
import {
  CircleCheckIcon,
  CircleClockIcon,
  CircleInfoIcon,
} from '@constructor-lab/icons-react/stroke-mono';

export function StatRowDemo() {
  return (
    <StatRow
      stats={[
        {
          label: 'Protected',
          value: '982',
          icon: (
            <CircleCheckIcon
              style={{ color: 'var(--ui-glyph-on-status-success)' }}
            />
          ),
          onClick: () => {},
        },
        {
          label: 'At risk',
          value: '17',
          icon: (
            <CircleInfoIcon
              style={{ color: 'var(--ui-glyph-on-status-warning)' }}
            />
          ),
          onClick: () => {},
        },
        {
          label: 'Last scan',
          value: '2h ago',
          icon: (
            <CircleClockIcon
              style={{ color: 'var(--ui-glyph-on-status-neutral)' }}
            />
          ),
        },
        { label: 'Quarantined', value: '3' },
        { label: 'Pending review', empty: true },
      ]}
    />
  );
}
