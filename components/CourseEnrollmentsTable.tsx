"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Trophy, FolderOpen, Eye } from "lucide-react";
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
  courseId: string;
  initialData: EnrolledStudent[];
}

export default function CourseEnrollmentsTable({ 
  courseId, 
  initialData 
}: CourseEnrollmentsTableProps) {
  const [students, setStudents] = useState<EnrolledStudent[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const filteredStudents = students.filter((student) =>
    student.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewStudent = (studentId: string) => {
    router.push(`/students/${studentId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Enrolled Students ({students.length})</span>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery ? "No students found matching your search." : "No students enrolled yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((enrollment) => (
              <div
                key={enrollment.student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Student Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={enrollment.student.image || ""}
                      alt={enrollment.student.name}
                    />
                    <AvatarFallback>
                      {enrollment.student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{enrollment.student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      @{enrollment.student.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <div className="text-center">
                      <p className="text-sm font-semibold">
                        {enrollment.student.totalPoints}
                      </p>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-500" />
                    <div className="text-center">
                      <p className="text-sm font-semibold">
                        {enrollment.totalProjects}
                      </p>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewStudent(enrollment.student.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
