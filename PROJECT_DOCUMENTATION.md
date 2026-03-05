# Learning Management System - Project Documentation

## Overview

This is a comprehensive Learning Management System (LMS) built with Next.js 16, TypeScript, and modern web technologies. The system supports course management, student enrollment, project submissions, achievements, and administrative features.

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library built on Radix UI
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Drizzle ORM** - Type-safe SQL toolkit
- **PostgreSQL (Neon)** - Cloud database
- **NextAuth.js** - Authentication
- **bcryptjs** - Password hashing

### Infrastructure
- **Cloudinary** - Image management and CDN
- **Vercel** - Deployment platform (recommended)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages group
│   ├── (public)/          # Public pages group
│   ├── admin/             # Admin dashboard pages
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── cards/            # Card components
│   ├── forms/            # Form components
│   ├── navigation/       # Navigation components
│   ├── tables/           # Table components
│   └── ui/               # Base UI components (shadcn/ui)
├── lib/                   # Utility libraries
│   ├── actions/          # Server actions
│   ├── handlers/         # Request handlers
│   └── schema.ts         # Database schema
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
└── drizzle/              # Database migrations
```

## Database Schema

### Core Tables

#### Users
```typescript
{
  id: uuid (PK)
  name: string
  username: string (unique)
  email: string (unique)
  role: "admin" | "student"
  bio?: string
  phone?: string
  level: string (default: "Beginner")
  totalPoints: number (default: 0)
  image?: string
  isDeleted: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Accounts
```typescript
{
  userId: uuid (FK → users.id)
  type: string
  provider: string
  providerAccountId: string
  password?: string (for credentials provider)
  // OAuth fields...
}
```

#### Categories
```typescript
{
  id: uuid (PK)
  name: string (unique)
  description?: string
  icon?: string
  isDeleted: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Courses
```typescript
{
  id: uuid (PK)
  title: string
  description: string
  price: number (default: 0)
  isPublished: boolean
  bannerUrl: string
  duration: number (hours)
  level: string
  categoryId: uuid (FK → categories.id)
  instructorId: string
  isDeleted: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Enrollments
```typescript
{
  id: uuid (PK)
  studentId: uuid (FK → users.id)
  courseId: uuid (FK → courses.id)
  enrolledAt: timestamp
  // Unique constraint on (studentId, courseId)
}
```

#### Projects
```typescript
{
  id: uuid (PK)
  title: string
  description?: string
  courseId: uuid (FK → courses.id)
  points: number (default: 50)
  isDeleted: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Project Submissions
```typescript
{
  id: uuid (PK)
  projectId: uuid (FK → projects.id)
  studentId: uuid (FK → users.id)
  repoLink?: string
  demoLink?: string
  status: "pending" | "approved" | "rejected"
  pointsEarned: number (default: 0)
  submittedAt: timestamp
  // Unique constraint on (projectId, studentId)
}
```

#### Achievements
```typescript
{
  id: uuid (PK)
  title: string
  description?: string
  requiredPoints?: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Student Achievements
```typescript
{
  id: uuid (PK)
  studentId: uuid (FK → users.id)
  achievementId: uuid (FK → achievements.id)
  earnedAt: timestamp
  // Unique constraint on (studentId, achievementId)
}
```

## Authentication System

### Configuration
- **Provider**: Credentials (email/password)
- **Strategy**: JWT
- **Session Management**: NextAuth.js

### Flow
1. User registers/login via credentials
2. Password hashed with bcryptjs
3. JWT token generated with user role
4. Session data includes user ID and role

### Authorization
- **Admin Role**: Full access to admin dashboard
- **Student Role**: Limited to public pages and own data

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js handler

### Server Actions
All business logic is implemented as server actions in `/lib/actions/`:

#### Auth Actions (`auth.action.ts`)
- `logInWithCredentails()` - User login
- `registerWithCredentails()` - User registration
- `signOutAction()` - User logout

#### Course Actions (`courses.action.ts`)
- `createCourse()` - Create new course (admin only)
- `getAllCourses()` - Get all courses with categories
- `deleteCourse()` - Delete course (admin only)

#### Category Actions (`categories.action.ts`)
- `createCategory()` - Create new category (admin only)
- `getAllCategories()` - Get all categories
- `deleteCategory()` - Delete category (admin only)

## Component Architecture

### UI Components (shadcn/ui)
Base components following the shadcn/ui pattern:
- Button, Input, Card, Table, Dialog, etc.
- Located in `/components/ui/`
- Built on Radix UI primitives

### Business Components
- **Cards**: `CourseCard`, `CategoryCard`
- **Forms**: `AuthForm`, `CreateCourseForm`, `CreateCategoryForm`
- **Tables**: `CoursesTable`, `CategoriesTable`
- **Navigation**: `Navbar`, `LeftSidebar`, `MobileNavigation`

### Layout Structure
```
app/
├── layout.tsx              # Root layout
├── (auth)/layout.tsx       # Auth pages layout
├── (public)/layout.tsx     # Public pages layout
└── admin/layout.tsx        # Admin dashboard layout
```

## Key Features

### Student Features
- Browse courses by category
- View course details
- Enroll in courses
- Submit projects
- Track progress and points
- View achievements

### Admin Features
- Course management (CRUD)
- Category management (CRUD)
- Student management
- Project submission review
- Analytics dashboard

### Security Features
- Password hashing
- Role-based access control
- Input validation with Zod
- SQL injection protection (Drizzle ORM)

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent naming conventions
- Component-based architecture

### File Organization
- Server actions in `/lib/actions/`
- Types in `/types/`
- Constants in `/constants/`
- Components grouped by functionality

### Database Operations
- Use Drizzle ORM for all database operations
- Implement proper error handling
- Use transactions for multi-table operations
- Soft deletes with `isDeleted` flag

### Form Handling
- React Hook Form for form state
- Zod schemas for validation
- Server actions for form submission
- Proper error display and loading states

## Environment Setup

### Required Environment Variables
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Database Setup
```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

### Development Server
```bash
npm run dev
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push to main

### Manual Deployment
```bash
npm run build
npm start
```

## Future Implementation Roadmap

### Phase 1: Core Features Completion
- [ ] Complete project submission system
- [ ] Implement achievement system
- [ ] Add student progress tracking
- [ ] Build admin analytics dashboard

### Phase 2: Enhanced Features
- [ ] Video content management
- [ ] Quiz and assessment system
- [ ] Certificate generation
- [ ] Email notifications
- [ ] Real-time chat/messaging

### Phase 3: Advanced Features
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Integration with external APIs
- [ ] Subscription/payment system

## Contributing Guidelines

### Before Adding New Features
1. Check existing schema and components
2. Follow established patterns
3. Add proper TypeScript types
4. Include error handling
5. Update documentation

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] Form validation implemented
- [ ] Error handling present
- [ ] Database operations use Drizzle
- [ ] Components follow established patterns
- [ ] Accessibility considerations addressed

## Common Issues and Solutions

### Module Resolution Errors
- Ensure dynamic routes use correct parameter names
- Check file extensions in imports
- Verify TypeScript configuration

### Database Connection Issues
- Verify DATABASE_URL format
- Check environment variables
- Ensure Neon database is active

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check session configuration
- Ensure proper callback URLs

## Support

For technical questions or issues:
1. Check this documentation first
2. Review existing code patterns
3. Consult Next.js and Drizzle documentation
4. Refer to component examples in `/components/examples/`
