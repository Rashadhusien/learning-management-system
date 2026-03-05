# Global Reusable Data Table System

This document explains how to use the global reusable data table system implemented in the learning management system.

## Overview

The data table system is built on top of [TanStack Table](https://tanstack.com/table) and provides a consistent, feature-rich table component that can be used throughout the application.

## Components

### 1. DataTable (`components/ui/data-table.tsx`)

The main reusable table component with the following features:
- **Sorting**: Click column headers to sort
- **Filtering**: Global search functionality
- **Pagination**: Navigate through large datasets
- **Column Visibility**: Show/hide columns dynamically
- **Row Selection**: Optional checkbox selection
- **Responsive Design**: Works on all screen sizes

#### Props

```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];     // Table column definitions
  data: TData[];                           // Table data
  searchKey?: string;                     // Field to search on
  searchPlaceholder?: string;              // Search input placeholder
  enableColumnFilter?: boolean;            // Enable column visibility toggle
  enableRowSelection?: boolean;            // Enable checkbox selection
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  onRowClick?: (row: TData) => void;       // Handle row clicks
  emptyMessage?: string;                   // Message when no data
}
```

### 2. Table Columns Utilities (`components/ui/table-columns.tsx`)

Helper functions to create common column types:

#### Action Columns
```typescript
// Generic actions column with dropdown menu
createActionsColumn<T>(actions: ActionColumn<T>[])

// Pre-defined action creators
createEditAction<T>(onEdit: (row: T) => void)
createDeleteAction<T>(onDelete: (row: T) => void)
createViewAction<T>(onView: (row: T) => void)
```

#### Specialized Columns
```typescript
// Status column with colored badges
createStatusColumn<T>(accessorKey, getStatusConfig)

// Date column with formatting
createDateColumn<T>(accessorKey, header?)

// Currency column with formatting
createCurrencyColumn<T>(accessorKey, header?)
```

### 3. Example Tables

#### CategoriesTable (`components/tables/CategoriesTable.tsx`)
Example implementation for categories management:
- Name with icon badges
- Description with truncation
- Status badges (Active/Deleted)
- Creation date
- Edit/Delete actions

#### CoursesTable (`components/tables/CoursesTable.tsx`)
Example implementation for courses management:
- Title and description
- Level badges
- Price formatting
- Duration display
- Publication status
- View/Edit/Delete actions

## Usage Examples

### Basic Usage

```typescript
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export function UsersTable({ data }: { data: User[] }) {
  return (
    <DataTable 
      columns={columns} 
      data={data}
      searchKey="name"
      searchPlaceholder="Search users..."
    />
  );
}
```

### Advanced Usage with Actions

```typescript
import { 
  createActionsColumn, 
  createStatusColumn,
  createEditAction,
  createDeleteAction 
} from "@/components/ui/table-columns";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  createStatusColumn(
    "isActive",
    (isActive) => ({
      label: isActive ? "Active" : "Inactive",
      className: isActive ? "bg-green-100" : "bg-red-100",
    })
  ),
  createActionsColumn([
    createEditAction((user) => console.log("Edit:", user)),
    createDeleteAction((user) => console.log("Delete:", user)),
  ]),
];
```

### Custom Column Rendering

```typescript
const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: "Course",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.getValue("title")}</span>
        <Badge variant="secondary">{row.original.level}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    },
  },
];
```

## Features

### 1. Global Search
- Search across any specified field
- Real-time filtering
- Custom placeholder text

### 2. Column Management
- Show/hide columns dynamically
- Persistent column visibility state
- Responsive column hiding

### 3. Sorting
- Multi-column sorting support
- Visual sorting indicators
- Accessible sorting controls

### 4. Pagination
- Customizable page size
- Navigation controls
- Row count display

### 5. Row Selection
- Checkbox selection
- Select all functionality
- Selection callbacks

### 6. Actions
- Dropdown menu for row actions
- Custom action buttons
- Disabled state support

## Styling

The table uses Tailwind CSS classes and follows the shadcn/ui design system:

```css
/* Container */
.w-full                    /* Full width */
.rounded-md border         /* Rounded border */

/* Header */
.font-medium               /* Bold headers */
.text-muted-foreground     /* Muted colors */

/* Cells */
.py-4 px-4                /* Cell padding */
.truncate                 /* Text truncation */

/* Interactive elements */
.cursor-pointer            /* Clickable rows */
.hover:bg-muted/50         /* Hover effects */
```

## Accessibility

The table component includes:
- Semantic HTML structure
- ARIA labels and attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Performance

- **Virtualization**: Ready for large datasets (can be added)
- **Memoization**: Optimized re-renders
- **Lazy Loading**: Supports incremental data loading
- **Efficient Updates**: Minimal DOM manipulation

## Best Practices

1. **Column Definitions**: Keep column logic separate and reusable
2. **Data Types**: Use proper TypeScript types for data
3. **Loading States**: Handle loading and error states
4. **Empty States**: Provide meaningful empty messages
5. **Accessibility**: Include proper labels and descriptions

## Migration from Existing Tables

To migrate existing table implementations:

1. **Import the DataTable component**
2. **Convert column definitions to TanStack Table format**
3. **Use helper functions for common patterns**
4. **Replace custom pagination/sorting logic**
5. **Update styling to match design system**

## Future Enhancements

Potential improvements to consider:
- **Virtual Scrolling**: For very large datasets
- **Export Functionality**: CSV/Excel export
- **Advanced Filtering**: Column-specific filters
- **Row Expansion**: Expandable row details
- **Drag & Drop**: Reorderable columns
- **Cell Editing**: Inline editing capabilities
