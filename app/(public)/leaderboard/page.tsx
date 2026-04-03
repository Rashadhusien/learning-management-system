import SectionTitle from "@/components/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Medal, Award } from "lucide-react";
import {
  LeaderboardStudent,
  getLeaderboard,
} from "@/lib/actions/achievements.action";
import CloudinaryImage from "@/components/Image";

// Podium component for top 3
function Podium({ topStudents }: { topStudents: LeaderboardStudent[] }) {
  const getPodiumPosition = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-lg" />,
          bgColor:
            "bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500",
          textColor: "text-white",
          borderColor: "border-yellow-400",
          shadowColor: "shadow-yellow-400/50",
          height: "h-40",
          cardHeight: "h-56",
          zIndex: "z-30",
          scale: "scale-110",
          medal: "🥇",
        };
      case 2:
        return {
          icon: <Medal className="w-8 h-8 text-gray-300 drop-shadow-lg" />,
          bgColor: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
          textColor: "text-white",
          borderColor: "border-gray-400",
          shadowColor: "shadow-gray-400/50",
          height: "h-40",
          cardHeight: "h-48",
          zIndex: "z-20",
          scale: "scale-100",
          medal: "🥈",
        };
      case 3:
        return {
          icon: <Award className="w-8 h-8 text-amber-600 drop-shadow-lg" />,
          bgColor:
            "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800",
          textColor: "text-white",
          borderColor: "border-amber-700",
          shadowColor: "shadow-amber-700/50",
          height: "h-32",
          cardHeight: "h-44",
          zIndex: "z-20",
          scale: "scale-100",
          medal: "🥉",
        };
      default:
        return null;
    }
  };

  // Position: 2nd left, 1st center, 3rd right
  const podiumOrder = [2, 1, 3];

  return (
    <div className="relative mb-5">
      {/* Podium Platform */}
      <div className="flex justify-center items-end gap-8 mb-8 relative mt-8">
        {podiumOrder.map((rank) => {
          const student = topStudents.find((s) => s.rank === rank);
          const position = getPodiumPosition(rank);

          if (!student || !position) return null;

          return (
            <div
              key={rank}
              className={`relative flex flex-col  items-center ${position.zIndex} ${position.scale} transition-all duration-500 `}
            >
              {/* Student Card */}
              <Card
                className={`bg-muted  max-h-56 ${rank === 1 ? "mb-10" : rank === 2 ? "mb-5" : "mb-4"}  w-56 flex flex-col justify-center items-center text-center border ${position.borderColor} shadow-2xl ${position.shadowColor} transform transition-all duration-300 hover:shadow-3xl relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                </div>

                <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                  <div className="mb-4">
                    <div className="relative">
                      <CloudinaryImage
                        src={student.imageCldPubId || "/default-avatar.png"}
                        alt={student.name}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-white shadow-xl w-20 h-20 object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 text-lg">
                        {position.medal}
                      </div>
                    </div>
                  </div>
                  <h3
                    className={`font-bold text-xl ${position.textColor} mb-1 drop-shadow-lg`}
                  >
                    {student.name}
                  </h3>
                  <p
                    className={`text-sm ${position.textColor} opacity-90 mb-4`}
                  >
                    @{student.username}
                  </p>
                  <div className="space-y-3 w-full">
                    <Badge
                      variant="secondary"
                      className="bg-white/25 text-white border-white/40 text-base px-3 py-2 w-full justify-center shadow-lg"
                    >
                      <span className="font-bold">
                        {student.totalPoints.toLocaleString()}
                      </span>{" "}
                      points
                    </Badge>
                    <div className="flex gap-2 justify-center">
                      <Badge
                        variant="outline"
                        className="text-xs bg-white/15 text-white border-white/30 px-2 py-1"
                      >
                        {student.totalProjects} projects
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs bg-white/15 text-white border-white/30 px-2 py-1"
                      >
                        {student.totalCourses} courses
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Podium Shadow */}
      <div className="flex justify-center gap-8">
        {[2, 1, 3].map((rank) => {
          const position = getPodiumPosition(rank);
          if (!position) return null;
          return (
            <div
              key={`shadow-${rank}`}
              className={`${rank === 1 ? "w-24" : rank === 2 ? "w-20" : "w-20"} h-4 bg-black/10 rounded-full blur-md -mt-2`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

const Leaderboard = async () => {
  const leaderboardResult = await getLeaderboard();
  const allStudents = leaderboardResult.success ? leaderboardResult.data : [];
  console.log(allStudents);
  const top3 = allStudents.filter((student) => student.rank <= 3);
  const rest = allStudents.filter((student) => student.rank > 3);

  return (
    <section className="container mx-auto pt-8 pb-20">
      <SectionTitle
        title="Leaderboard"
        description="Discover the top students earning points through projects, courses, and challenges."
      />

      {/* Top 3 Podium */}
      {top3 && top3.length > 0 && <Podium topStudents={top3} />}

      {/* Rest of the leaderboard table */}
      {rest.length > 0 && (
        <Card className="mx-auto container">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-muted-foreground" />
              Full Rankings
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Projects</TableHead>
                  <TableHead className="text-center">Courses</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rest.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Badge
                        variant={student.rank <= 10 ? "default" : "secondary"}
                      >
                        #{student.rank}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <CloudinaryImage
                          src={student.imageCldPubId || "/default-avatar.png"}
                          alt={student.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            @{student.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{student.totalProjects}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{student.totalCourses}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {student.totalPoints.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {allStudents.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No students found in the leaderboard.
        </div>
      )}
    </section>
  );
};

export default Leaderboard;
