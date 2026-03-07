import DataRenderer from "@/components/DataRenderer";
import AchievementCard from "@/components/cards/AchievementCard";
import CourseCard from "@/components/cards/CourseCard";
import { Card } from "@/components/ui/card";
import { EMPTY_ACHIEVEMENT, EMYPTY_COURSE } from "@/constants/states";
import { getStudentAchievements } from "@/lib/actions/achievements.action";
import { getStudentCourses } from "@/lib/actions/courses.action";

const ProfileAchievements = async (searchParams: {
  page?: string;
  pageSize?: string;
}) => {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const { success, error, data, pagination } = await getStudentAchievements({
    page,
    pageSize,
  });

  console.log("student", data);

  return (
    <section className="p-6">
      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-semibold">
            My Achievements
          </h2>
          <p className="text-muted-foreground mt-2">
            Unlock trophies as you complete courses, projects, and achievements
            across the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mt-10">
          <DataRenderer
            success={success}
            error={typeof error === "string" ? { message: error } : error}
            data={data}
            empty={EMPTY_ACHIEVEMENT}
            render={(data) =>
              data.map((studentAchievement) => {
                return (
                  <AchievementCard
                    key={studentAchievement.id}
                    achievement={studentAchievement.achievement!}
                  />
                );
              })
            }
          />
        </div>
      </Card>
    </section>
  );
};

export default ProfileAchievements;
