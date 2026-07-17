import * as React from 'react';
import {
  BoxDashedIcon,
  PlusIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import {
  Button,
  ConfirmDialog,
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderRow,
  PageHeaderTitle,
} from '@constructor-lab/ui-react';
import { DataTable } from './DataTable';
import { NewRowDialog } from './NewRowDialog';
import { DetailView } from './DetailView';
import { useTableData } from '../../hooks/useTableData';
import { useLocale } from '../../context/LocaleContext';
import type { DataRow, DataRowFormData } from '../../types';

type PendingDelete =
  { kind: 'single'; id: string } | { kind: 'bulk'; ids: string[] };

export function DataTablePage() {
  const { t } = useLocale();
  const { data, isLoading, addRow, updateRow, deleteRow, deleteRows } =
    useTableData();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<DataRow | null>(null);
  const [pendingDelete, setPendingDelete] =
    React.useState<PendingDelete | null>(null);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>(
    'create'
  );

  const handleCreate = () => {
    setSelectedRow(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (row: DataRow) => {
    setSelectedRow(row);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (row: DataRow) => {
    setSelectedRow(row);
    setDetailOpen(true);
  };

  const handleDelete = (id: string) => {
    setPendingDelete({ kind: 'single', id });
  };

  const handleBulkDelete = (ids: string[]) => {
    if (ids.length > 0) {
      setPendingDelete({ kind: 'bulk', ids });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === 'single') {
      await deleteRow(pendingDelete.id);
    } else {
      await deleteRows(pendingDelete.ids);
    }
    setPendingDelete(null);
  };

  const handleSubmit = async (formData: DataRowFormData) => {
    if (dialogMode === 'create') {
      await addRow(formData);
    } else if (selectedRow) {
      await updateRow(selectedRow.id, formData);
    }
  };

  const deleteCount =
    pendingDelete?.kind === 'bulk' ? pendingDelete.ids.length : 1;
  const isEmpty = !isLoading && data.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>{t('navigation.data')}</PageHeaderTitle>
          <PageHeaderActions>
            <Button onClick={handleCreate}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New item
            </Button>
          </PageHeaderActions>
        </PageHeaderRow>
        <PageHeaderDescription>
          Browse, filter, and manage your data records.
        </PageHeaderDescription>
      </PageHeader>

      {isEmpty ? (
        <Empty className="mx-auto py-16">
          <EmptyHeader>
            <EmptyIcon>
              <BoxDashedIcon />
            </EmptyIcon>
            <EmptyTitle>No data yet</EmptyTitle>
            <EmptyDescription>
              Get started by creating your first data record.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyActions>
            <Button onClick={handleCreate}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New item
            </Button>
          </EmptyActions>
        </Empty>
      ) : (
        <DataTable
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onBulkDelete={handleBulkDelete}
          isLoading={isLoading}
        />
      )}

      <NewRowDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={
          selectedRow
            ? {
                name: selectedRow.name,
                status: selectedRow.status,
                category: selectedRow.category,
                value: selectedRow.value,
                description: selectedRow.description,
                tags: selectedRow.tags,
              }
            : undefined
        }
        mode={dialogMode}
      />

      <DetailView
        row={selectedRow}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={(row) => {
          setDetailOpen(false);
          handleEdit(row);
        }}
        onDelete={handleDelete}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title={
          deleteCount > 1 ? `Delete ${deleteCount} items?` : 'Delete item?'
        }
        description="This action cannot be undone."
        destructive
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
