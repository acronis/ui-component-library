// Figma Code Connect — status: COMPLETE
// Mapped to the Toolbar design (ui-react file, node 3897-7199). The Figma `state`
// variant (active | disabled) maps to the Base UI `disabled` prop; `hasCounter` /
// `hasMoreActions` / the two `ListActions` slots are composition choices realized
// by the parts dropped into the groups below.
import figma from '@figma/code-connect';

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarStatus,
} from './toolbar';

figma.connect(
  Toolbar,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3897-7199',
  {
    props: {
      disabled: figma.enum('state', { active: false, disabled: true }),
    },
    example: ({ disabled }) => (
      <Toolbar disabled={disabled}>
        <ToolbarGroup>
          <ToolbarButton>First action</ToolbarButton>
          <ToolbarButton>Second action</ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup className="ms-auto">
          <ToolbarStatus>6 items selected:</ToolbarStatus>
          <ToolbarButton>Deselect</ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    ),
  }
);
