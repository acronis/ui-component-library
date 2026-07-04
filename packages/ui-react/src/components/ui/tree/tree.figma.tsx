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
      checkbox: figma.boolean('Checkbox', {
        true: <TreeItemCheckbox />,
        false: undefined,
      }),
      icon: figma.boolean('Icon', {
        true: (
          <TreeItemIcon>
            <FileIcon />
          </TreeItemIcon>
        ),
        false: undefined,
      }),
      tag: figma.boolean('Tag', {
        true: (
          <Tag variant="info" size="sm" className="ms-auto">
            Label
          </Tag>
        ),
        false: undefined,
      }),
      group: figma.boolean('Expandable', {
        true: <TreeItemGroup>{/* nested <TreeItem>s */}</TreeItemGroup>,
        false: undefined,
      }),
    },
    example: ({ checkbox, icon, tag, group }) => (
      <TreeItem value="node">
        <TreeItemTrigger>
          {checkbox}
          {icon}
          <TreeItemLabel>Label</TreeItemLabel>
          {tag}
        </TreeItemTrigger>
        {group}
      </TreeItem>
    ),
  }
);
