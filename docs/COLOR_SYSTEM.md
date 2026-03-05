# Level and Category Color System

This document explains the comprehensive color system implemented for course levels, categories, and status indicators throughout the learning management system.

## Overview

The color system provides consistent visual distinction for different course attributes, making the UI more intuitive and visually appealing. It includes predefined colors for course levels, categories, and status states.

## Components

### 1. Course Levels (`COURSE_LEVELS`)

Predefined color configurations for different course difficulty levels:

```typescript
export const COURSE_LEVELS = {
  BEGINNER: {
    name: "Beginner",
    color: "bg-green-100 text-green-800 border-green-200",
    badgeVariant: "default",
    icon: "🌱",
  },
  INTERMEDIATE: {
    name: "Intermediate", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    badgeVariant: "secondary",
    icon: "🌿",
  },
  ADVANCED: {
    name: "Advanced",
    color: "bg-purple-100 text-purple-800 border-purple-200", 
    badgeVariant: "outline",
    icon: "🌳",
  },
  EXPERT: {
    name: "Expert",
    color: "bg-red-100 text-red-800 border-red-200",
    badgeVariant: "destructive",
    icon: "🔥",
  },
} as const;
```

### 2. Categories (`CATEGORY_COLORS`)

Predefined color configurations for course categories:

```typescript
export const CATEGORY_COLORS = [
  {
    name: "Web Development",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "💻",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Mobile Development", 
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "📱",
    gradient: "from-purple-500 to-pink-500",
  },
  // ... more categories
] as const;
```

### 3. Course Status (`COURSE_STATUS`)

Predefined color configurations for course publication status:

```typescript
export const COURSE_STATUS = {
  PUBLISHED: {
    name: "Published",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✅",
  },
  DRAFT: {
    name: "Draft", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "📝",
  },
  ARCHIVED: {
    name: "Archived",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "📦",
  },
} as const;
```

## Helper Functions

### `getLevelConfig(level: string)`

Returns the configuration for a given course level.

```typescript
const levelConfig = getLevelConfig("Beginner");
// Returns: { name: "Beginner", color: "bg-green-100 text-green-800 border-green-200", ... }
```

**Features:**
- Case-insensitive matching
- Fallback to default configuration for unknown levels
- Returns consistent structure for all levels

### `getCategoryConfig(categoryName: string)`

Returns the configuration for a given category name.

```typescript
const categoryConfig = getCategoryConfig("Web Development");
// Returns: { name: "Web Development", color: "bg-blue-100 text-blue-800 border-blue-200", ... }
```

**Features:**
- Case-insensitive matching
- Fallback to hash-based color assignment for unknown categories
- Consistent color assignment based on category name

### `getStatusConfig(isPublished: boolean, isDeleted?: boolean)`

Returns the configuration for course status.

```typescript
const statusConfig = getStatusConfig(true, false);
// Returns: PUBLISHED configuration

const statusConfig = getStatusConfig(false, false);
// Returns: DRAFT configuration

const statusConfig = getStatusConfig(false, true);
// Returns: ARCHIVED configuration
```

## Usage Examples

### In React Components

#### Level Badge
```typescript
import { getLevelConfig } from "@/constants/colors";
import { Badge } from "@/components/ui/badge";

function CourseLevel({ level }: { level: string }) {
  const levelConfig = getLevelConfig(level);
  
  return (
    <Badge variant={levelConfig.badgeVariant} className={levelConfig.color}>
      <span className="flex items-center gap-1">
        <span>{levelConfig.icon}</span>
        <span>{levelConfig.name}</span>
      </span>
    </Badge>
  );
}
```

#### Category Badge
```typescript
import { getCategoryConfig } from "@/constants/colors";
import { Badge } from "@/components/ui/badge";

function CourseCategory({ category }: { category?: { name: string } }) {
  if (!category) return <Badge variant="outline">No Category</Badge>;
  
  const categoryConfig = getCategoryConfig(category.name);
  
  return (
    <Badge variant="outline" className={categoryConfig.color}>
      <span className="flex items-center gap-1">
        <span>{categoryConfig.icon}</span>
        <span>{category.name}</span>
      </span>
    </Badge>
  );
}
```

#### Status Badge
```typescript
import { getStatusConfig } from "@/constants/colors";
import { Badge } from "@/components/ui/badge";

function CourseStatus({ isPublished, isDeleted }: { 
  isPublished: boolean; 
  isDeleted?: boolean; 
}) {
  const statusConfig = getStatusConfig(isPublished, isDeleted);
  
  return (
    <Badge variant="outline" className={statusConfig.color}>
      <span className="flex items-center gap-1">
        <span>{statusConfig.icon}</span>
        <span>{statusConfig.name}</span>
      </span>
    </Badge>
  );
}
```

### In Data Tables

