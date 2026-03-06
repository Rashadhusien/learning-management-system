"use client";

import { Achievement } from "@/types/action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AchievementsTable } from "./AchievementsTable";

interface AchievementsTableWrapperProps {
  data: Achievement[];
}

export function AchievementsTableWrapper({ data }: AchievementsTableWrapperProps) {
  const router = useRouter();

  const handleEdit = (achievement: Achievement) => {
    console.log("Edit achievement:", achievement);
    // Navigate to edit page
    router.push(`/admin/achievements/${achievement.id}/edit`);
  };

  const handleDelete = async (achievement: Achievement) => {
    console.log("Delete achievement:", achievement);

    if (confirm(`Are you sure you want to delete "${achievement.title}"?`)) {
      try {
        // TODO: Implement deleteAchievement action
        // const result = await deleteAchievement(achievement.id);
        // if (result.success) {
        //   toast.success("Success", {
        //     description: "Achievement deleted successfully",
        //   });
        //   // Refresh the page to show updated data
        //   router.refresh();
        // } else {
        //   toast.error("Error", {
        //     description: result.error || "Failed to delete achievement",
        //   });
        // }
        
        // For now, just show a placeholder message
        toast.info("Info", {
          description: "Delete functionality not implemented yet",
        });
      } catch (error) {
        console.error("Error deleting achievement:", error);
        toast.error("Error", {
          description: "Failed to delete achievement",
        });
      }
    }
  };

  const handleView = (achievement: Achievement) => {
    console.log("View achievement:", achievement);
    // Navigate to view page
    router.push(`/admin/achievements/${achievement.id}`);
  };

  return (
    <AchievementsTable 
      data={data} 
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
