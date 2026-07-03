import {
  Empty,
  EmptyIcon,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
  EmptyLinks,
} from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import { MagnifierIcon } from '@spec-lab/icons-react/stroke-mono'
export function EmptyWithButtonAndLink() {
  return (
    <div className="flex min-h-[300px] items-center justify-center border rounded-lg bg-gray-50">
      <Empty>
        <EmptyIcon className="h-24 w-24">
          <MagnifierIcon className="text-[#2668C5]" />
        </EmptyIcon>
        <EmptyHeader>
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>
            We couldn&apos;t find any results matching your search. Try
            adjusting your filters.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyActions>
          <Button>Clear Filters</Button>
          <EmptyLinks>
            <a
              href="#"
              className="text-sm font-semibold text-[#2668C5] hover:underline"
            >
              View all items
            </a>
          </EmptyLinks>
        </EmptyActions>
      </Empty>
    </div>
  );
}
