"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, Star } from "lucide-react";
import { Course } from "@/types/action.d";
import { getAllCourses, getCoursesByCategory } from "@/lib/actions/courses.action";

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 relative">
        <img
          src={course.bannerUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={course.isPublished ? "default" : "secondary"}>
            {course.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            {course.category && (
              <div className="flex items-center gap-2 mt-2">
                {course.category.icon && (
                  <span className="text-lg">{course.category.icon}</span>
                )}
                <Badge variant="outline" className="text-xs">
                  {course.category.name}
                </Badge>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              ${course.price}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}h</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.level}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {course.level}
          </Badge>
        </div>
        
        <Button className="w-full">
          View Course
        </Button>
      </CardContent>
    </Card>
  );
}

export function CoursesWithCategories() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getAllCourses();
        if (result.success && result.data) {
          setAllCourses(result.data);
          setFilteredCourses(result.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchCoursesByCategory = async () => {
        setLoading(true);
        try {
          const result = await getCoursesByCategory(selectedCategory);
          if (result.success && result.data) {
            setFilteredCourses(result.data);
          }
        } catch (error) {
          console.error("Error fetching courses by category:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCoursesByCategory();
    } else {
      setFilteredCourses(allCourses);
    }
  }, [selectedCategory, allCourses]);

  // Extract unique categories from courses
  const categories = Array.from(
    new Set(
      allCourses
        .filter(course => course.category)
        .map(course => course.category!)
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <p className="text-muted-foreground">
          Explore our courses by category
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
        >
          All Courses
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon && <span>{category.icon}</span>}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            {selectedCategory
              ? "No courses available in this category yet."
              : "No courses available yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
