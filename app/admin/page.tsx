import DashboardOverview from "@/components/admin/DashboardOverview";
import {
  getDashboardStats,
  getTopCourses,
  getRecentActivities,
} from "@/lib/actions/dashboard.action";

const AdminPage = async () => {
  const [stats, topCourses, recentActivities] = await Promise.all([
    getDashboardStats(),
    getTopCourses(),
    getRecentActivities(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor Cody performance and activity
        </p>
      </div>

      <DashboardOverview
        stats={stats}
        topCourses={topCourses}
        recentActivities={recentActivities}
      />
    </div>
  );
};

export default AdminPage;
