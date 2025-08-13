import { Route, Routes, useMatch } from "react-router-dom";
import Loading from "./components/students/Loading.jsx";
import Player from "./components/students/Player.jsx";
import CourseDetails from "./pages/student/CourseDetails.jsx";
import CoursesList from "./pages/student/CoursesList.jsx";
import Home from "./pages/student/Home";
import MyEnrollments from "./pages/student/MyEnrollments";
import Educator from "./pages/educator/Educator.jsx";
import StudentEnrolled from "./pages/educator/StudentsEnrolled.jsx";
import AddCourse from "./pages/educator/AddCourse.jsx";
import MyCourses from "./pages/educator/MyCourses.jsx";
import Dashboard from "./pages/educator/Dashboard.jsx";
import Navbar from "./components/students/Navbar.jsx";
import "quill/dist/quill.snow.css";
import {ToastContainer,toast} from 'react-toastify';

const App = () => {
  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="min-h-screen bg-white text-default">
      <ToastContainer/>
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/course-list" element={<CoursesList />}></Route>
        <Route path="/course-list/:id" element={<CoursesList />}></Route>
        <Route path="/course/:id" element={<CourseDetails />}></Route>
        <Route path="/my-enrollments" element={<MyEnrollments />}></Route>
        <Route path="/player/:courseId" element={<Player />}></Route>
        <Route path="/loading/:path" element={<Loading />}></Route>
        <Route path="/educator" element={<Educator />}>
          <Route path="educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
