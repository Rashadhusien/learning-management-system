import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_ACHIEVEMENT } from "@/constants/states";
import { getAllAchievements } from "@/lib/actions/achievements.action";
import { AchievementsTableWrapper } from "@/components/tables/Admin/achievements/AchievementsTableWrapper";

const AdminAchievements = async () => {
  const achievements = await getAllAchievements({
    page: 1,
    pageSize: 10,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Achievements Management</h1>
          <p className="text-muted-foreground">
            Manage your course achievements and organize your content
          </p>
        </div>
        <Link href="/admin/achievements/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Achievement
          </Button>
        </Link>
      </div>

      <DataRenderer
        success={achievements.success}
        error={achievements.error}
        data={achievements.data}
        empty={EMPTY_ACHIEVEMENT}
        render={(data) => <AchievementsTableWrapper data={data} />}
      />
    </div>
  );
};

export default AdminAchievements;
