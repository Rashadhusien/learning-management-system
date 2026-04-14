import React from "react";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "../ui/button";
import ProjectCard from "../cards/ProjectCard";
import { ProjectWithCourse } from "@/lib/actions/projects.action";

const LatestProjects = ({ projects }: { projects: ProjectWithCourse[] }) => {
  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionTitle
          badgeIcon={<Sparkles className="h-4 w-4" />}
          badge="Latest Content"
          title={
            <>
              Fresh from our <SectionTitleMarker marker="Community" />
            </>
          }
          description="Discover amazing projects and courses created by our talented students and instructors."
        />

        <div>
          <div className="col-header flex items-center gap-2.5 mb-5 pb-4 border-b border-border/50">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
              <Trophy className="h-4 w-4 text-foreground" />
            </div>
            <span className="text-sm font-medium">Featured Projects</span>
            <span className="ml-auto text-xs text-muted-foreground border border-border/50 px-2 py-0.5 rounded-full">
              {projects?.length ?? 0} total
            </span>
          </div>

          <div className="space-y-3 mb-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {projects?.map((project, index) => (
              <div key={project.id ?? index} className="proj-card">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="rs-btn w-full max-w-sm mx-auto flex items-center group"
            asChild
          >
            <Link href={ROUTES.PROJECTS}>
              View all projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestProjects;
