import { useState } from 'react';
import {
  SidebarSecondary,
  SidebarSecondaryContent,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondarySection,
} from '@constructor-lab/ui-react';

export function SecondaryMenuBasic() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const items = [
    { id: 'dashboard', title: 'Dashboard' },
    { id: 'analytics', title: 'Analytics' },
    { id: 'reports', title: 'Reports' },
    { id: 'settings', title: 'Settings' },
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
