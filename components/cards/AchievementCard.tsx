import { Award } from "lucide-react";
import { Achievement } from "@/types/action";
import CloudinaryImage from "../Image";

export default function AchievementCard({
  achievement,
}: {
  achievement: Achievement;
}) {
  const {
    title,
    description,
    progressPercent,
    totalStudents,
    earnedCount,
    imageCldPubId,
    requiredPoints,
  } = achievement;

  return (
    <div className="flex flex-col bg-background border border-border/50 rounded-xl overflow-hidden hover:border-border/80 transition-colors duration-200">
      {/* Body — centered */}
      <div className="flex flex-col items-center text-center gap-2 p-5 flex-1">
        <div className="w-12 h-12 rounded-xl border border-border/50 bg-muted/40 flex items-center justify-center shrink-0">
          {imageCldPubId ? (
            <CloudinaryImage
              src={imageCldPubId}
              alt={title}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <Award
              className="w-5 h-5 text-muted-foreground"
              strokeWidth={1.5}
            />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
            {description ?? "Complete this achievement to earn points!"}
          </p>
        </div>

        <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full border border-border/50 bg-muted/40 text-muted-foreground">
          Earn {requiredPoints} points
        </span>
      </div>

      {/* Progress footer */}
      <div className="px-4 pb-4 pt-3 border-t border-border/50 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            {totalStudents ?? 0} / {earnedCount ?? 0} students
          </span>
          <span>{progressPercent ?? 0}%</span>
        </div>
        <div className="h-1 w-full bg-border/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/60 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
