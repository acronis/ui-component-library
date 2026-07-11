import { useState } from 'react';
import {
  SidebarSecondary,
  SidebarSecondaryContent,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuItemExtras,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '@spec-lab/ui-react';

// SidebarSecondaryMenuItem only supports fixed-purpose trailing extras (tag /
// shortcut / externalLink) — there is no generic "custom trailing icon" slot.
// `externalLink` (a trailing SquareArrowUpRightIcon) is the closest built-in
// match for "an icon on the right of the row".
export function SecondaryMenuWithRightIcons() {
  const [activeItem, setActiveItem] = useState('nav1');

  const items = [
    { id: 'nav1', title: 'General Settings' },
    { id: 'nav2', title: 'Privacy & Security' },
    { id: 'nav3', title: 'Notifications' },
    { id: 'nav4', title: 'Appearance' },
  ];

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ height: '400px' }}
    >
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>
              Navigation
            </SidebarSecondarySectionLabel>
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
                  <SidebarSecondaryMenuItemExtras variant="externalLink" />
                </SidebarSecondaryMenuItem>
              ))}
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    </div>
  );
}
