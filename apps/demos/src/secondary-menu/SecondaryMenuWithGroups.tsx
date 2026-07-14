import { useState } from 'react';
import {
  SidebarSecondary,
  SidebarSecondaryContent,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '@constructor-lab/ui-react';
import {
  ArrowInDownIcon,
  ArrowOutUpIcon,
  BinIcon,
  FileTextIcon,
  PencilIcon,
  RectangleImageIcon,
  VideoCameraIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { MusicIcon } from '../icons/missing-icons';

export function SecondaryMenuWithGroups() {
  const [activeItem, setActiveItem] = useState('documents');

  const contentItems = [
    { id: 'documents', title: 'Documents', icon: FileTextIcon },
    { id: 'images', title: 'Images', icon: RectangleImageIcon },
    { id: 'videos', title: 'Videos', icon: VideoCameraIcon },
    { id: 'audio', title: 'Audio Files', icon: MusicIcon },
  ];

  const actionItems = [
    { id: 'upload', title: 'Upload', icon: ArrowOutUpIcon },
    { id: 'download', title: 'Download', icon: ArrowInDownIcon },
    { id: 'edit', title: 'Edit', icon: PencilIcon },
    { id: 'delete', title: 'Delete', icon: BinIcon },
  ];

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ height: '500px' }}
    >
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>Content</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              {contentItems.map((item) => (
                <SidebarSecondaryMenuItem
                  key={item.id}
                  href="#"
                  icon={<item.icon />}
                  selected={activeItem === item.id}
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveItem(item.id);
                  }}
                >
                  {item.title}
                </SidebarSecondaryMenuItem>
              ))}
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>

          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>Actions</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              {actionItems.map((item) => (
                <SidebarSecondaryMenuItem
                  key={item.id}
                  href="#"
                  icon={<item.icon />}
                  selected={activeItem === item.id}
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveItem(item.id);
                  }}
                >
                  {item.title}
                </SidebarSecondaryMenuItem>
              ))}
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    </div>
  );
}
