# Authentication Setup Guide

## Overview

This guide covers the authentication system implementation using NextAuth.js with credentials provider, including user registration, login, session management, and role-based authorization.

## Architecture

### Authentication Flow
1. **Registration**: User creates account with email/password
2. **Login**: Credentials validated against database
3. **Session**: JWT token generated with user role
4. **Authorization**: Role-based access control

### Security Features
- Password hashing with bcryptjs
- JWT session management
- Role-based access control
- Input validation with Zod

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  bio TEXT,
  phone TEXT,
  level TEXT DEFAULT 'Beginner',
  total_points INTEGER DEFAULT 0,
  image TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  password TEXT, -- For credentials provider
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  PRIMARY KEY (provider, provider_account_id)
);
```

## NextAuth.js Configuration

### Main Configuration
```typescript
// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users, accounts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) return null;

        // Find associated account with password
        const account = await db.query.accounts.findFirst({
          where: eq(accounts.userId, user.id),
        });

        if (!account || !account.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          account.password,
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
```

### API Route Handler
```typescript
// app/api/auth/[...nextauth]/route.ts
export { GET, POST } from "@/auth";
```

### Type Definitions
```typescript
// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}
```

## Server Actions

### Registration Action
```typescript
// lib/actions/auth.action.ts
"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { users, accounts } from "../schema";
import { RegisterSchema } from "../validations";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export const registerWithCredentials = async (params: AuthCredentials) => {
  const validationResult = await action({ 
    params, 
    schema: RegisterSchema 
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Check username uniqueness
    const [existingUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name,
        username,
        email,
        role: "student",
      })
      .returning();

    // Create account record
    await db
      .insert(accounts)
      .values({
        userId: newUser[0]!.id,
        type: "credentials",
        provider: "credentials",
        password: hashedPassword,
        providerAccountId: email,
      });

    // Auto sign in
    await signIn("credentials", { email, password, redirect: false });
    
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
```

### Login Action
```typescript
export const logInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
): Promise<ActionResponse> => {
  const validationResult = await action({ 
    params, 
    schema: LoginSchema 
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    await signIn("credentials", { 
      email, 
      password, 
      redirect: false 
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
```

### Logout Action
```typescript
export async function signOutAction() {
  await signOut({ redirectTo: ROUTES.LOGIN });
}
```

## Validation Schemas

### Registration Schema
```typescript
// lib/validations/index.ts
import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
```

## Frontend Components

### Auth Form Component
```typescript
// components/forms/AuthForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, RegisterSchema } from "@/lib/validations";
import { logInWithCredentials, registerWithCredentials } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AuthFormData = {
  name?: string;
  username?: string;
  email: string;
  password: string;
};

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onLogin = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const result = await logInWithCredentials({
        email: data.email,
        password: data.password,
      });
      
      if (result.success) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const result = await registerWithCredentials({
        name: data.name!,
        username: data.username!,
        email: data.email,
        password: data.password,
      });
      
      if (result.success) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...loginForm.register("email")}
                disabled={isLoading}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...loginForm.register("password")}
                disabled={isLoading}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...registerForm.register("name")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...registerForm.register("username")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.username && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.username.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...registerForm.register("email")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...registerForm.register("password")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Authorization Middleware

### Role-Based Access Control
```typescript
// lib/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/admin", "/profile"];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin-only routes
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isAdminRoute && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
```

### Server Action Authorization
```typescript
// lib/handlers/action.ts
import { auth } from "@/auth";
import { z } from "zod";

interface ActionOptions {
  params: any;
  schema: z.ZodSchema;
  authorize?: boolean;
  requiredRole?: "admin" | "student";
}

export async function action({ 
  params, 
  schema, 
  authorize = false,
  requiredRole 
}: ActionOptions) {
  // Validate input
  const validationResult = schema.safeParse(params);
  if (!validationResult.success) {
    return new Error(validationResult.error.errors[0]?.message || "Validation failed");
  }

  // Check authorization if required
  if (authorize) {
    const session = await auth();
    
    if (!session?.user) {
      return new Error("Authentication required");
    }

    if (requiredRole && session.user.role !== requiredRole) {
      return new Error(`${requiredRole} role required`);
    }

    return {
      params: validationResult.data,
      session,
    };
  }

  return {
    params: validationResult.data,
  };
}
```

## Page Protection

### Server Component Protection
```typescript
// app/admin/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin content */}
    </div>
  );
}
```

### Client Component Protection
```typescript
// components/ProtectedRoute.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "student";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/login");
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      router.push("/");
      return;
    }
  }, [session, status, router, requiredRole]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || (requiredRole && session.user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
```

## Session Management

### Session Provider
```typescript
// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### Custom Hook for Session
```typescript
// hooks/use-auth.ts
"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === "admin",
    isStudent: session?.user?.role === "student",
  };
}
```

## Environment Setup

### Required Environment Variables
```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL=postgresql://username:password@host:port/database
```

### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

## Security Best Practices

### Password Security
- Use bcryptjs with minimum 12 salt rounds
- Implement password strength requirements
- Store only hashed passwords in database

### Session Security
- Use secure HTTP-only cookies in production
- Set appropriate session expiration
- Implement proper logout functionality

### Input Validation
- Validate all user inputs with Zod schemas
- Sanitize data before database operations
- Implement rate limiting for auth endpoints

### Error Handling
- Don't expose sensitive information in error messages
- Log authentication attempts for monitoring
- Implement account lockout after failed attempts

## Testing

### Unit Tests
```typescript
// __tests__/actions/auth.action.test.ts
import { registerWithCredentials } from "@/lib/actions/auth.action";
import { db } from "@/lib/db";

jest.mock("@/lib/db");

describe("registerWithCredentials", () => {
  it("should register a new user successfully", async () => {
    const mockUser = { id: "123", email: "test@example.com" };
    (db.select as jest.Mock).mockReturnValue([]);
    (db.insert as jest.Mock).mockReturnValue({
      returning: jest.fn().mockResolvedValue([mockUser]),
    });

    const result = await registerWithCredentials({
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "Password123",
    });

    expect(result.success).toBe(true);
  });
});
```

### Integration Tests
- Test complete authentication flow
- Verify session persistence
- Test role-based access control

## Troubleshooting

### Common Issues
1. **Session not persisting**: Check NEXTAUTH_SECRET and URL configuration
2. **Database connection errors**: Verify DATABASE_URL format
3. **Password validation failing**: Check bcrypt comparison logic
4. **Role-based access not working**: Verify session callbacks

### Debug Mode
```typescript
// auth.ts (development only)
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  // ... other config
});
```

## Future Enhancements

### Additional Providers
- Google OAuth
- GitHub OAuth
- Social login options

### Advanced Features
- Two-factor authentication
- Email verification
- Password reset functionality
- Account recovery options
- Session management dashboard
