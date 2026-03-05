# Category-Related Courses API

This document explains the enhanced course functions that include category information and allow filtering courses by category.

## Overview

The course system has been enhanced to include category information in course queries and provide functions to filter courses by category. This enables better organization and display of courses with their associated categories.

## Updated Functions

### 1. getAllCourses()

**Enhanced to include category information**

```typescript
export async function getAllCourses(): Promise<ActionResponse<Course[]>>
```

**Returns**: All courses with their associated category information

**Example Response**:
```typescript
{
  success: true,
  data: [
    {
      id: "course-123",
      title: "Introduction to React",
      description: "Learn React fundamentals",
      price: 99,
      isPublished: true,
      bannerUrl: "https://example.com/banner.jpg",
      duration: 40,
      level: "Beginner",
      categoryId: "cat-123",
      instructorId: "inst-123",
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: "cat-123",
        name: "Web Development",
        description: "Learn modern web development",
        icon: "💻"
      }
    }
  ]
}
```

**Features**:
- Includes full category object for each course
- Filters out deleted courses (`isDeleted: false`)
- Uses LEFT JOIN to include courses without categories
- Returns category as optional field

### 2. getCoursesByCategory()

**New function to get courses by specific category**

```typescript
export async function getCoursesByCategory(categoryId: string): Promise<ActionResponse<Course[]>>
```

**Parameters**:
- `categoryId`: The ID of the category to filter courses by

**Returns**: Courses belonging to the specified category

**Example Usage**:
```typescript
const result = await getCoursesByCategory("cat-123");
if (result.success && result.data) {
  console.log(`Found ${result.data.length} courses in this category`);
  result.data.forEach(course => {
    console.log(`${course.title} - ${course.category?.name}`);
  });
}
```

**Features**:
- Filters by specific category ID
- Includes category information
- Filters out deleted courses
- Returns empty array if no courses found

### 3. getCourseById()

**Enhanced to include category information**

```typescript
export async function getCourseById(courseId: string): Promise<ActionResponse<Course>>
```

**Parameters**:
- `courseId`: The ID of the course to retrieve

**Returns**: Single course with category information

**Example Usage**:
```typescript
const result = await getCourseById("course-123");
if (result.success && result.data) {
  const course = result.data;
  console.log(`Course: ${course.title}`);
  console.log(`Category: ${course.category?.name || "No category"}`);
}
```

**Features**:
- Returns single course by ID
- Includes category information
- Returns error if course not found
- Filters out deleted courses

## Updated Type Definitions

### Course Interface

```typescript
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  isPublished: boolean;
  bannerUrl: string;
  duration: number;
  level: string;
  categoryId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  instructorId: string;
  category?: {                    // NEW: Optional category object
    id: string;
    name: string;
    description?: string;
    icon?: string;
  };
}
```

## Usage Examples

### Displaying Courses with Categories

```typescript
"use client";

import { useEffect, useState } from "react";
import { getAllCourses, getCoursesByCategory } from "@/lib/actions/courses.action";
import { Course } from "@/types/action.d";

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (selectedCategory) {
        const result = await getCoursesByCategory(selectedCategory);
        if (result.success) setCourses(result.data || []);
      } else {
        const result = await getAllCourses();
        if (result.success) setCourses(result.data || []);
      }
    };

    fetchCourses();
  }, [selectedCategory]);

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          {course.category && (
            <span className="category-badge">
              {course.category.icon} {course.category.name}
            </span>
          )}
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Category Filter Component

```typescript
"use client";

import { getAllCourses } from "@/lib/actions/courses.action";

export function CategoryFilter() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllCourses();
      if (result.success && result.data) {
        setCourses(result.data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(
            result.data
              .filter(course => course.category)
              .map(course => course.category!)
          )
        );
        setCategories(uniqueCategories);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <button onClick={() => setSelectedCategory(null)}>All Courses</button>
      {categories.map(category => (
        <button 
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
        >
          {category.icon} {category.name}
        </button>
      ))}
    </div>
  );
}
```

### Course Card with Category

```typescript
interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="course-card">
      <img src={course.bannerUrl} alt={course.title} />
      <div className="course-content">
        <h3>{course.title}</h3>
        
        {/* Category Badge */}
        {course.category && (
          <div className="category-badge">
            {course.category.icon && (
              <span className="category-icon">{course.category.icon}</span>
            )}
            <span className="category-name">{course.category.name}</span>
          </div>
        )}
        
        <p>{course.description}</p>
        <div className="course-meta">
          <span>Duration: {course.duration}h</span>
          <span>Level: {course.level}</span>
          <span>Price: ${course.price}</span>
        </div>
      </div>
    </div>
  );
}
```

## Database Schema Relationships

The enhanced functions utilize the following database relationship:

```sql
courses
├── id (uuid, primary key)
├── title (text)
├── description (text)
├── price (integer)
├── categoryId (uuid, foreign key → categories.id)
├── ... other fields
└── isDeleted (boolean)

categories
├── id (uuid, primary key)
├── name (text, unique)
├── description (text)
├── icon (text)
└── ... other fields
```

## Performance Considerations

### Indexing
- Ensure `courses.categoryId` is indexed for faster category filtering
- Ensure `courses.isDeleted` is indexed for filtering deleted courses

### Query Optimization
- Functions use LEFT JOIN to include courses without categories
- WHERE clauses filter deleted courses at database level
- Only select required fields to reduce data transfer

### Caching
- Consider caching category information as it changes infrequently
- Use Next.js revalidation for cache invalidation

## Error Handling

All functions return consistent error responses:

```typescript
// Success Response
{
  success: true,
  data: Course[] | Course
}

// Error Response
{
  success: false,
  error: {
    message: "Error description",
    details?: { [key: string]: string[] }
  }
}
```

## Best Practices

### 1. Handle Missing Categories
```typescript
// Good - Handle optional category
const categoryName = course.category?.name || "Uncategorized";

// Avoid - Potential runtime error
const categoryName = course.category.name; // May throw error
```

### 2. Type Safety
```typescript
// Good - Check success before accessing data
const result = await getAllCourses();
if (result.success && result.data) {
  // Use result.data
}

// Avoid - Potential undefined access
const courses = result.data; // May be undefined
```

### 3. Loading States
```typescript
const [loading, setLoading] = useState(true);
const [courses, setCourses] = useState<Course[]>([]);

useEffect(() => {
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const result = await getAllCourses();
      if (result.success) {
        setCourses(result.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);

if (loading) return <div>Loading...</div>;
```

## Migration Notes

When upgrading from the previous version:

1. **Update Type Definitions**: The `Course` interface now includes an optional `category` field
2. **Update Function Calls**: Existing calls to `getAllCourses()` will now include category data
3. **Handle Optional Category**: Always check if `course.category` exists before accessing
4. **Update UI Components**: Display category information where appropriate

## Future Enhancements

Potential improvements to consider:
- **Pagination**: Add pagination for large course lists
- **Sorting**: Add sorting options (by price, date, popularity)
- **Search**: Add full-text search across course titles and descriptions
- **Category Management**: Add functions to create/update/delete categories
- **Course Enrollment**: Add functions to handle student enrollments
- **Progress Tracking**: Add functions to track student progress in courses
