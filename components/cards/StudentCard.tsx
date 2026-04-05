import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { User } from "@/types/action";
import UserAvatar from "../UserAvatar";

export default function StudentCard({ student }: { student: User }) {
  const { id, name, imageCldPubId, email, totalPoints, level } = student;

  return (
    <div className="group flex flex-col bg-background border border-border/50 rounded-xl overflow-hidden hover:border-border/80 transition-colors duration-200">
      {/* Body — centered */}
      <div className="flex flex-col items-center text-center gap-2 p-5 flex-1">
        <UserAvatar
          imageUrl={imageCldPubId}
          name={name}
          className="h-12 w-12 rounded-full border border-border/50"
        />
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{email}</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full border border-border/50 bg-muted/40 text-muted-foreground">
            {level}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-border/50 bg-muted/40 text-muted-foreground">
            <Star className="w-2.5 h-2.5" />
            {totalPoints} pts
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-3 border-t border-border/50">
        <Link
          href={ROUTES.STUDENT_DETAILS(id)}
          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-muted-foreground border border-border/50 rounded-lg hover:bg-muted/50 hover:text-foreground hover:border-border/80 transition-all duration-200"
        >
          View profile
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