#### Level Column
```typescript
{
  accessorKey: "level",
  header: "Level",
  cell: ({ row }) => {
    const level = row.getValue("level") as string;
    const levelConfig = getLevelConfig(level);
    return (
      <Badge variant={levelConfig.badgeVariant} className={levelConfig.color}>
        <span className="flex items-center gap-1">
          <span>{levelConfig.icon}</span>
          <span>{levelConfig.name}</span>
        </span>
      </Badge>
    );
  },
}
```

#### Category Column
```typescript
{
  accessorKey: "category.name",
  header: "Category",
  cell: ({ row }) => {
    const category = row.original.category;
    if (!category) return <Badge variant="outline">No Category</Badge>;
    
    const categoryConfig = getCategoryConfig(category.name);
    return (
      <Badge variant="outline" className={categoryConfig.color}>
        <span className="flex items-center gap-1">
          <span>{categoryConfig.icon}</span>
          <span>{category.name}</span>
        </span>
      </Badge>
    );
  },
}
```

#### Status Column
```typescript
createStatusColumn("isPublished", (isPublished) => {
  const statusConfig = getStatusConfig(isPublished as boolean);
  return {
    label: statusConfig.name,
    className: statusConfig.color,
  };
})
```

## Color Scheme

### Level Colors
- **Beginner**: Green (🌱) - Growth and starting point
- **Intermediate**: Blue (🌿) - Progress and development
- **Advanced**: Purple (🌳) - Expertise and maturity
- **Expert**: Red (🔥) - Mastery and intensity

### Category Colors
- **Web Development**: Blue (💻) - Technology and code
- **Mobile Development**: Purple (📱) - Innovation and mobile
- **Data Science**: Green (📊) - Growth and analytics
- **Machine Learning**: Orange (🤖) - AI and intelligence
- **DevOps**: Gray (⚙️) - Infrastructure and operations
- **UI/UX Design**: Pink (🎨) - Creativity and design
- **Blockchain**: Yellow (🔗) - Finance and security
- **Cloud Computing**: Sky (☁️) - Cloud and scalability

### Status Colors
- **Published**: Green (✅) - Success and completion
- **Draft**: Yellow (📝) - Work in progress
- **Archived**: Gray (📦) - Inactive and stored

## Customization

### Adding New Levels
```typescript
export const COURSE_LEVELS = {
  // ... existing levels
  MASTER: {
    name: "Master",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    badgeVariant: "default",
    icon: "👑",
  },
} as const;
```

### Adding New Categories
```typescript
export const CATEGORY_COLORS = [
  // ... existing categories
  {
    name: "Game Development",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "🎮",
    gradient: "from-red-500 to-orange-500",
  },
] as const;
```

### Custom Color Logic
```typescript
function getCustomConfig(name: string) {
  // Custom logic for color assignment
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ["bg-red-100", "bg-blue-100", "bg-green-100"];
  return colors[hash % colors.length];
}
```

## Best Practices

### 1. Consistency
- Always use the helper functions instead of hardcoded colors
- Maintain consistent icon usage across the application
- Follow the established color patterns

### 2. Accessibility
- Colors have sufficient contrast ratios
- Icons provide additional visual context
- Text remains readable with color backgrounds

### 3. Performance
- Helper functions are optimized for performance
- Color assignments are cached and consistent
- Minimal overhead for color calculations

### 4. Maintainability
- Centralized color definitions
- Easy to update colors globally
- Type-safe color configurations

## Integration with Components

The color system integrates seamlessly with:

- **Data Tables**: Automatic color assignment for level, category, and status columns
- **Forms**: Consistent color display in course creation/editing forms
- **Cards**: Visual distinction in course cards and lists
- **Filters**: Color-coded category filters
- **Search Results**: Visual indicators in search results

## Future Enhancements

Potential improvements to consider:
- **Theme Support**: Dark/light theme variants
- **Custom Colors**: User-defined color schemes
- **Animation**: Subtle animations for color transitions
- **Color Blindness**: Alternative color schemes for accessibility
- **Brand Colors**: Integration with brand color palettes

## Migration Guide

When implementing the color system:

1. **Import Helper Functions**
   ```typescript
   import { getLevelConfig, getCategoryConfig, getStatusConfig } from "@/constants/colors";
   ```

2. **Replace Hardcoded Colors**
   ```typescript
   // Before
   <Badge className="bg-green-100 text-green-800">Beginner</Badge>
   
   // After
   const levelConfig = getLevelConfig("Beginner");
   <Badge variant={levelConfig.badgeVariant} className={levelConfig.color}>
     <span>{levelConfig.icon}</span> {levelConfig.name}
   </Badge>
   ```

3. **Update Data Tables**
   - Use helper functions in table column definitions
   - Ensure consistent color application across all tables

4. **Test Visual Consistency**
   - Verify colors appear correctly in all components
   - Test with different data combinations
   - Ensure accessibility standards are met
