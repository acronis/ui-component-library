'use client';

import {
  Button,
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSubmenu,
  MenuSubmenuContent,
  MenuSubmenuTrigger,
  MenuTrigger,
} from '@spec-lab/ui-react';
import {
  BinIcon,
  FilesIcon,
  FolderIcon,
  PencilIcon,
} from '@spec-lab/icons-react/stroke-mono';
import { useShadowMount } from '@/components/ShadowDemo';

export function MenuDemo() {
  const mount = useShadowMount();
  return (
    <Menu defaultOpen>
      <MenuTrigger render={<Button variant="secondary">Open menu</Button>} />
      <MenuContent portalContainer={mount} style={{ width: 224 }}>
        <MenuSection>
          <MenuItem icon={<PencilIcon />} shortcut="⌘R">
            Rename
          </MenuItem>
          <MenuItem icon={<FilesIcon />} shortcut="⌘C">
            Copy
          </MenuItem>
          <MenuSubmenu>
            <MenuSubmenuTrigger icon={<FolderIcon />}>
              Move to
            </MenuSubmenuTrigger>
            <MenuSubmenuContent portalContainer={mount}>
              <MenuSection>
                <MenuItem>Documents</MenuItem>
                <MenuItem>Downloads</MenuItem>
              </MenuSection>
            </MenuSubmenuContent>
          </MenuSubmenu>
        </MenuSection>
        <MenuSection>
          <MenuItem icon={<BinIcon />}>Delete</MenuItem>
        </MenuSection>
      </MenuContent>
    </Menu>
  );
}
