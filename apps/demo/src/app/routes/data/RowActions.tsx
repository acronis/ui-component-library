import * as React from 'react';
import { BinIcon, EllipsisIcon, EyeIcon, PencilIcon } from '@spec-lab/icons-react/stroke-mono'
import { ButtonIcon } from '@spec-lab/ui-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@spec-lab/ui-react';
import type { DataRow } from '../../types';

interface RowActionsProps {
  row: DataRow;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export function RowActions({ onEdit, onDelete, onView }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<ButtonIcon variant="ghost" aria-label="Open menu" />}
      >
        <EllipsisIcon className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onView}>
          <EyeIcon className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <PencilIcon className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <BinIcon className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
