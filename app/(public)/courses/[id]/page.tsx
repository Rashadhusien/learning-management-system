const CourseDetail = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return <div>CourseDetail {id}</div>;
};

export default CourseDetail;
