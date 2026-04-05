import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectById } from "@/lib/actions/projects.action";
import { getProjectSubmissions } from "@/lib/actions/project-submissions.action";
import { ROUTES } from "@/constants/routes";
import { ArrowLeft, Trophy, Users, FolderOpen, Layers } from "lucide-react";
import ProjectSubmissionsTable from "@/components/ProjectSubmissionsTable";
import SubmitProjectDialog from "@/components/submit-project-dialg";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { id } = await params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) notFound();

  const { success, data: project } = await getProjectById(id);
  const { data: submissions } = await getProjectSubmissions(id);

  if (!success || !project) notFound();

  const completedCount = submissions?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] overflow-hidden">
        <Image
          src={project.imageCldPubId}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />

        {/* Back */}
        <div className="absolute top-5 left-4 sm:left-8">
          <Link
            href={ROUTES.PROJECTS}
            className="inline-flex items-center gap-2 rounded-full border border-white/20
                       bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white
                       hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Projects</span>
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8">
          <div className="container mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/80 px-3 py-1 text-xs font-medium text-primary-foreground mb-3">
              <Layers className="w-3 h-3" />
              Hands-on Project
            </div>
            <h1 className="h1-bold text-white max-w-2xl drop-shadow-md">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* ── Main ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat chips */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: <Trophy className="w-5 h-5 text-primary" />,
                  label: "Points Reward",
                  value: `${project.points} pts`,
                },
                {
                  icon: <Users className="w-5 h-5 text-primary" />,
                  label: "Completed By",
                  value: `${completedCount} student${completedCount !== 1 ? "s" : ""}`,
                },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl
                             border border-border bg-card px-4 py-5 shadow-xs
                             hover:border-primary/40 hover:shadow-sm transition-all"
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
            {project.description && (
              <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <h2 className="h3-semibold text-foreground">
                    About This Project
                  </h2>
                </div>
                <div className="px-6 py-5">
                  <p className="paragraph-regular text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            )}

            {/* Submissions table */}
            <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              <ProjectSubmissionsTable
                projectId={id}
                initialData={submissions || []}
              />
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Points header */}
              <div className="primary-gradient px-6 py-6 text-center">
                <p className="text-primary-foreground/70 text-sm mb-1">
                  Points Available
                </p>
                <p className="text-4xl font-bold text-primary-foreground tracking-tight">
                  {project.points}
                </p>
                <p className="text-primary-foreground/60 text-xs mt-1">
                  upon completion
                </p>
              </div>

              {/* Detail rows */}
              <div className="px-6 py-5 space-y-3 border-b border-border">
                {[
                  {
                    icon: <Trophy className="w-4 h-4 text-primary" />,
                    text: `${project.points} points reward`,
                  },
                  {
                    icon: <Users className="w-4 h-4 text-primary" />,
                    text: `${completedCount} students completed`,
                  },
                  {
                    icon: <FolderOpen className="w-4 h-4 text-primary" />,
                    text: "Hands-on project",
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
                <SubmitProjectDialog />
                <p className="text-center small-regular text-muted-foreground mt-3">
                  Submit your work to earn points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
