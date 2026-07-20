import {
  Empty,
  EmptyIcon,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
  EmptyLinks,
} from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';
import { CircleWarningIcon } from '@constructor-lab/icons-react/stroke-mono';
export function EmptyDiscoveryAgent() {
  return (
    <div className="flex min-h-[350px] items-center justify-center border rounded-lg bg-gray-50">
      <Empty>
        <EmptyIcon className="h-24 w-24">
          <CircleWarningIcon className="text-[#2668C5]" />
        </EmptyIcon>
        <EmptyHeader>
          <EmptyTitle>Discovery agent</EmptyTitle>
          <EmptyDescription>
            The discovery agent will locate the Hyper-V addresses for using
            NetBIOS discovery, and Service Discovery (SRVS), and UI Components library
            Resource Protocol (ARP) table.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyActions>
          <Button>Configure</Button>
          <EmptyLinks>
            <a
              href="#"
              className="text-sm font-semibold text-[#2668C5] hover:underline"
            >
              Learn more
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-[#2668C5] hover:underline"
            >
              Settings
            </a>
          </EmptyLinks>
        </EmptyActions>
      </Empty>
    </div>
  );
}
