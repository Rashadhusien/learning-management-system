import DataRenderer from "@/components/DataRenderer";
import SectionTitle from "@/components/SectionTitle";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import GlobalPagination from "@/components/ui/global-pagination";
import { CoursesFilters } from "@/constants/filters";
import { ROUTES } from "@/constants/routes";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Achievements = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, sort } = await searchParams;

  // const { success, data, error, pagination } = await getAllAchivements({
  //   page: Number(page) || 1,
  //   pageSize: Number(pageSize) || 10,
  //   query: query || "",
  //   sort: sort || "",
  // });

  return (
    <section className="container mx-auto my-8">
      <SectionTitle
        title="Achievements"
        description="Collect badges and trophies as you complete courses."
      />

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COURSES}
          iconPosition="left"
          placeholder="Search amazing minds here..."
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={CoursesFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          paramKey="sort"
        />
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mt-10">
        <DataRenderer
          success={success}
          error={typeof error === "string" ? { message: error } : error}
          data={data}
          empty={EMYPTY_COURSE}
          render={(data) =>
            data.map((course) => {
              return <CourseCard key={course.id} course={course} />;
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
      )} */}
    </section>
  );
};

export default Achievements;
