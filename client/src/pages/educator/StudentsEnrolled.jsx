import React, { useState, useEffect, useContext } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../../components/students/Loading";

const StudentsEnrolled = () => {
  const {backendUrl, getToken, isEducator} = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  
  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if(isEducator) {
    fetchEnrolledStudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <div className="flex min-h-screen flex-col items-start justify-between p-4 pb-0 pt-8 md:p-8 md:pb-0">
      <div className="flex w-full max-w-4xl flex-col items-center overflow-hidden rounded-md border border-gray-500/20 bg-white">
        <table className="w-full table-fixed overflow-hidden pb-4 md:table-auto">
          <thead className="border-b border-gray-500/20 text-left text-sm text-gray-900">
            <tr>
              <th className="hidden px-4 py-3 text-center font-semibold sm:table-cell">
                #
              </th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="hidden px-4 py-3 text-center sm:table-cell">
                  {index + 1}
                </td>
                <td className="flex items-center space-x-3 px-2 py-3 md:px-4">
                  <img
                    src={item.student.imageUrl}
                    alt=""
                    className="h-9 w-9 rounded-full"
                  />
                  <span className="truncate">{item.student.name}</span>
                </td>
                <td className="truncate px-4 py-3">{item.courseTitle}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};
export default StudentsEnrolled;
