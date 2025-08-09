import React from "react";
import Footer from "../../components/students/Footer";

import { Line } from "rc-progress";

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } =
    React.useContext(AppContext);
  const [progressArray, setProgressArray] = React.useState([
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 2, totalLectures: 5 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 3, totalLectures: 7 },
    { lectureCompleted: 5, totalLectures: 10 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 8, totalLectures: 10 },
    { lectureCompleted: 2, totalLectures: 6 },
  ]);
  return (
    <>
      <div className="px-8 pt-10 md:px-36">
        <h1 className="text-2xl font-semibold">MyEnrollments</h1>
        <table className="mt-5 w-full md:table-auto">
          <thead>
            <tr>
              <th className="truncate px-4 py-3 font-semibold">Course </th>
              <th className="truncate px-4 py-3 font-semibold">Duration</th>
              <th className="truncate px-4 py-3 font-semibold">Completed</th>
              <th className="truncate px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="flex items-center space-x-3 py-3 pl-2 md:px-4 md:pl-4">
                  <img
                    src={course.courseThumbnail}
                    alt=""
                    className="w-14 sm:w-24 md:w-28"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                    <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted*100)/progressArray[index].totalLectures : 0} className="bg-gray-300 rounded-full"/>
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {calculateCourseDuration(course)}
                </td>
                <td className="">
                  {
                    progressArray[
                      [index] &&
                        `${progressArray[index].lectureCompleted}/ ${progressArray[index].totalLectures}`
                    ]
                  }{" "}
                  <span>Lectures</span>
                </td>
                <td className="px-4 py-3 max-sm:text-right">
                  <button className="bg-blue-600 px-3 py-1.5 text-white max-sm:text-xs sm:px-5 sm:py-2" onClick={() => navigate('/player/' + course._id)}>
                    {
                      progressArray[
                        [index] &&
                          `${progressArray[index].lectureCompleted}/ ${progressArray[index].totalLectures} === 1 ? 'Completed':'On Going'`
                      ]
                    }
                    On Going
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer/>
    </>
  );
};

export default MyEnrollments;