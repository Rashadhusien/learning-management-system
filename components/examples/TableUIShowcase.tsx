"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  Users,
  Star,
  TrendingUp
} from "lucide-react";

// Sample data for demonstration
const sampleCourses = [
  {
    id: "1",
    title: "Advanced React Development",
    description: "Master React with advanced patterns and best practices",
    level: "Advanced",
    category: { name: "Web Development", icon: "💻" },
    price: 149,
    duration: 40,
    isPublished: true,
    instructorId: "inst-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    bannerUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
  },
  {
    id: "2", 
    title: "Machine Learning Fundamentals",
    description: "Introduction to ML algorithms and practical applications",
    level: "Beginner",
    category: { name: "Machine Learning", icon: "🤖" },
    price: 199,
    duration: 60,
    isPublished: true,
    instructorId: "inst-2",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05"),
    bannerUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400",
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Learn modern design principles and user experience",
    level: "Intermediate",
    category: { name: "UI/UX Design", icon: "🎨" },
    price: 99,
    duration: 30,
    isPublished: false,
    instructorId: "inst-3",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-15"),
    bannerUrl: "https://images.unsplash.com/photo-1559028006-848e65271f37?w=400",
  },
];

export function TableUIShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Enhanced Table UI</h1>
        <p className="text-muted-foreground">
          Modern, accessible, and visually appealing table design with improved borders, spacing, and interactions
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/40 bg-background/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              Modern Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clean borders, subtle shadows, and gradient backgrounds for visual hierarchy
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-background/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              Enhanced UX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Smooth transitions, hover effects, and intuitive interactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-background/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-green-500" />
              </div>
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              High contrast, keyboard navigation, and screen reader support
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Demo */}
      <Card className="border-border/40 bg-background/95 backdrop-blur">
        <CardHeader>
          <CardTitle>Sample Course Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg border border-border/40 bg-background/95 backdrop-blur shadow-lg overflow-hidden">
            <table className="w-full border-separate border-spacing-0">
              {/* Header */}
              <thead className="border-b border-border/40 bg-muted/30">
                <tr>
                  <th className="h-14 px-4 text-left align-middle font-semibold text-foreground/90 text-sm whitespace-nowrap border-b border-border/30 bg-gradient-to-r from-muted/40 to-muted/20 first:rounded-tl-lg first:border-l-0">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-border/40" />
                      <span>Course</span>
                    </div>
                  </th>
                  <th className="h-14 px-4 text-left align-middle font-semibold text-foreground/90 text-sm whitespace-nowrap border-b border-border/30 bg-gradient-to-r from-muted/40 to-muted/20">
                    Level
                  </th>
                  <th className="h-14 px-4 text-left align-middle font-semibold text-foreground/90 text-sm whitespace-nowrap border-b border-border/30 bg-gradient-to-r from-muted/40 to-muted/20">
                    Category
                  </th>
                  <th className="h-14 px-4 text-left align-middle font-semibold text-foreground/90 text-sm whitespace-nowrap border-b border-border/30 bg-gradient-to-r from-muted/40 to-muted/20">
                    Price
                  </th>
                  <th className="h-14 px-4 text-left align-middle font-semibold text-foreground/90 text-sm whitespace-nowrap border-b border-border/30 bg-gradient-to-r from-muted/40 to-muted/20">
                    Duration
                  </th>
                  <th className="h-14 px-4 text-left align-middle font-semibold text-foreground/90 text-sm whitespace-nowrap border-b border-border/30 bg-gradient-to-r from-muted/40 to-muted/20">
                    Status
                  </th>
                  <th className="h-14 px-4 text-left align-middle font-semibold text-foreground/90 text-sm whitespace-nowrap border-b border-border/30 bg-gradient-to-r from-muted/40 to-muted/20 last:rounded-tr-lg last:border-r-0">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {sampleCourses.map((course, index) => (
                  <tr 
                    key={course.id}
                    className="transition-all duration-200 ease-in-out border-b border-border/20 hover:bg-muted/30 hover:shadow-sm first:border-t-0 last:border-b-0"
                  >
                    <td className="p-4 align-middle border-b border-border/10 text-foreground/80 first:pl-4 last:pr-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-border/40" />
                        <div className="flex items-center gap-3">
                          <img 
                            src={course.bannerUrl} 
                            alt={course.title}
                            className="w-10 h-10 rounded-lg object-cover border border-border/20"
                          />
                          <div>
                            <div className="font-medium text-foreground">{course.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                              {course.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4 align-middle border-b border-border/10 text-foreground/80">
                      <Badge 
                        variant="outline" 
                        className="bg-purple-100 text-purple-800 border-purple-200"
                      >
                        <span className="flex items-center gap-1">
                          <span>🌳</span>
                          <span>{course.level}</span>
                        </span>
                      </Badge>
                    </td>
                    
                    <td className="p-4 align-middle border-b border-border/10 text-foreground/80">
                      <Badge 
                        variant="outline" 
                        className="bg-blue-100 text-blue-800 border-blue-200"
                      >
                        <span className="flex items-center gap-1">
                          <span>{course.category.icon}</span>
                          <span>{course.category.name}</span>
                        </span>
                      </Badge>
                    </td>
                    
                    <td className="p-4 align-middle border-b border-border/10 text-foreground/80">
                      <div className="font-semibold text-foreground">${course.price}</div>
                    </td>
                    
                    <td className="p-4 align-middle border-b border-border/10 text-foreground/80">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration}h</span>
                      </div>
                    </td>
                    
                    <td className="p-4 align-middle border-b border-border/10 text-foreground/80">
                      <Badge 
                        variant="outline" 
                        className={course.isPublished 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        <span className="flex items-center gap-1">
                          <span>{course.isPublished ? "✅" : "📝"}</span>
                          <span>{course.isPublished ? "Published" : "Draft"}</span>
                        </span>
                      </Badge>
                    </td>
                    
                    <td className="p-4 align-middle border-b border-border/10 text-foreground/80">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Demo */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
              <span>Rows per page:</span>
              <select className="h-8 w-16 rounded-md border border-border/40 bg-background/50 px-2 text-xs focus:border-primary/50 focus:ring-1 focus:ring-primary/20">
                <option>10</option>
                <option>20</option>
                <option>30</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 border-border/40 bg-background/50 hover:bg-background/80">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>
              
              <div className="flex items-center gap-1 text-sm font-medium text-foreground/90">
                <span>Page</span>
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                  1
                </span>
                <span>of</span>
                <span>1</span>
              </div>
              
              <Button variant="outline" size="sm" className="h-8 border-border/40 bg-background/50 hover:bg-background/80">
                Next
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design Principles */}
      <Card className="border-border/40 bg-background/95 backdrop-blur">
        <CardHeader>
          <CardTitle>Design Improvements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Visual Enhancements</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Rounded corners with subtle shadows
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Gradient backgrounds for headers
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  Improved border opacity and spacing
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  Backdrop blur for modern glass effect
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Interaction Improvements</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Smooth hover transitions
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Enhanced search input with icon
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  Better pagination controls
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  Improved empty state design
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
