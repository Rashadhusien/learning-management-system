import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Project } from "@/types/action";

export default function ProjectCard({ project }: { project: Project }) {
  const { id, title, description, imageCldPubId, points } = project;

  return (
    <div className="group flex flex-col bg-background border border-border/50 rounded-xl overflow-hidden hover:border-border/80 transition-colors duration-200">
      {/* Image */}
      <div className="relative h-28 overflow-hidden bg-muted/40 shrink-0 flex items-center justify-center">
        <Image
          src={imageCldPubId}
          alt={title}
          width={300}
          height={112}
          className="object-contain h-full w-full transition-transform duration-350 group-hover:scale-[1.04]"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-border/50 bg-muted/40 text-muted-foreground">
            <Star className="w-2.5 h-2.5" />
            {points} pts
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
          href={ROUTES.PROJECT_DETAILS(id)}
          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-muted-foreground border border-border/50 rounded-lg hover:bg-muted/50 hover:text-foreground hover:border-border/80 transition-all duration-200"
        >
          View project
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
