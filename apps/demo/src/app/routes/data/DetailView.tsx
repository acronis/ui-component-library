import { BinIcon, PencilIcon } from '@constructor-lab/icons-react/stroke-mono';
import {
  Badge,
  type BadgeProps,
  Button,
  SheetDetails,
  type SheetDetailsProperty,
} from '@constructor-lab/ui-react';
import { format } from 'date-fns';
import type { DataRow } from '../../types';

interface DetailViewProps {
  row: DataRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (row: DataRow) => void;
  onDelete: (id: string) => void;
}

const statusVariant: Record<DataRow['status'], BadgeProps['variant']> = {
  active: 'success',
  inactive: 'neutral',
  pending: 'warning',
};

// The row detail panel — the `sheet-detail-panel` pattern via the `SheetDetails`
// preset. Instead of hand-rolling a `<dl>` inside a Sheet, we hand the preset a
// `properties` list (rendered as a description list) and the footer `actions`.
export function DetailView({
  row,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: DetailViewProps) {
  if (!row) return null;

  const properties: SheetDetailsProperty[] = [
    {
      label: 'Status',
      value: (
        <Badge variant={statusVariant[row.status]} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
    { label: 'Category', value: row.category },
    { label: 'Value', value: `$${row.value.toLocaleString()}` },
    ...(row.description
      ? [{ label: 'Description', value: row.description }]
      : []),
    { label: 'Created', value: format(row.createdAt, 'PPpp') },
    { label: 'Updated', value: format(row.updatedAt, 'PPpp') },
    ...(row.tags && row.tags.length > 0
      ? [
          {
            label: 'Tags',
            value: (
              <div className="flex flex-wrap gap-2">
                {row.tags.map((tag) => (
                  <Badge key={tag} variant="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <SheetDetails
      open={open}
      onOpenChange={(nextOpen) => onOpenChange(nextOpen)}
      title={row.name}
      properties={properties}
      actions={
        <>
          <Button onClick={() => onEdit(row)} className="flex-1">
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(row.id);
              onOpenChange(false);
            }}
            className="flex-1"
          >
            <BinIcon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </>
      }
    />
  );
}
