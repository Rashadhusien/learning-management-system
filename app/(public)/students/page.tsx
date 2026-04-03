import DataRenderer from "@/components/DataRenderer";
import SectionTitle from "@/components/SectionTitle";
import StudentCard from "@/components/cards/StudentCard";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import GlobalPagination from "@/components/ui/global-pagination";
import { StudentsFilters } from "@/constants/filters";
import { ROUTES } from "@/constants/routes";
import { EMPTY_STUDENT } from "@/constants/states";
import { getAllStudents } from "@/lib/actions/students.action";
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Students = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, sort } = await searchParams;

  const { success, data, error, pagination } = await getAllStudents({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    sort: sort || "",
  });
  return (
    <section className="container mx-auto pb-20">
      <SectionTitle
        title="Academy Students"
        description="Explore profiles of students learning, building, and sharing together"
      />
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center mx-3 sm:mx-12">
        <LocalSearch
          route={ROUTES.STUDENTS}
          iconPosition="left"
          placeholder="Search amazing minds here..."
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={StudentsFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          paramKey="sort"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-3  mt-10">
        <DataRenderer
          success={success}
          error={typeof error === "string" ? { message: error } : error}
          data={data}
          empty={EMPTY_STUDENT}
          render={(data) =>
            data.map((student) => {
              return <StudentCard key={student.id} student={student} />;
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

export default Students;
