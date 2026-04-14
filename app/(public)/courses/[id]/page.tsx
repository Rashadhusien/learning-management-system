import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCourseById } from "@/lib/actions/courses.action";
import {
  isStudentEnrolled,
  getCourseEnrollments,
} from "@/lib/actions/enrollments.action";
import { ROUTES } from "@/constants/routes";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  BookOpen,
  User,
  BarChart2,
  Tag,
} from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import CourseEnrollmentsTable from "@/components/CourseEnrollmentsTable";
import CourseContent from "@/components/CourseContent";
import { getCourseChapters } from "@/lib/actions/lectures.action";
import { isAdmin } from "@/lib/auth-wrapper";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

const CourseDetailPage = async ({ params }: CourseDetailPageProps) => {
  const { id } = await params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const { success, data: course } = await getCourseById(id);
  const { data: isEnrolled } = await isStudentEnrolled(id);
  const { data: enrolledStudents } = await getCourseEnrollments(id);

  const { data: chapters } = await getCourseChapters(id);

  if (!success || !course) notFound();

  const chaptersWithLessons = chapters?.filter(
    (chapter) => chapter.lessons?.length > 0,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="relative w-full h-[340px] sm:h-[420px] md:h-[480px] overflow-hidden">
        <Image
          src={course.bannerUrl}
          alt={course.title}
          fill
          sizes="100vw"
          quality={80}
          className="object-cover"
          priority
        />
        {/* dark + primary gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-primary/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-5 left-4 sm:left-8">
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-full px-4"
          >
            <Link href={ROUTES.COURSES}>
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Courses</span>
            </Link>
          </Button>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8">
          <div className="container mx-auto">
            <Badge className="mb-3 bg-primary/90 hover:bg-primary text-primary-foreground border-0 rounded-full px-3 py-1 text-xs font-medium">
              {course.category?.name || "Uncategorized"}
            </Badge>
            <h1 className="h1-bold text-white max-w-2xl drop-shadow-md">
              {course.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* ── Left / Main ───────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: <Clock className="w-5 h-5 text-primary" />,
                  label: "Duration",
                  value: `${course.duration}h`,
                },
                {
                  icon: <DollarSign className="w-5 h-5 text-primary" />,
                  label: "Price",
                  value: `$${course.price}`,
                },
                {
                  icon: <BarChart2 className="w-5 h-5 text-primary" />,
                  label: "Level",
                  value: course.level,
                },
                {
                  icon: <User className="w-5 h-5 text-primary" />,
                  label: "Instructor",
                  value: "Expert",
                },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-4 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  {icon}
                  <span className="small-medium text-muted-foreground">
                    {label}
                  </span>
                  <span className="body-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="h3-semibold text-foreground">
                  About This Course
                </h2>
              </div>
              <div className="px-6 py-5">
                <p className="paragraph-regular text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            <CourseContent
              courseId={id}
              chapters={chaptersWithLessons || []}
              isEnrolled={isEnrolled}
            />

            {/* Enrollments table */}
            <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              <CourseEnrollmentsTable initialData={enrolledStudents || []} />
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Price header */}
              <div className="primary-gradient px-6 py-6 text-center">
                <p className="text-primary-foreground/70 text-sm mb-1">
                  One-time payment
                </p>
                <p className="text-4xl font-bold text-primary-foreground tracking-tight">
                  ${course.price}
                </p>
              </div>

              {/* Details */}
              <div className="px-6 py-5 space-y-3 border-b border-border">
                {[
                  {
                    icon: <Clock className="w-4 h-4 text-primary" />,
                    text: `${course.duration} hours of content`,
                  },
                  {
                    icon: <BarChart2 className="w-4 h-4 text-primary" />,
                    text: `${course.level} level`,
                  },
                  {
                    icon: <Tag className="w-4 h-4 text-primary" />,
                    text: course.category?.name || "Uncategorized",
                  },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5"
                  >
                    {icon}
                    <span className="body-medium text-foreground">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-6 py-5">
                {(await isAdmin()) ? (
                  <Button className="w-full" asChild>
                    <Link href={ROUTES.ADMIN_COURSE_DETAILS(id)}>
                      Manage Course
                    </Link>
                  </Button>
                ) : (
                  <EnrollButton
                    courseId={id}
                    isEnrolled={isEnrolled || false}
                  />
                )}
                <p className="text-center small-regular text-muted-foreground mt-3">
                  Instant access after enrollment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
