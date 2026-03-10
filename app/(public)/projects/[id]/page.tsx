import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectById } from "@/lib/actions/projects.action";
import { getProjectSubmissions } from "@/lib/actions/project-submissions.action";
import { ROUTES } from "@/constants/routes";
import { ArrowLeft, Clock, Trophy, FolderOpen, Users } from "lucide-react";
import ProjectSubmissionsTable from "@/components/ProjectSubmissionsTable";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { id } = await params;

  // Validate that the ID looks like a UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    console.error("Invalid project ID format:", id);
    notFound();
  }

  const { success, data: project } = await getProjectById(id);

  // Get project submissions data
  const { success: submissionsSuccess, data: submissions } =
    await getProjectSubmissions(id);

  if (!success || !project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="gap-2">
          <Link href={ROUTES.PROJECTS}>
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Project Header */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Project Image */}
          <Card className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={project.imageCldPubId}
              alt={project.title}
              fill
              className="object-contain"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {project.title}
              </h1>
            </div>
          </Card>

          {/* Project Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="font-semibold">{project.points}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-semibold">
                  {submissions?.length || 0} Students
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FolderOpen className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-semibold">Development</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">2 weeks</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {project.description && (
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle className="text-center">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{project.points}</p>
                <p className="text-sm text-muted-foreground">
                  Points Available
                </p>
              </div>

              <div className="space-y-2">
                <Badge variant={"outline"} className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">
                    {project.points} points reward
                  </span>
                </Badge>
                <Badge variant={"outline"} className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    {submissions?.length || 0} students completed
                  </span>
                </Badge>
                <Badge variant={"outline"} className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Hands-on project</span>
                </Badge>
              </div>

              <Button className="w-full" size="lg">
                Submit Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student Submissions */}
      <div className="mt-10">
        <ProjectSubmissionsTable
          projectId={id}
          initialData={submissions || []}
        />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
