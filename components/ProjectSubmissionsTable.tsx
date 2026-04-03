"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Trophy, FolderOpen, ExternalLink, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectSubmission {
  student: {
    id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
    totalPoints: number;
  };
  submission: {
    id: string;
    repoLink: string | null;
    demoLink: string | null;
    status: "pending" | "approved" | "rejected";
    pointsEarned: number | null;
    submittedAt: Date;
  };
  totalProjects: number;
}

interface ProjectSubmissionsTableProps {
  projectId: string;
  initialData: ProjectSubmission[];
}

export default function ProjectSubmissionsTable({
  projectId,
  initialData,
}: ProjectSubmissionsTableProps) {
  const [submissions, setSubmissions] =
    useState<ProjectSubmission[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      submission.student.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      submission.student.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const handleViewStudent = (studentId: string) => {
    router.push(`/students/${studentId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Student Submissions ({submissions.length})</span>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No students found matching your search."
                : "No submissions yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.submission.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Student Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={submission.student.image || ""}
                      alt={submission.student.name}
                    />
                    <AvatarFallback>
                      {submission.student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{submission.student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      @{submission.student.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted{" "}
                      {new Date(
                        submission.submission.submittedAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <div className="text-center">
                      <p className="text-sm font-semibold">
                        {submission.student.totalPoints}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-500" />
                    <div className="text-center">
                      <p className="text-sm font-semibold">
                        {submission.totalProjects}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Projects
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    {submission.submission.repoLink && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={submission.submission.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    {submission.submission.demoLink && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={submission.submission.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewStudent(submission.student.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
