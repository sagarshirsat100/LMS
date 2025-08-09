import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "USD";
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const fetchAllCourses = () => {
    setAllCourses(dummyCourses);
  }
  const calculateRating = (course) => {
    if (!course?.courseRating?.length) return 0;
    const totalRating = course.courseRating.reduce(
      (sum, rating) => sum + rating.rating,
      0,
    );
    return totalRating / course.courseRating.length;
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map(
        (lecture) => (time += lecture.lectureDuration),
      ),
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };
  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };













// import { createContext, useEffect } from "react";
// import { useState } from "react";
// import {dummyCourses} from "../assets/assets";
// import { useNavigate } from "react-router-dom";

// export const AppContext = createContext();

// export const AppContextProvider = (props) => {
//   const currency = import.meta.env.VITE_CURRENCY || "USD";
//   const navigate = useNavigate();

//   const [allcourses, setAllCourses] = useState([]);
//   const [isEducator, setIsEducator] = useState(true);

//   const fetchAllCourses = async () => {
//     setAllCourses(dummyCourses);
//   }

//   const calculateRating = () => {
//     if(course.courseRating.length === 0) return 0;
//     let totalRating = 0;
//     course.courseRating.forEach((rating) => {
//       totalRating += rating.rating;
//     });
//     return totalRating / course.courseRating.length;
//   }

//   useEffect(() => {
//     fetchAllCourses();
//   }, []);
//   const value = {
//     currency, allcourses, navigate, calculateRating, isEducator, setIsEducator
//   };

//   return (
//     <AppContext.Provider value={value}>
//       {props.children}
//     </AppContext.Provider>
//   );
// };
