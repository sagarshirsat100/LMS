import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/students/Loading";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = React.useState(null);
  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return dashboardData ? (
    <div className="flex min-h-screen flex-col items-start justify-between gap-8 p-4 pb-0 pt-8 md:p-8 md:pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-5">
          <div className="shadow-card flex w-56 items-center gap-3 rounded-md border border-blue-500 p-4">
            <img src={assets.patients_icon} alt="patients_icon" />
            <div>
              <p className="text-2x1 font-medium text-gray-600">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-base text-gray-500">Total Enrolments</p>
            </div>
          </div>
          <div className="shadow-card flex w-56 items-center gap-3 rounded-md border border-blue-500 p-4">
            <img src={assets.appointments_icon} alt="patients_icon" />
            <div>
              <p className="text-2x1 font-medium text-gray-600">
                {dashboardData.totalCourses}
              </p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>
          <div className="shadow-card flex w-56 items-center gap-3 rounded-md border border-blue-500 p-4">
            <img src={assets.earning_icon} alt="patients_icon" />
            <div>
              <p className="text-2x1 font-medium text-gray-600">
                {currency}
                {dashboardData.totalEarnings}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
          <div className="flex w-full max-w-4xl flex-col items-center overflow-hidden rounded-md border border-gray-500/20 bg-white">
            <table className="w-full table-fixed overflow-hidden md:table-auto">
              <thead className="I border-b border-gray-500/20 text-left text-sm text-gray-900">
                <tr>
                  <th className="sm: table-cell hidden px-4 py-3 text-center font-semibold">
                    #
                  </th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-500/20">
                    <td className="hidden px-4 py-3 text-center sm:table-cell">
                      {index + 1}
                    </td>
                    I
                    <td className="flex items-center space-x-3 px-2 py-3 md:px-4">
                      <img
                        src={item.student.imageUrl}
                        alt="Profile"
                        className="h-9 w-9 rounded-full"
                      />
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="truncate px-4 py-3">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
