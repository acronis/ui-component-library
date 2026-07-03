import { useState } from 'react';
import {
  Button,
  SidebarSecondary,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '@spec-lab/ui-react';

import { ArrowInDownIcon, ArrowOutUpIcon, FileTextIcon, RectangleImageIcon } from '@spec-lab/icons-react/stroke-mono'
export function SecondaryMenuComplete() {
  const [activeItem, setActiveItem] = useState('recent1');

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ height: '500px' }}
    >
      <SidebarSecondary>
        <SidebarSecondaryHeader label="File Manager" />

        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>Recent</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<FileTextIcon />}
                selected={activeItem === 'recent1'}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveItem('recent1');
                }}
              >
                Project Proposal
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<RectangleImageIcon />}
                selected={activeItem === 'recent2'}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveItem('recent2');
                }}
              >
                Design Mockups
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>

          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>Folders</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<FileTextIcon />}
                selected={activeItem === 'folder1'}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveItem('folder1');
                }}
              >
                Documents
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<RectangleImageIcon />}
                selected={activeItem === 'folder2'}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveItem('folder2');
                }}
              >
                Media
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<ArrowInDownIcon />}
                selected={activeItem === 'folder3'}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveItem('folder3');
                }}
              >
                Downloads
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>

        <SidebarSecondaryFooter className="px-[var(--ui-sidebar-secondary-menu-item-global-container-padding-x)]">
          <Button variant="secondary" className="w-full">
            <ArrowOutUpIcon />
            Upload Files
          </Button>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    </div>
  );
}
