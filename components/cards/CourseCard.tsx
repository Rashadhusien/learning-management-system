import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Course } from "@/types/action";

export default function CourseCard({ course }: { course: Course }) {
  const { id, title, description, bannerUrl, level } = course;

  return (
    <div className="group flex flex-col bg-background border border-border/50 rounded-xl overflow-hidden hover:border-border/80 transition-colors duration-200">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted/40 shrink-0">
        <Image
          src={bannerUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          className="object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.04]"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full border border-border/50 bg-muted/40 text-muted-foreground">
            {level}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
        </div>
        <h3 className="text-sm font-medium text-foreground leading-snug">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-3 border-t border-border/50">
        <Link
          href={ROUTES.COURSE_DETAIL(id)}
          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-muted-foreground border border-border/50 rounded-lg hover:bg-muted/50 hover:text-foreground hover:border-border/80 transition-all duration-200"
        >
          View course
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
