import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogBody,
  DialogCloseButton,
  DialogTrigger,
} from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

export function DialogSizes() {
  return (
    <div className="flex flex-wrap gap-4">
      <Dialog>
        <DialogTrigger render={<Button variant="secondary" />}>
          Small (464px)
        </DialogTrigger>
        <DialogContent size="xs">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-gray-600">
              This is a small dialog (464px width).
            </p>
          </DialogBody>
          <DialogFooter>
            <Button>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<Button variant="secondary" />}>
          Medium (672px)
        </DialogTrigger>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Medium Dialog</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-gray-600">
              This is a medium dialog (672px width).
            </p>
          </DialogBody>
          <DialogFooter>
            <Button>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<Button variant="secondary" />}>
          Large (832px)
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-gray-600">
              This is a large dialog (832px width).
            </p>
          </DialogBody>
          <DialogFooter>
            <Button>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
