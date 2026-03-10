"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { enrollInCourse } from "@/lib/actions/enrollments.action";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled?: boolean;
}

export default function EnrollButton({ courseId, isEnrolled = false }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);

  const handleEnroll = async () => {
    if (enrolled) {
      toast.info("Already Enrolled", {
        description: "You are already enrolled in this course",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await enrollInCourse(courseId);
      
      if (result.success) {
        toast.success("Enrollment Successful!", {
          description: "You have been enrolled in the course",
        });
        setEnrolled(true);
      } else {
        toast.error("Enrollment Failed", {
          description: result.error || "Failed to enroll in course",
        });
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Enrollment Failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className="w-full" 
      size="lg" 
      onClick={handleEnroll}
      disabled={enrolled || isLoading}
    >
      {isLoading ? "Enrolling..." : enrolled ? "✓ Enrolled" : "Enroll Now"}
    </Button>
  );
}
