'use client';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerSwipeArea,
  DrawerTitle,
  DrawerTrigger,
} from '@constructor-lab/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function DrawerDemo() {
  const mount = useShadowMount();
  return (
    <Drawer defaultOpen side="bottom">
      <DrawerTrigger
        render={<Button variant="secondary">Open drawer</Button>}
      />
      <DrawerContent portalContainer={mount}>
        <DrawerSwipeArea />
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody>
          <DrawerDescription>
            You are all caught up. Swipe the panel down to dismiss it.
          </DrawerDescription>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">Protected</dd>
            <dt className="text-muted-foreground">Last backup</dt>
            <dd className="font-medium">5 minutes ago</dd>
          </dl>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost">Close</Button>} />
          <Button>Mark all read</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
