import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseById } from "@/lib/actions/courses.action";
import {
  isStudentEnrolled,
  getCourseEnrollments,
} from "@/lib/actions/enrollments.action";
import { ROUTES } from "@/constants/routes";
import { ArrowLeft, Clock, DollarSign, BookOpen, User } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import CourseEnrollmentsTable from "@/components/CourseEnrollmentsTable";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

const CourseDetailPage = async ({ params }: CourseDetailPageProps) => {
  const { id } = await params;

  // Validate that the ID looks like a UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    console.error("Invalid course ID format:", id);
    notFound();
  }

  const { success, data: course } = await getCourseById(id);

  // Check if user is already enrolled
  const { success: enrollmentCheckSuccess, data: isEnrolled } =
    await isStudentEnrolled(id);

  // Get enrolled students data
  const { success: enrollmentsSuccess, data: enrolledStudents } =
    await getCourseEnrollments(id);

  if (!success || !course) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="gap-2">
          <Link href={ROUTES.COURSES}>
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </Button>
      </div>

      {/* Course Header */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Banner Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={course.bannerUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge variant="secondary" className="mb-2">
                {course.category?.name || "Uncategorized"}
              </Badge>
              <h1 className="text-3xl font-bold text-white mb-2">
                {course.title}
              </h1>
            </div>
          </div>

          {/* Course Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{course.duration} hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-semibold">${course.price}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="font-semibold">{course.level}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <User className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <p className="text-sm text-muted-foreground">Instructor</p>
                <p className="font-semibold">Expert</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle className="text-center">Enroll Now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">${course.price}</p>
                <p className="text-sm text-muted-foreground">
                  One-time payment
                </p>
              </div>

              <div className="space-y-2">
                <Badge variant={"outline"} className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    {course.duration} hours of content
                  </span>
                </Badge>
                <Badge variant={"outline"} className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">{course.level} level</span>
                </Badge>
                <Badge variant={"outline"} className="flex items-center gap-2">
                  <span className="text-sm">
                    {course.category?.name || "Uncategorized"}
                  </span>
                </Badge>
              </div>

              <EnrollButton courseId={id} isEnrolled={isEnrolled || false} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10">
        <CourseEnrollmentsTable
          courseId={id}
          initialData={enrolledStudents || []}
        />
      </div>
    </div>
  );
};

export default CourseDetailPage;
