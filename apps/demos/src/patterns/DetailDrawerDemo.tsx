import { useState } from 'react';
import {
  Button,
  DescriptionList,
  DescriptionListItem,
  DescriptionListLabel,
  DescriptionListValue,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Separator,
  Spinner,
} from '@constructor-lab/ui-react';

type ContentState = 'content' | 'loading' | 'empty';

const properties = [
  { label: 'Status', value: 'Protected' },
  { label: 'Type', value: 'Server' },
  { label: 'Last backup', value: '5 minutes ago' },
  { label: 'Owner', value: 'ken99@example.com' },
];

const STATES: { id: ContentState; label: string }[] = [
  { id: 'content', label: 'Details' },
  { id: 'loading', label: 'Loading' },
  { id: 'empty', label: 'Empty' },
];

export interface DetailDrawerDemoProps {
  // Where the drawer overlay portals to. In shadow-root hosts (docs preview)
  // pass the shadow mount so the drawer inherits its styles; omit it in a
  // regular document (Vite portal) to portal to document.body.
  portalContainer?: HTMLElement | null;
}

export function DetailDrawerDemo({
  portalContainer,
}: DetailDrawerDemoProps = {}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ContentState>('content');

  const show = (s: ContentState) => {
    setState(s);
    setOpen(true);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {STATES.map((s) => (
        <Button key={s.id} variant="secondary" onClick={() => show(s.id)}>
          {s.label}
        </Button>
      ))}

      <Drawer open={open} onOpenChange={setOpen} side="right">
        <DrawerContent side="right" portalContainer={portalContainer}>
          <DrawerHeader>
            <DrawerTitle>db-prod-01</DrawerTitle>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody>
            {state === 'loading' ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : state === 'empty' ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Nothing to show</EmptyTitle>
                  <EmptyDescription>
                    This item has no details yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DescriptionList>
                {properties.map((p) => (
                  <DescriptionListItem key={p.label}>
                    <DescriptionListLabel className="text-muted-foreground">
                      {p.label}
                    </DescriptionListLabel>
                    <DescriptionListValue className="font-medium">
                      {p.value}
                    </DescriptionListValue>
                  </DescriptionListItem>
                ))}
              </DescriptionList>
            )}
          </DrawerBody>
          <Separator />
          <DrawerFooter>
            <DrawerClose render={<Button variant="ghost">Close</Button>} />
            <Button>Edit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
