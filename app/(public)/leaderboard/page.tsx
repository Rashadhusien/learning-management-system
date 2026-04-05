import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";
import {
  LeaderboardStudent,
  getLeaderboard,
} from "@/lib/actions/achievements.action";
import CloudinaryImage from "@/components/Image";
import PageTitle from "@/components/PageTitle";

// ─── Podium Card ────────────────────────────────────────────────────────────

const rankConfig = {
  1: {
    accent: "border-t-[3px] border-t-yellow-400",
    ringBorder: "ring-2 ring-yellow-400",
    pillBg: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    base: "bg-yellow-400 h-16",
    medal: "bg-yellow-400",
    label: "1",
    order: "order-2",
    podiumHeight: "self-end",
  },
  2: {
    accent: "border-t-[3px] border-t-slate-400",
    ringBorder: "ring-2 ring-slate-400",
    pillBg: "bg-slate-50 text-slate-600 border border-slate-200",
    base: "bg-slate-400 h-12",
    medal: "bg-slate-400",
    label: "2",
    order: "order-1",
    podiumHeight: "self-end",
  },
  3: {
    accent: "border-t-[3px] border-t-amber-700",
    ringBorder: "ring-2 ring-amber-700",
    pillBg: "bg-amber-50 text-amber-800 border border-amber-200",
    base: "bg-amber-700 h-8",
    medal: "bg-amber-700",
    label: "3",
    order: "order-3",
    podiumHeight: "self-end",
  },
} as const;

function PodiumCard({ student }: { student: LeaderboardStudent }) {
  const rank = student.rank as 1 | 2 | 3;
  const cfg = rankConfig[rank];

  return (
    <div
      className={`flex flex-col items-center w-full max-w-[220px] ${cfg.order} ${cfg.podiumHeight}`}
    >
      {/* Card */}
      <div
        className={`w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${cfg.accent} shadow-sm hover:-translate-y-1 transition-transform duration-200 overflow-hidden`}
      >
        <div className="p-4 flex flex-col items-center text-center gap-2">
          {/* Avatar */}
          <div className="relative">
            <div className={`rounded-full ${cfg.ringBorder} p-0.5`}>
              <CloudinaryImage
                src={student.imageCldPubId || "/default-avatar.png"}
                alt={student.name}
                width={64}
                height={64}
                className="rounded-full w-16 h-16 object-cover"
              />
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-zinc-900 ${cfg.medal}`}
            >
              {cfg.label}
            </span>
          </div>

          {/* Name */}
          <div>
            <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
              {student.name}
            </p>
            <p className="text-xs text-zinc-400">@{student.username}</p>
          </div>

          {/* Points */}
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${cfg.pillBg}`}
          >
            {student.totalPoints.toLocaleString()} pts
          </span>

          {/* Stats */}
          <div className="flex gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              {student.totalProjects} projects
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              {student.totalCourses} courses
            </span>
          </div>
        </div>
      </div>

      {/* Podium base */}
      <div
        className={`w-full rounded-t-lg flex items-center justify-center text-white font-bold text-lg mt-2 ${cfg.base}`}
      >
        {cfg.label}
      </div>
    </div>
  );
}

// ─── Podium Section ──────────────────────────────────────────────────────────

function Podium({ topStudents }: { topStudents: LeaderboardStudent[] }) {
  return (
    <div className="mb-10">
      {/* Desktop: side-by-side with podium bases */}
      <div className="hidden sm:flex items-end justify-center gap-3 mb-0">
        {[2, 1, 3].map((rank) => {
          const student = topStudents.find((s) => s.rank === rank);
          if (!student) return null;
          return <PodiumCard key={rank} student={student} />;
        })}
      </div>

      {/* Mobile: stacked vertically, no base */}
      <div className="flex sm:hidden flex-col gap-3">
        {[1, 2, 3].map((rank) => {
          const student = topStudents.find((s) => s.rank === rank);
          if (!student) return null;
          const cfg = rankConfig[rank as 1 | 2 | 3];
          return (
            <div
              key={rank}
              className={`flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${cfg.accent}`}
            >
              {/* Rank number */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 ${cfg.medal}`}
              >
                {rank}
              </div>

              {/* Avatar */}
              <div className={`rounded-full ${cfg.ringBorder} p-0.5 shrink-0`}>
                <CloudinaryImage
                  src={student.imageCldPubId || "/default-avatar.png"}
                  alt={student.name}
                  width={44}
                  height={44}
                  className="rounded-full w-11 h-11 object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                  {student.name}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  @{student.username}
                </p>
                <div className="flex gap-1.5 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {student.totalProjects}P
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {student.totalCourses}C
                  </span>
                </div>
              </div>

              {/* Points */}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.pillBg}`}
              >
                {student.totalPoints.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const Leaderboard = async () => {
  const leaderboardResult = await getLeaderboard();
  const allStudents = leaderboardResult.success ? leaderboardResult.data : [];
  const top3 = allStudents.filter((s) => s.rank <= 3);
  const rest = allStudents.filter((s) => s.rank > 3);

  return (
    <section className="container mx-auto px-4 pt-8 pb-20">
      <PageTitle
        title="Leaderboard"
        description="Discover the top students earning points through projects, courses, and challenges."
      />

      {/* Podium */}
      {top3.length > 0 && <Podium topStudents={top3} />}

      {/* Full rankings table */}
      {rest.length > 0 && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
          {/* Table header */}
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Full rankings
            </h3>
          </div>

          {/* Scrollable on small screens */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800/50">
                  <TableHead className="w-14 text-xs uppercase tracking-wide text-zinc-400">
                    Rank
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-zinc-400">
                    Student
                  </TableHead>
                  <TableHead className="text-center text-xs uppercase tracking-wide text-zinc-400 hidden sm:table-cell">
                    Projects
                  </TableHead>
                  <TableHead className="text-center text-xs uppercase tracking-wide text-zinc-400 hidden sm:table-cell">
                    Courses
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wide text-zinc-400">
                    Points
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rest.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* Rank */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold ${
                          student.rank <= 10
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {student.rank}
                      </span>
                    </TableCell>

                    {/* Student */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <CloudinaryImage
                          src={student.imageCldPubId || "/default-avatar.png"}
                          alt={student.name}
                          width={36}
                          height={36}
                          className="rounded-full w-9 h-9 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {student.name}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">
                            @{student.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Projects — hidden on mobile */}
                    <TableCell className="text-center hidden sm:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        {student.totalProjects}
                      </span>
                    </TableCell>

                    {/* Courses — hidden on mobile */}
                    <TableCell className="text-center hidden sm:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        {student.totalCourses}
                      </span>
                    </TableCell>

                    {/* Points */}
                    <TableCell className="text-right">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {student.totalPoints.toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {allStudents.length === 0 && (
        <div className="text-center text-zinc-400 py-16 text-sm">
          No students found in the leaderboard yet.
        </div>
      )}
    </section>
  );
};

export default Leaderboard;
