import type { ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The runtime props
// reference the `StatRowStat[]` descriptor + a Base UI render type that
// AutoTypeTable can't expand inline; this companion documents the caller-facing
// shape. (The runtime types live in stat-row.tsx; this file is never bundled.)

/** Props for `StatRow`. See `StatRowStat` for the tile descriptor. */
export interface StatRowProps {
  /** The tiles, in order. */
  stats: unknown[];
  /** Equal-width columns (a grid). Omit for a wrapping row of fixed-width (224px) cards. */
  columns?: number;
}

/** A single tile descriptor for `StatRow.stats`. */
export interface StatRowStat {
  /** Stable key for the tile (falls back to the index). */
  id?: string;
  /** Caption above the value. */
  label: ReactNode;
  /** The prominent value. Ignored when `empty`. */
  value?: ReactNode;
  /** Optional leading icon (16px) before the value. */
  icon?: ReactNode;
  /** Render as an empty placeholder (an em-dash value, no icon). */
  empty?: boolean;
  /** Make the tile an interactive filter (renders a button). */
  onClick?: () => void;
  /** Polymorphic render (e.g. a router link) — also makes the tile interactive. */
  render?: unknown;
}
