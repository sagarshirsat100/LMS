import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);
  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-medium text-gray-800">Learn from best</h2>
      <p className="text-sm md:text-base">
        Discouve our coursew across catregoriese.. From codning to design to
        businness and wellnes and our courses.
      </p>
      <div className="grid grid-cols-auto px-4 md:px-0 md:my-16 my-20 gap-4">
        {(allCourses?.slice(0, 4) || []).map((course,index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
      <Link
        to={"/course-list"}
        onClick={() => scrollTo(0, 0)}
        className="text-gray-500 border border-gray-500/30 rounded px-10 py-3"
      >Show all courses</Link> 
    </div>
  );
};

export default CourseSection;
