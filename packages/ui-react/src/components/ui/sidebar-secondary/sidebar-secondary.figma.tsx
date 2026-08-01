// Figma Code Connect — status: COMPLETE
// Mapped to the "SidebarSecondary" component set in the ui-react Figma file
// (node 2468:59502). The set's variant property `variant`
// (options: expanded | collapsed — confirmed via get_context_for_code_connect)
// maps to the React `expanded` boolean, and its `labelHeader` /
// `labelCurrentPage` text properties to the header + breadcrumb labels. The
// `sectionList` / `footerList` Figma slots are composed children in code; in
// collapsed mode the content is the CollapsedBreadcrumb (parent → a chevron
// turned to point down the rail → current page).
import figma from '@figma/code-connect';

import {
  SidebarSecondary,
  SidebarSecondaryCollapsedBreadcrumb,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
  SidebarSecondaryMenuSubTrigger,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from './sidebar-secondary';

figma.connect(
  SidebarSecondary,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=2468-59502',
  {
    props: {
      expanded: figma.enum('variant', {
        expanded: true,
        collapsed: false,
      }),
      label: figma.string('labelHeader'),
      currentLabel: figma.string('labelCurrentPage'),
    },
    example: ({ expanded, label, currentLabel }) => (
      <SidebarSecondary expanded={expanded}>
        <SidebarSecondaryHeader label={label} />
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" selected>
                Dashboard
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuSub>
                <SidebarSecondaryMenuSubTrigger>
                  Policies
                </SidebarSecondaryMenuSubTrigger>
                <SidebarSecondaryMenuSubContent>
                  <SidebarSecondaryMenuSubItem href="#">
                    Backup
                  </SidebarSecondaryMenuSubItem>
                </SidebarSecondaryMenuSubContent>
              </SidebarSecondaryMenuSub>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryCollapsedBreadcrumb
          parentLabel={label}
          currentLabel={currentLabel}
        />
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#">
              Settings
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    ),
  }
);

// The "Section" sub-component. Its `expandable` variant (no / yes-expanded /
// yes-callapsed) maps to the React `expandable` boolean; `labelHeader` is the
// section caption. The yes-* options are both `expandable` — the open vs
// collapsed split is the runtime open state.
figma.connect(
  SidebarSecondarySection,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=2891-16563',
  {
    props: {
      expandable: figma.enum('expandable', {
        no: false,
        'yes-expanded': true,
        'yes-callapsed': true,
      }),
      label: figma.string('labelHeader'),
    },
    example: ({ expandable, label }) => (
      <SidebarSecondarySection expandable={expandable}>
        <SidebarSecondarySectionLabel>{label}</SidebarSecondarySectionLabel>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuItem href="#">
            Menu item
          </SidebarSecondaryMenuItem>
        </SidebarSecondaryMenu>
      </SidebarSecondarySection>
    ),
  }
);
