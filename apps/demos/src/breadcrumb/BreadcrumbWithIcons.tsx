import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@constructor-lab/ui-react';
import {
  FileIcon,
  FolderHouseIcon,
  FolderIcon,
} from '@constructor-lab/icons-react/stroke-mono';
export function BreadcrumbWithIcons() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-2">
            <FolderHouseIcon className="w-4 h-4" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/folder" className="flex items-center gap-2">
            <FolderIcon className="w-4 h-4" />
            Folder
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2">
            <FileIcon className="w-4 h-4" />
            File
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
