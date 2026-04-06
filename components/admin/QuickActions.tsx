"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Users,
  BookOpen,
  Trophy,
  BarChart3,
  FileText,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: "default" | "destructive";
}

export default function QuickActions({ className }: { className?: string }) {
  const quickActions: QuickAction[] = [
    {
      title: "Add Course",
      description: "Create a new course",
      icon: <BookOpen className="w-5 h-5" />,
      href: ROUTES.ADMIN_COURSES,
    },
    {
      title: "Add Project",
      description: "Create a new project",
      icon: <BarChart3 className="w-5 h-5" />,
      href: ROUTES.ADMIN_PROJECTS,
    },
    {
      title: "Add Student",
      description: "Enroll a new student",
      icon: <Users className="w-5 h-5" />,
      href: ROUTES.ADMIN_STUDENTS,
    },
    {
      title: "Add Achievement",
      description: "Create a new achievement",
      icon: <Trophy className="w-5 h-5" />,
      href: ROUTES.ADMIN_ACHIEVEMENTS,
    },
    {
      title: "View Reports",
      description: "Generate analytics reports",
      icon: <FileText className="w-5 h-5" />,
      href: "#",
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex  gap-4 flex-wrap ">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 w-48 justify-start flex-col gap-2 hover:bg-muted/50"
              asChild
            >
              <Link href={action.href}>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  {action.icon}
                </div>
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
