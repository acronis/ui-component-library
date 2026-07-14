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
  FileTextIcon,
  RectangleImageIcon,
  VideoCameraIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { MusicIcon } from '../icons/missing-icons';

// SidebarSecondaryMenuItem has no built-in `disabled` prop or token — its root
// is an `<a>`, and `disabled` isn't a valid anchor attribute. Disabled rows are
// modelled the accessible way instead: no `href`/`onClick`, `aria-disabled`,
// removed from the tab order, and dimmed generically (`opacity-50`, not a
// color token — there is no disabled variant in the design).
export function SecondaryMenuWithDisabled() {
  const [activeItem, setActiveItem] = useState('opt1');

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ height: '400px' }}
    >
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>Options</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<FileTextIcon />}
                selected={activeItem === 'opt1'}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveItem('opt1');
                }}
              >
                Available Option
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                icon={<RectangleImageIcon />}
                aria-disabled="true"
                tabIndex={-1}
                className="pointer-events-none opacity-50"
              >
                Disabled Option
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                href="#"
                icon={<VideoCameraIcon />}
                selected={activeItem === 'opt3'}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveItem('opt3');
                }}
              >
                Another Available
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem
                icon={<MusicIcon />}
                aria-disabled="true"
                tabIndex={-1}
                className="pointer-events-none opacity-50"
              >
                Coming Soon
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    </div>
  );
}
