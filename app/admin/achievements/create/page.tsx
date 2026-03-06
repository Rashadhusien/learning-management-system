"use client";
import CreateCourseForm from "@/components/forms/admin/CreateCourseForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateCourse = () => {
  const router = useRouter();

  return (
    <section>
      <div className="flex items-center gap-2">
        <Button
          className="cursor-pointer"
          variant="ghost"
          size={"icon"}
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </Button>
        <h2 className="text-2xl font-bold">Create Achievement</h2>
      </div>
      <CreateAchievementForm />
    </section>
  );
};

export default CreateCourse;
