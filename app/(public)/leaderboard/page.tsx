import { auth } from "@/auth";
import DataRenderer from "@/components/DataRenderer";
import SectionTitle from "@/components/SectionTitle";
import ProjectCard from "@/components/cards/ProjectCard";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import GlobalPagination from "@/components/ui/global-pagination";
import { ProjectsFilters } from "@/constants/filters";
import { ROUTES } from "@/constants/routes";
import { EMPTY_PROJECT } from "@/constants/states";
import { getLeaderboard } from "@/lib/actions/achievements.action";
import { getAllProjects } from "@/lib/actions/projects.action";
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Leaderboard = async ({ searchParams }: SearchParams) => {
  const session = await auth();
  const { page, pageSize } = await searchParams;

  const result = await getLeaderboard();

  console.log(result);
  return (
    <section className="container mx-auto">
      <SectionTitle
        title="Leaderboard"
        description="Discover the top students earning points through projects, courses, and challenges."
      />
    </section>
  );
};

export default Leaderboard;
