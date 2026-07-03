import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogBody,
  DialogCloseButton,
  DialogTrigger,
} from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import { CircleWarningIcon } from '@spec-lab/icons-react/stroke-mono'
export function DialogConfirmation() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        Delete Item
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <div className="flex items-start gap-4">
            <CircleWarningIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Are you sure you want to delete this item?
              </p>
              <p className="text-sm text-gray-600">
                This action cannot be undone. This will permanently delete the
                item and remove all associated data.
              </p>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogTrigger render={<Button variant="secondary" />}>
            Cancel
          </DialogTrigger>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
