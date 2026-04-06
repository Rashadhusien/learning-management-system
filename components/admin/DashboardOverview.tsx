"use client";

import {
  BarChart3,
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuickActions from "./QuickActions";

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalProjects: number;
  totalAchievements: number;
  recentEnrollments: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: "enrollment" | "submission" | "achievement";
  user: string;
  action: string;
  timestamp: string;
}

interface TopCourse {
  id: string;
  title: string;
  enrollments: number;
  completionRate: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  topCourses: TopCourse[];
}

export default function DashboardOverview({
  stats,
  recentActivities,
  topCourses,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          trend="+12%"
          trendColor="text-green-600"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses.toLocaleString()}
          icon={<BookOpen className="w-5 h-5" />}
          trend="+3"
          trendColor="text-blue-600"
        />
        <StatCard
          title="Total Projects"
          value={stats.totalProjects.toLocaleString()}
          icon={<BarChart3 className="w-5 h-5" />}
          trend="+8"
          trendColor="text-purple-600"
        />
        <StatCard
          title="Achievements"
          value={stats.totalAchievements.toLocaleString()}
          icon={<Trophy className="w-5 h-5" />}
          trend="+5"
          trendColor="text-yellow-600"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <QuickActions className="lg:col-span-3" />

        {/* Completion Rate Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Course Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-muted-foreground">
                  {stats.completionRate}%
                </span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />

              <div className="space-y-3">
                {topCourses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate">
                        {course.title}
                      </span>
                      <span className="text-muted-foreground">
                        {course.completionRate}%
                      </span>
                    </div>
                    <Progress value={course.completionRate} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.enrollments} students enrolled
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{course.completionRate}%</p>
                  <p className="text-sm text-muted-foreground">completion</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendColor: string;
}

function StatCard({ title, value, icon, trend, trendColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-sm ${trendColor}`}>{trend}</p>
          </div>
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: RecentActivity }) {
  const getIcon = () => {
    switch (activity.type) {
      case "enrollment":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "submission":
        return <BarChart3 className="w-4 h-4 text-green-600" />;
      case "achievement":
        return <Trophy className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{activity.user}</p>
        <p className="text-xs text-muted-foreground">{activity.action}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {activity.timestamp}
        </p>
      </div>
    </div>
  );
}
