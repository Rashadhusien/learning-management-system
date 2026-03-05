"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateProjectForm from "@/components/forms/admin/CreateProjectForm";

const CreateProject = () => {
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
        <h2 className="text-2xl font-bold">Create Project</h2>
      </div>
      <div className="mt-4 flex justify-center items-center">
        <CreateProjectForm />
      </div>
    </section>
  );
};

export default CreateProject;
