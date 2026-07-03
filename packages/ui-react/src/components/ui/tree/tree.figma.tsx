// Figma Code Connect — status: COMPLETE
// Mapped to the "Tree" item component set in the ui-react Figma file
// (node 2847-8319). The Figma item exposes Expandable / Checkbox / Icon / Tag /
// Additional Slot Items boolean props (and an interaction `State` that maps to
// CSS :hover / :focus-visible / [data-selected], not to code).
import figma from '@figma/code-connect';
import { FileIcon } from '@spec-lab/icons-react/stroke-mono';

import {
  TreeItem,
  TreeItemCheckbox,
  TreeItemGroup,
  TreeItemIcon,
  TreeItemLabel,
  TreeItemTrigger,
} from './tree';
import { Tag } from '../tag';

figma.connect(
  TreeItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=2847-8319',
  {
    props: {
      expandable: figma.boolean('Expandable'),
      checkbox: figma.boolean('Checkbox'),
      icon: figma.boolean('Icon'),
      tag: figma.boolean('Tag'),
    },
    example: ({ expandable, checkbox, icon, tag }) => (
      <TreeItem value="node">
        <TreeItemTrigger>
          {checkbox && <TreeItemCheckbox />}
          {icon && (
            <TreeItemIcon>
              <FileIcon />
            </TreeItemIcon>
          )}
          <TreeItemLabel>Label</TreeItemLabel>
          {tag && (
            <Tag variant="info" size="sm" className="ml-auto">
              Label
            </Tag>
          )}
        </TreeItemTrigger>
        {expandable && <TreeItemGroup>{/* nested <TreeItem>s */}</TreeItemGroup>}
      </TreeItem>
    ),
  }
);
