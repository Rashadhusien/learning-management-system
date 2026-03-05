# Course Management Implementation Guide

## Overview

This guide covers implementing course management features including CRUD operations, category management, and enrollment tracking.

## Database Schema

### Courses Table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  banner_url TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in hours
  level TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  instructor_id TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Server Actions Implementation

### Create Course Action
```typescript
// lib/actions/courses.action.ts
export async function createCourse(
  params: CreateCourseParams,
): Promise<ActionResponse<Course>> {
  const validationResult = await action({
    params,
    schema: CreateCourseSchema,
    authorize: true, // Requires admin role
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { params: validatedData, session } = validationResult;

  try {
    const newCourse = await db
      .insert(courses)
      .values({
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        duration: validatedData.duration,
        level: validatedData.level,
        categoryId: validatedData.categoryId,
        bannerUrl: validatedData.bannerUrl,
        isPublished: validatedData.isPublished,
        instructorId: session.user.id,
      })
      .returning();

    revalidatePath("/admin/courses");

    return {
      success: true,
      data: newCourse[0] as Course,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
```

### Get All Courses with Categories
```typescript
export async function getAllCourses(): Promise<ActionResponse<Course[]>> {
  try {
    const allCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        price: courses.price,
        isPublished: courses.isPublished,
        bannerUrl: courses.bannerUrl,
        duration: courses.duration,
        level: courses.level,
        categoryId: courses.categoryId,
        instructorId: courses.instructorId,
        isDeleted: courses.isDeleted,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(courses)
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .where(eq(courses.isDeleted, false));

    return {
      success: true,
      data: allCourses as Course[],
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
```

## Frontend Components

### Course Form Component
```typescript
// components/forms/admin/CreateCourseForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCourseSchema } from "@/lib/validations";
import { createCourse } from "@/lib/actions/courses.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function CreateCourseForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      duration: 0,
      level: "Beginner",
      categoryId: "",
      bannerUrl: "",
      isPublished: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await createCourse(data);
      if (result.success) {
        // Handle success
        form.reset();
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Course"}
      </Button>
    </form>
  );
}
```

### Course Card Component
```typescript
// components/cards/CourseCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const getLevelConfig = (level: string) => {
    const configs = {
      Beginner: { color: "bg-green-100 text-green-800", name: "Beginner" },
      Intermediate: { color: "bg-yellow-100 text-yellow-800", name: "Intermediate" },
      Advanced: { color: "bg-red-100 text-red-800", name: "Advanced" },
    };
    return configs[level] || configs.Beginner;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <Image
          src={course.bannerUrl}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <Badge className={getLevelConfig(course.level).color}>
            {getLevelConfig(course.level).name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
          <Button asChild>
            <Link href={ROUTES.COURSE_DETAIL(course.id)}>
              View Course
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Validation Schemas

### Course Creation Schema
```typescript
// lib/validations/index.ts
import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  price: z.number().min(0, "Price must be non-negative"),
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  categoryId: z.string().uuid("Invalid category ID"),
  bannerUrl: z.string().url("Invalid banner URL"),
  isPublished: z.boolean().default(false),
});
```

## Page Implementation

### Admin Courses Page
```typescript
// app/admin/courses/page.tsx
import { getAllCourses } from "@/lib/actions/courses.action";
import { CoursesTable } from "@/components/tables/Admin/Courses/CoursesTable";
import { CreateCourseButton } from "@/components/forms/admin/CreateCourseButton";

export default async function AdminCoursesPage() {
  const coursesResult = await getAllCourses();
  
  if (!coursesResult.success) {
    return <div>Error loading courses</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses Management</h1>
        <CreateCourseButton />
      </div>
      
      <CoursesTable courses={coursesResult.data} />
    </div>
  );
}
```

### Public Courses Page
```typescript
// app/(public)/courses/page.tsx
import { getAllCourses } from "@/lib/actions/courses.action";
import { CourseCard } from "@/components/cards/CourseCard";

export default async function CoursesPage() {
  const coursesResult = await getAllCourses();
  
  if (!coursesResult.success) {
    return <div>Error loading courses</div>;
  }

  const publishedCourses = coursesResult.data.filter(
    course => course.isPublished
  );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

### Error Handling
- Always handle server action results
- Display user-friendly error messages
- Log errors for debugging

### Performance
- Implement pagination for large course lists
- Optimize images with Next.js Image component
- Use React.memo for expensive components

### Security
- Validate all inputs with Zod schemas
- Implement proper authorization checks
- Sanitize user-generated content

### Accessibility
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation support

## Testing

### Unit Tests
```typescript
// __tests__/actions/courses.action.test.ts
import { createCourse } from "@/lib/actions/courses.action";
import { db } from "@/lib/db";

// Mock database
jest.mock("@/lib/db");

describe("createCourse", () => {
  it("should create a course successfully", async () => {
    const mockCourse = { id: "123", title: "Test Course" };
    (db.insert as jest.Mock).mockReturnValue({
      returning: jest.fn().mockResolvedValue([mockCourse]),
    });

    const result = await createCourse({
      title: "Test Course",
      description: "Test Description",
      // ... other fields
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockCourse);
  });
});
```

### Integration Tests
- Test form submissions
- Verify database operations
- Check authentication flows

## Deployment Considerations

### Environment Variables
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Database Migrations
```bash
npm run db:generate  # Generate migration
npm run db:migrate   # Apply migration
npm run db:studio    # Open Drizzle Studio
```

## Future Enhancements

### Course Content Management
- Video upload and streaming
- Document attachments
- Course chapters/modules

### Enrollment System
- Student enrollment tracking
- Progress monitoring
- Completion certificates

### Advanced Features
- Course recommendations
- Rating and review system
- Instructor profiles
