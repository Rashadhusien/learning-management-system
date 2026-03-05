import React, from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, Clock, Star } from "lucide-react";
import Link from "next/link";
import { getAllCourses } from "@/lib/actions/courses.action";



const AdminCourses = async () => {
  const courses = await getAllCourses();

  console.log(courses);

  // const [courses, setCourses] = useState<Course[]>([
  //   {
  //     id: "1",
  //     title: "Complete Web Development Bootcamp",
  //     description:
  //       "Learn modern web development from scratch with React, Node.js, and more",
  //     level: "Beginner",
  //     duration: "12 weeks",
  //     enrolledCount: 1250,
  //     rating: 4.8,
  //     status: "published",
  //   },
  //   {
  //     id: "2",
  //     title: "Advanced React & Next.js",
  //     description:
  //       "Master React patterns, performance optimization, and Next.js framework",
  //     level: "Advanced",
  //     duration: "8 weeks",
  //     enrolledCount: 450,
  //     rating: 4.9,
  //     status: "published",
  //   },
  //   {
  //     id: "3",
  //     title: "Python for Data Science",
  //     description:
  //       "Complete Python programming with focus on data analysis and machine learning",
  //     level: "Intermediate",
  //     duration: "10 weeks",
  //     enrolledCount: 890,
  //     rating: 4.7,
  //     status: "draft",
  //   },
  // ]);

  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  // const [formData, setFormData] = useState({
  //   title: "",
  //   description: "",
  //   level: "",
  //   duration: "",
  //   status: "draft" as const,
  // });

  // const handleAddCourse = () => {
  //   setEditingCourse(null);
  //   setFormData({
  //     title: "",
  //     description: "",
  //     level: "",
  //     duration: "",
  //     status: "draft",
  //   });
  //   setIsDialogOpen(true);
  // };

  // const handleEditCourse = (course: Course) => {
  //   setEditingCourse(course);
  //   setFormData({
  //     title: course.title,
  //     description: course.description,
  //     level: course.level,
  //     duration: course.duration,
  //     status: course.status,
  //   });
  //   setIsDialogOpen(true);
  // };

  // const handleSaveCourse = () => {
  //   if (editingCourse) {
  //     // Update existing course
  //     setCourses(
  //       courses.map((course) =>
  //         course.id === editingCourse.id ? { ...course, ...formData } : course,
  //       ),
  //     );
  //   } else {
  //     // Add new course
  //     const newCourse: Course = {
  //       id: Date.now().toString(),
  //       ...formData,
  //       enrolledCount: 0,
  //       rating: 0,
  //     };
  //     setCourses([...courses, newCourse]);
  //   }
  //   setIsDialogOpen(false);
  // };

  // const handleDeleteCourse = (id: string) => {
  //   setCourses(courses.filter((course) => course.id !== id));
  // };

  const getStatusColor = (status: Course["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">
            Manage your courses, content, and student enrollment
          </p>
        </div>
        {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild> */}
        <Link href="/admin/courses/create">
          <Button  className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Courses
                </p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Published
                </p>
                <p className="text-2xl font-bold">
                  {courses.filter((c) => c.status === "published").length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Students
                </p>
                <p className="text-2xl font-bold">
                  {courses
                    .reduce((sum, c) => sum + c.enrolledCount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Rating
                </p>
                <p className="text-2xl font-bold">
                  {(
                    courses.reduce((sum, c) => sum + c.rating, 0) /
                    courses.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Courses List */}
      {/* <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <p className="text-muted-foreground">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrolledCount.toLocaleString()} students
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {course.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{course.level}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  );
};

export default AdminCourses;
