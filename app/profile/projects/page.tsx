import DataRenderer from "@/components/DataRenderer";
import ProjectCard from "@/components/cards/ProjectCard";
import { Card } from "@/components/ui/card";
import { EMPTY_PROJECT } from "@/constants/states";
import { getStudentProjects } from "@/lib/actions/projects.action";

const ProfileProjects = async (searchParams: {
  page?: string;
  pageSize?: string;
}) => {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const { success, error, data, pagination } = await getStudentProjects({
    page,
    pageSize,
  });
  return (
    <section className="p-6">
      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-semibold">My Projects</h2>
          <p className="text-muted-foreground mt-2">
            You can always upload your projects here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mt-10">
          <DataRenderer
            success={success}
            error={typeof error === "string" ? { message: error } : error}
            data={data}
            empty={EMPTY_PROJECT}
            render={(data) =>
              data.map((project) => {
                return <ProjectCard key={project.id} project={project} />;
              })
            }
          />
        </div>
      </Card>
    </section>
  );
};

export default ProfileProjects;
