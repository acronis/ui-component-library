'use client';

import { FittedActions } from '@constructor-lab/ui-react';
import {
  ArrowExportIcon,
  BinIcon,
  PencilIcon,
  TagIcon,
} from '@constructor-lab/icons-react/stroke-mono';

const actions = [
  { id: 'edit', label: 'Edit', icon: <PencilIcon size={16} /> },
  { id: 'tag', label: 'Tag', icon: <TagIcon size={16} /> },
  { id: 'export', label: 'Export', icon: <ArrowExportIcon size={16} /> },
  { id: 'delete', label: 'Delete', icon: <BinIcon size={16} />, divided: true },
];

export function FittedActionsDemo() {
  // Two fixed widths show the same actions fully inline and collapsed into the
  // "More" overflow menu.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {[520, 240].map((width) => (
        <div key={width} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, opacity: 0.6 }}>{width}px</span>
          <div style={{ width }}>
            <FittedActions actions={actions} />
          </div>
        </div>
      ))}
    </div>
  );
}
