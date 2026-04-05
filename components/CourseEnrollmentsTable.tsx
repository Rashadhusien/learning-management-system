"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Trophy, FolderOpen, Eye, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface EnrolledStudent {
  student: {
    id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
    totalPoints: number;
  };
  enrolledAt: Date;
  totalProjects: number;
}

interface CourseEnrollmentsTableProps {
  initialData: EnrolledStudent[];
}

export default function CourseEnrollmentsTable({
  initialData,
}: CourseEnrollmentsTableProps) {
  const [students] = useState<EnrolledStudent[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filtered = students.filter(
    (e) =>
      e.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="h3-semibold text-foreground">Enrolled Students</h2>
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 min-w-[24px]">
            {students.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search students…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-secondary/60 border-border focus-visible:ring-primary/30 rounded-xl text-sm no-focus"
          />
        </div>
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="body-medium text-muted-foreground">
            {searchQuery
              ? "No students match your search."
              : "No students enrolled yet."}
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop table ──────────────────────────────────────── */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                  <TableHead className="small-medium uppercase tracking-widest text-muted-foreground pl-6">
                    Student
                  </TableHead>
                  <TableHead className="small-medium uppercase tracking-widest text-muted-foreground">
                    Enrolled
                  </TableHead>
                  <TableHead className="small-medium uppercase tracking-widest text-muted-foreground">
                    Points
                  </TableHead>
                  <TableHead className="small-medium uppercase tracking-widest text-muted-foreground">
                    Projects
                  </TableHead>
                  <TableHead className="small-medium uppercase tracking-widest text-muted-foreground pr-6" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((enrollment) => (
                  <TableRow
                    key={enrollment.student.id}
                    className="hover:bg-secondary/30 transition-colors group"
                  >
                    {/* Student */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 ring-2 ring-border group-hover:ring-primary/30 transition-all">
                          <AvatarImage
                            src={enrollment.student.image || ""}
                            alt={enrollment.student.name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {initials(enrollment.student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="body-medium text-foreground">
                            {enrollment.student.name}
                          </p>
                          <p className="small-regular text-muted-foreground">
                            @{enrollment.student.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Enrolled date */}
                    <TableCell className="body-regular text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </TableCell>

                    {/* Points */}
                    <TableCell>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2.5 py-1 text-xs font-semibold">
                        <Trophy className="w-3.5 h-3.5" />
                        {enrollment.student.totalPoints.toLocaleString()}
                      </div>
                    </TableCell>

                    {/* Projects */}
                    <TableCell>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold">
                        <FolderOpen className="w-3.5 h-3.5" />
                        {enrollment.totalProjects}
                      </div>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/students/${enrollment.student.id}`)
                        }
                        className="h-8 gap-1.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="body-medium">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ── Mobile cards ──────────────────────────────────────── */}
          <div className="lg:hidden divide-y divide-border">
            {filtered.map((enrollment) => (
              <div
                key={enrollment.student.id}
                className="flex items-center gap-4 px-4 py-4 hover:bg-secondary/30 transition-colors"
              >
                {/* Avatar */}
                <Avatar className="w-11 h-11 shrink-0 ring-2 ring-border">
                  <AvatarImage
                    src={enrollment.student.image || ""}
                    alt={enrollment.student.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials(enrollment.student.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="body-semibold text-foreground truncate">
                    {enrollment.student.name}
                  </p>
                  <p className="small-regular text-muted-foreground truncate">
                    @{enrollment.student.username}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
                      <Trophy className="w-3 h-3" />
                      {enrollment.student.totalPoints.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary text-xs font-medium">
                      <FolderOpen className="w-3 h-3" />
                      {enrollment.totalProjects} projects
                    </span>
                    <span className="small-regular text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(`/students/${enrollment.student.id}`)
                  }
                  className="shrink-0 w-9 h-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
