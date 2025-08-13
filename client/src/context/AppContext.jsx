import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import {useAuth, useUser} from '@clerk/clerk-react';
import axios from 'axios'
import {toast} from 'react-toastify'

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "USD";
  const navigate = useNavigate();
  const { getToken, isLoaded } = useAuth();
  const {user} = useUser();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  const fetchAllCourses = async () => {
    try {
      const {data} = await axios.get(backendUrl+'/api/course/all')
      if(data.success) {
        setAllCourses(data.courses);
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
        toast.error(data.message)
    }
  }

  const fetchUserData = async () => {
    if(user.publicMetadata.role === 'educator') {
      setIsEducator(true);
    }

    try {
      const token = await getToken();
      const {data} = await axios.get(backendUrl+'/api/user/data', {header:{Authorization:`Bearer ${token}`}})

      if(data.success) {
        setUserData(data.user)
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      
    }
  }
  const calculateRating = (course) => {
    if (!course?.courseRating?.length) return 0;
    const totalRating = course.courseRating.reduce(
      (sum, rating) => sum + rating.rating,
      0,
    );
    return Math.floor(totalRating / course.courseRating.lengt)h;
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
    try {
      const token = await getToken();
      const {data} = await axios.get(backendUrl+'/api/user/enrolled-courses', {headers: {Authorization:`Bearer ${token}`}})

      if(data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
        toast.error(data.message);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);
  
  useEffect(() => {
    if(user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);


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
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };