import { useState } from 'react';
import {
  SidebarSecondary,
  SidebarSecondaryContent,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuItemExtras,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
  Tag,
} from '@constructor-lab/ui-react';

export function SecondaryMenuWithTags() {
  const [activeItem, setActiveItem] = useState('feature1');

  const items = [
    { id: 'feature1', title: 'Dashboard' },
    { id: 'feature2', title: 'Analytics', tag: 'NEW' },
    { id: 'feature3', title: 'AI Assistant', tag: 'BETA' },
    { id: 'feature4', title: 'Reports' },
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
              Features
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
                  {item.tag && (
                    <SidebarSecondaryMenuItemExtras
                      variant="tag"
                      tag={
                        <Tag variant="info" size="sm">
                          {item.tag}
                        </Tag>
                      }
                    />
                  )}
                </SidebarSecondaryMenuItem>
              ))}
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    </div>
  );
}
