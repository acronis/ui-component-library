'use client';

import { TruncatedText } from '@constructor-lab/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

const LONG =
  'Acme Corporation International Holdings & Subsidiaries — Global Compliance Division';

export function TruncatedTextDemo() {
  const mount = useShadowMount();
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 240 }}
    >
      {/* Fits → plain text, no tooltip attached. */}
      <div
        style={{
          border: '1px dashed var(--ui-border-on-surface-border)',
          padding: 8,
        }}
      >
        <TruncatedText portalContainer={mount}>Acme Corp</TruncatedText>
      </div>

      {/* Overflows → single-line ellipsis; hover / focus reveals the full value. */}
      <div
        style={{
          border: '1px dashed var(--ui-border-on-surface-border)',
          padding: 8,
        }}
      >
        <TruncatedText portalContainer={mount}>{LONG}</TruncatedText>
      </div>

      {/* Multi-line clamp after two lines. */}
      <div
        style={{
          border: '1px dashed var(--ui-border-on-surface-border)',
          padding: 8,
        }}
      >
        <TruncatedText lines={2} side="bottom" portalContainer={mount}>
          {LONG}
        </TruncatedText>
      </div>
    </div>
  );
}
