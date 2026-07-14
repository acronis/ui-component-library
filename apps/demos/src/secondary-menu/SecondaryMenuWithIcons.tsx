import { useState } from 'react';
import {
  SidebarSecondary,
  SidebarSecondaryContent,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondarySection,
} from '@constructor-lab/ui-react';
import {
  BellIcon,
  CogIcon,
  EnvelopeIcon,
  FolderHouseIcon,
  UserIcon,
} from '@constructor-lab/icons-react/stroke-mono';

export function SecondaryMenuWithIcons() {
  const [activeItem, setActiveItem] = useState('home');

  const items = [
    { id: 'home', title: 'Home', icon: FolderHouseIcon },
    { id: 'profile', title: 'Profile', icon: UserIcon },
    { id: 'notifications', title: 'Notifications', icon: BellIcon },
    { id: 'messages', title: 'Messages', icon: EnvelopeIcon },
    { id: 'config', title: 'Configuration', icon: CogIcon },
  ];

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ height: '400px' }}
    >
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              {items.map((item) => (
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
