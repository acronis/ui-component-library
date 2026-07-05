// Figma Code Connect — status: COMPLETE
// Mapped to the "ButtonMenuDropdown" node in the ui-react Figma file: the open
// dropdown surface a ButtonMenu reveals.
import figma from '@figma/code-connect';

import {
  ButtonMenuDropdown,
  ButtonMenuDropdownContent,
  ButtonMenuDropdownItem,
  ButtonMenuDropdownSection,
  ButtonMenuDropdownTrigger,
} from './button-menu-dropdown';

figma.connect(
  ButtonMenuDropdown,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3116-60887',
  {
    props: {
      // The optional search field is deferred in code (not built yet).
      hasSearch: figma.boolean('hasSearch'),
      // The sections/items slot — assembled from the composable parts below.
      sectionList: figma.children('*'),
    },
    example: () => (
      <ButtonMenuDropdown defaultOpen>
        <ButtonMenuDropdownTrigger>Actions</ButtonMenuDropdownTrigger>
        <ButtonMenuDropdownContent>
          <ButtonMenuDropdownSection>
            <ButtonMenuDropdownItem>Rename</ButtonMenuDropdownItem>
            <ButtonMenuDropdownItem shortcut="⌘C">Copy</ButtonMenuDropdownItem>
            <ButtonMenuDropdownItem cascade>Move to</ButtonMenuDropdownItem>
          </ButtonMenuDropdownSection>
        </ButtonMenuDropdownContent>
      </ButtonMenuDropdown>
    ),
  }
);
