"use client";

import { ROUTES } from "@/constants/routes";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import CourseCard from "../cards/CourseCard";
import { Button } from "../ui/button";
import { CourseWithCategory } from "@/lib/actions/courses.action";
import Link from "next/link";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";

const LatestCourses = ({ courses }: { courses: CourseWithCategory[] }) => {
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
              <BookOpen className="h-4 w-4 text-foreground" />
            </div>
            <span className="text-sm font-medium">New Courses</span>
            <span className="ml-auto text-xs text-muted-foreground border border-border/50 px-2 py-0.5 rounded-full">
              {courses?.length ?? 0} new
            </span>
          </div>

          <div className="space-y-3 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses?.map((course) => (
              <div key={course.id} className="course-card ">
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="rs-btn w-full max-w-sm mx-auto flex items-center group"
            asChild
          >
            <Link href={ROUTES.COURSES}>
              Browse all courses
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestCourses;
