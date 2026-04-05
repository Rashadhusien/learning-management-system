"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROUTES } from "@/constants/routes";
import { Trophy, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import CourseCard from "../cards/CourseCard";
import ProjectCard from "../cards/ProjectCard";
import { Button } from "../ui/button";
import { ProjectWithCourse } from "@/lib/actions/projects.action";
import { CourseWithCategory } from "@/lib/actions/courses.action";
import Link from "next/link";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LatestProjectsAndCourses = ({
  projects,
  courses,
}: {
  projects: ProjectWithCourse[];
  courses: CourseWithCategory[];
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
        defaults: { ease: "power3.out", clearProps: "all" },
      });

      // SectionTitle handles its own animations, so we only need to animate the content
      tl.from(".col-header", {
        opacity: 0,
        y: 16,
        duration: 0.45,
        stagger: 0.12,
      })
        .from(
          ".proj-card",
          { opacity: 0, x: -24, duration: 0.45, stagger: 0.1 },
          "-=0.25",
        )
        .from(
          ".course-card",
          { opacity: 0, x: 24, duration: 0.45, stagger: 0.1 },
          "-=0.55",
        )
        .from(
          ".view-all-btn",
          { opacity: 0, y: 10, duration: 0.4, stagger: 0.1 },
          "-=0.2",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30 overflow-hidden">
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

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Projects column */}
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

            <div className="space-y-3 mb-4">
              {projects?.map((project, index) => (
                <div key={project.id ?? index} className="proj-card">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="view-all-btn w-full group"
              asChild
            >
              <Link href={ROUTES.PROJECTS}>
                View all projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Courses column */}
          <div>
            <div className="col-header flex items-center gap-2.5 mb-5 pb-4 border-b border-border/50">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-foreground" />
              </div>
              <span className="text-sm font-medium">New Courses</span>
              <span className="ml-auto text-xs text-muted-foreground border border-border/50 px-2 py-0.5 rounded-full">
                {courses?.length ?? 0} new
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {courses?.map((course) => (
                <div key={course.id} className="course-card">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="view-all-btn w-full group"
              asChild
            >
              <Link href={ROUTES.COURSES}>
                Browse all courses
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestProjectsAndCourses;
