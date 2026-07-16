'use client';

import { DetailList, Link } from '@constructor-lab/ui-react';
import {
  CircleCheckIcon,
  CircleClockIcon,
  CircleInfoIcon,
} from '@constructor-lab/icons-react/stroke-mono';

export function DetailListDemo() {
  return (
    <div style={{ maxWidth: 520 }}>
      <DetailList
        items={[
          {
            label: 'Status',
            value: 'Operational',
            icon: (
              <CircleCheckIcon
                style={{ color: 'var(--ui-glyph-on-status-success)' }}
              />
            ),
            description: 'All checks passing.',
          },
          {
            label: 'Owner',
            value: 'Ada Lovelace',
            description: 'ada@example.com',
          },
          { label: 'Region', value: 'EU (Frankfurt)' },
          {
            label: 'Plan',
            value: 'Business',
            icon: (
              <CircleInfoIcon
                style={{ color: 'var(--ui-glyph-on-status-info)' }}
              />
            ),
            description: 'Renews on 1 Aug 2026.',
            actions: <Link href="#billing">Manage billing</Link>,
          },
          {
            label: 'Last backup',
            value: '2 hours ago',
            icon: (
              <CircleClockIcon
                style={{ color: 'var(--ui-glyph-on-status-neutral)' }}
              />
            ),
            actions: <Link href="#run">Run now</Link>,
          },
        ]}
      />
    </div>
  );
}
