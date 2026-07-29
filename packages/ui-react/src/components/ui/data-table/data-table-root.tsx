import { createContext, useContext, type PropsWithChildren } from 'react';

import type { DataTableController } from './data-table-controller';

const DataTableControllerContext = createContext<
  DataTableController<unknown> | undefined
>(undefined);

export interface DataTableRootProps<
  TData,
  RowId extends string = string,
> extends PropsWithChildren {
  readonly table: DataTableController<TData, RowId>;
}

export function DataTableRoot<TData, RowId extends string = string>({
  children,
  table,
}: DataTableRootProps<TData, RowId>) {
  return (
    // React 18-compatible provider syntax is intentional; the peer range
    // includes React 18 even though React 19 permits rendering the context.
    // eslint-disable-next-line @eslint-react/no-context-provider
    <DataTableControllerContext.Provider
      value={table as unknown as DataTableController<unknown>}
    >
      {children}
    </DataTableControllerContext.Provider>
  );
}

export function useDataTableRoot<
  TData,
  RowId extends string = string,
>(): DataTableController<TData, RowId> {
  // React.useContext remains required while the peer range includes React 18.
  // eslint-disable-next-line @eslint-react/no-use-context
  const controller = useContext(DataTableControllerContext);

  if (controller === undefined) {
    throw new TypeError(
      'DataTable components must be rendered inside DataTableRoot.'
    );
  }

  return controller as unknown as DataTableController<TData, RowId>;
}
