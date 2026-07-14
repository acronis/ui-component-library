import { ButtonIcon } from '@constructor-lab/ui-react';
import { CogIcon } from '@constructor-lab/icons-react/stroke-mono';
import { Switch } from '@constructor-lab/ui-react';

interface ChatHeaderProps {
  hasMessages: boolean;
}

export function ChatHeader({ hasMessages }: ChatHeaderProps) {
  return (
    <div
      className={`border-b px-6 py-4 ${
        hasMessages
          ? 'border-border bg-background'
          : 'border-transparent bg-[#F5F7FA]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base">
            <span className="font-semibold">Constructor Lab</span>{' '}
            <span className="font-normal text-muted-foreground">CyberChat</span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {hasMessages && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Temporary chat
              </span>
              <Switch />
            </div>
          )}
          <ButtonIcon variant="ghost" aria-label="Settings">
            <CogIcon className="h-5 w-5" />
          </ButtonIcon>
        </div>
      </div>
    </div>
  );
}
