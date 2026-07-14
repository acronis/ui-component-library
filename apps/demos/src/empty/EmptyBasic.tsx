import {
  Empty,
  EmptyIcon,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@constructor-lab/ui-react';
import { InboxIcon } from '@constructor-lab/icons-react/stroke-mono';
export function EmptyBasic() {
  return (
    <div className="flex min-h-[300px] items-center justify-center border rounded-lg bg-gray-50">
      <Empty>
        <EmptyIcon className="text-primary">
          <InboxIcon className="h-[72px] w-[72px]" />
        </EmptyIcon>
        <EmptyHeader>
          <EmptyTitle>No messages</EmptyTitle>
          <EmptyDescription>
            You don&apos;t have any messages yet. When you receive messages,
            they will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
