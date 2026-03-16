import { notFound } from "next/navigation";
import { getStudentById } from "@/lib/actions/students.action";
import { User } from "@/types/action.d";
import ProfileHeader from "@/components/ProfileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Calendar,
  Trophy,
  Target,
  BookOpen,
  Star,
} from "lucide-react";
import DataRenderer from "@/components/DataRenderer";
import CourseCard from "@/components/cards/CourseCard";
import { EMPTY_PROJECT, EMYPTY_COURSE } from "@/constants/states";
import ProjectCard from "@/components/cards/ProjectCard";

interface StudentProjectSubmission {
  submission: {
    id: string;
    repoLink: string | null;
    demoLink: string | null;
    status: "pending" | "approved" | "rejected";
    pointsEarned: number | null;
    submittedAt: Date;
  };
  project: {
    id: string;
    title: string;
    description: string;
    imageCldPubId: string | null;
    points: number;
    difficulty: string;
  };
}

interface StudentWithDetails extends Omit<User, "level"> {
  level: string | null;
  courses: Array<{
    id: string;
    title: string;
    description: string;
    imageCldPubId: string | null;
    price: number;
    level: string;
    duration: number;
    enrolledAt: Date;
  }>;
  projects: StudentProjectSubmission[];
}

interface StudentProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

const StudentProfilePage = async ({ params }: StudentProfilePageProps) => {
  const { id } = await params;
  // Fetch student data
  const studentResult = await getStudentById(id);

  console.log(studentResult);

  if (!studentResult.success || !studentResult.data) {
    notFound();
  }

  const student: StudentWithDetails = studentResult.data;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <ProfileHeader userProfile={student as User} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        {/* Left Column - Student Info & Stats */}
        <div className="lg:col-span-1 space-y-6 ">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.bio && (
                <p className="text-muted-foreground">{student.bio}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{student.email}</span>
                </div>

                {student.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{student.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Level: {student.level || "Not set"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievement Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold">
                      {student.totalPoints}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span className="text-2xl font-bold">
                      {student.projects?.length || 0}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Projects
                  </p>
                </div>
              </div>

              {/* <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Approved
                  </span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                   {approvedSubmissions}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                   {pendingSubmissions}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Rejected
                  </span>
                  <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800"
                  >
                    {rejectedSubmissions}
                  </Badge>
                </div>
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Project Submissions */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Projects
                </span>
                <Badge variant="outline">
                  {student?.projects?.length || 0} Total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-8">
              <DataRenderer
                success={true}
                data={student?.projects}
                empty={EMPTY_PROJECT}
                render={(projects) =>
                  projects?.map((project) => (
                    <ProjectCard
                      key={project.project.id}
                      project={project.project}
                    />
                  ))
                }
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Courses
                </span>
                <Badge variant="outline">
                  {student?.courses?.length || 0} Total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-8">
              <DataRenderer
                success={true}
                data={student?.courses}
                empty={EMYPTY_COURSE}
                render={(courses) =>
                  courses?.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
