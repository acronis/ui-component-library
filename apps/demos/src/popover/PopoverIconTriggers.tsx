import { ButtonIcon } from '@constructor-lab/ui-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@constructor-lab/ui-react';
import {
  BellIcon,
  CircleHelpIcon,
  CogIcon,
  UserIcon,
} from '@constructor-lab/icons-react/stroke-mono';
export function PopoverIconTriggers() {
  return (
    <div className="flex flex-wrap justify-center gap-4 rounded-lg border p-8">
      <Popover>
        <PopoverTrigger
          render={<ButtonIcon aria-label="Help" variant="ghost" />}
        >
          <CircleHelpIcon />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Help</h4>
            <p className="text-sm text-muted-foreground">
              Need assistance? Click here to access our help documentation and
              support resources.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={<ButtonIcon aria-label="Settings" variant="ghost" />}
        >
          <CogIcon />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Customize your preferences and configure application settings.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={<ButtonIcon aria-label="Notifications" variant="ghost" />}
        >
          <BellIcon />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have 3 new notifications. Click to view all.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={<ButtonIcon aria-label="Profile" variant="ghost" />}
        >
          <UserIcon />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Profile</h4>
            <p className="text-sm text-muted-foreground">
              View and edit your profile information.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
