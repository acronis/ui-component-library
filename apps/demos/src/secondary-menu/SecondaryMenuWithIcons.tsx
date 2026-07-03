import { useState } from 'react';
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
} from '@spec-lab/shadcn-uikit/react';
import { BellIcon, CogIcon, EnvelopeIcon, FolderHouseIcon, UserIcon } from '@spec-lab/icons-react/stroke-mono'
export function SecondaryMenuWithIcons() {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <div
      className="border rounded-lg overflow-hidden"
      style={{ height: '400px' }}
    >
      <SecondaryMenu>
        <SecondaryMenuContent>
          <SecondaryMenuGroup>
            <SecondaryMenuItem
              active={activeItem === 'home'}
              onClick={() => setActiveItem('home')}
              icon={<FolderHouseIcon className="h-4 w-4" />}
            >
              Home
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'profile'}
              onClick={() => setActiveItem('profile')}
              icon={<UserIcon className="h-4 w-4" />}
            >
              Profile
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'notifications'}
              onClick={() => setActiveItem('notifications')}
              icon={<BellIcon className="h-4 w-4" />}
            >
              Notifications
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'messages'}
              onClick={() => setActiveItem('messages')}
              icon={<EnvelopeIcon className="h-4 w-4" />}
            >
              Messages
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeItem === 'config'}
              onClick={() => setActiveItem('config')}
              icon={<CogIcon className="h-4 w-4" />}
            >
              Configuration
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>
      </SecondaryMenu>
    </div>
  );
}
