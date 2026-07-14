'use client';

import type { ReactNode } from 'react';
import { AspectRatio } from '@constructor-lab/ui-react';

// Inline-styled, network-free placeholder (no remote image; token vars from the
// adopted stylesheet, so no reliance on demo-only Tailwind classes).
function Box({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        background: 'var(--ui-background-surface-secondary)',
        color: 'var(--ui-text-on-surface-secondary)',
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

export function AspectRatioDemo() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ width: 160 }}>
        <AspectRatio ratio={1}>
          <Box>1 : 1</Box>
        </AspectRatio>
      </div>
      <div style={{ width: 160 }}>
        <AspectRatio ratio={4 / 3}>
          <Box>4 : 3</Box>
        </AspectRatio>
      </div>
      <div style={{ width: 256 }}>
        <AspectRatio ratio={16 / 9}>
          <Box>16 : 9</Box>
        </AspectRatio>
      </div>
    </div>
  );
}
