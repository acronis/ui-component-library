import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@constructor-lab/ui-react';
import {
  FileIcon,
  FolderHouseIcon,
  FolderIcon,
} from '@constructor-lab/icons-react/stroke-mono';
export function BreadcrumbIconsEllipsis() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-2">
            <FolderHouseIcon className="w-4 h-4" />
            First
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/fifth" className="flex items-center gap-2">
            <FolderIcon className="w-4 h-4" />
            Fifth
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/sixth" className="flex items-center gap-2">
            <FolderIcon className="w-4 h-4" />
            Sixth
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/seventh" className="flex items-center gap-2">
            <FolderIcon className="w-4 h-4" />
            Seventh
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2">
            <FileIcon className="w-4 h-4" />
            Active
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
