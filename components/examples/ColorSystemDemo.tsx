"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  COURSE_LEVELS, 
  CATEGORY_COLORS, 
  COURSE_STATUS,
  getLevelConfig,
  getCategoryConfig,
  getStatusConfig
} from "@/constants/colors";

export function ColorSystemDemo() {
  // Sample data for demonstration
  const sampleLevels = Object.keys(COURSE_LEVELS);
  const sampleCategories = CATEGORY_COLORS.slice(0, 4);
  const sampleStatuses = ["published", "draft", "archived"];

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Color System Demo</h1>
        <p className="text-muted-foreground">
          Visual representation of course levels, categories, and status colors
        </p>
      </div>

      {/* Course Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Course Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sampleLevels.map((level) => {
              const config = getLevelConfig(level);
              return (
                <div key={level} className="text-center space-y-2">
                  <Badge variant={config.badgeVariant} className={config.color}>
                    <span className="flex items-center gap-1">
                      <span>{config.icon}</span>
                      <span>{config.name}</span>
                    </span>
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {config.color}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Course Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleCategories.map((category) => {
              const config = getCategoryConfig(category.name);
              return (
                <div key={category.name} className="text-center space-y-2">
                  <div className={`p-4 rounded-lg bg-gradient-to-r ${config.gradient}`}>
                    <span className="text-2xl">{config.icon}</span>
                  </div>
                  <Badge variant="outline" className={config.color}>
                    <span className="flex items-center gap-1">
                      <span>{config.icon}</span>
                      <span>{category.name}</span>
                    </span>
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {config.color}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Course Status */}
      <Card>
        <CardHeader>
          <CardTitle>Course Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleStatuses.map((status) => {
              const isPublished = status === "published";
              const isDeleted = status === "archived";
              const config = getStatusConfig(isPublished, isDeleted);
              
              return (
                <div key={status} className="text-center space-y-2">
                  <Badge variant="outline" className={config.color}>
                    <span className="flex items-center gap-1">
                      <span>{config.icon}</span>
                      <span>{config.name}</span>
                    </span>
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {config.color}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">In Components:</h4>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`// Level Badge
const levelConfig = getLevelConfig(course.level);
<Badge variant={levelConfig.badgeVariant} className={levelConfig.color}>
  <span>{levelConfig.icon}</span> {levelConfig.name}
</Badge>

// Category Badge  
const categoryConfig = getCategoryConfig(course.category?.name);
<Badge variant="outline" className={categoryConfig.color}>
  <span>{categoryConfig.icon}</span> {categoryConfig.name}
</Badge>

// Status Badge
const statusConfig = getStatusConfig(course.isPublished, course.isDeleted);
<Badge variant="outline" className={statusConfig.color}>
  <span>{statusConfig.icon}</span> {statusConfig.name}
</Badge>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
