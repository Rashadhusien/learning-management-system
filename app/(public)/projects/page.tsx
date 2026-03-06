import DataRenderer from "@/components/DataRenderer";
import SectionTitle from "@/components/SectionTitle";
import ProjectCard from "@/components/cards/ProjectCard";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import GlobalPagination from "@/components/ui/global-pagination";
import { ProjectsFilters } from "@/constants/filters";
import { ROUTES } from "@/constants/routes";
import { EMPTY_PROJECT } from "@/constants/states";
import { getAllProjects } from "@/lib/actions/projects.action";
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Projects = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, sort } = await searchParams;

  const { success, data, error, pagination } = await getAllProjects({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    sort: sort || "",
  });
  return (
    <section className="container mx-auto">
      <SectionTitle
        title="Academy Projects"
        description="Explore our collection of coding projects with their point values and completion stats"
      />
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.PROJECTS}
          iconPosition="left"
          placeholder="Search amazing minds here..."
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={ProjectsFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          paramKey="sort"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:mx-4 mt-10">
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
      {pagination && success && (
        <GlobalPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          className="mt-8"
        />
      )}
    </section>
  );
};

export default Projects;
