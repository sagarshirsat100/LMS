import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import { check } from "prettier";
import YouTube from "react-youtube";
import Footer from "../../components/students/Footer";
import { toast } from "react-toastify";


const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = React.useState(null);
  const [openSection, setOpenSection] = React.useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = React.useState(false);
  const [playData, setPlayerData] = React.useState(null);
  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    backendUrl,
    userData,
    getToken
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const {data} = await axios.get(backendUrl+'/api/course/'+id)
      if(data.success) {
        setCourseData(data.courseData)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(data.message)
    }
  };

  const enrollCourse = async () => {
    try {
      if(!userData) {
        return toast.warn('Login to Enroll');
      }
      if(isAlreadyEnrolled) {
        return toast.warn('Already enrolled');
      }
      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/purchase', {courseId:courseData._id},{headers: {Authorization: `Bearer ${token}`}} )
      if(data.success) {
        const {session_url} = data
        window.location.replace(session_url)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(data.message)
    }
  }

  useEffect(() => {
    fetchCourseData();
  }, []);
  useEffect(() => {
    if(userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(CountQueuingStrategy._id))
    }
  }, [userData,courseData]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <>
      <div className="md: md:pt-30 relative flex flex-row items-start justify-between gap-10 px-8 pt-20 text-left md:px-36">
        <div className="h-section-height-z-1 absolute left-0 top-0 w-full bg-gradient-to-b from-cyan-100/70"></div>

        <div className="z-10 max-w-xl text-gray-500">
          <h1 className="md:text-course-deatails-heading-large text-course-deatails-heading-small font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-4 text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>
          <div className="flex items-center space-x-2 pb-1 pt-3">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="h-3.5 w-3.5"
                />
              ))}
            </div>

            <p className="text-gray-500">
              {courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length > 1 ? "ratings" : "rating"}
            </p>
            <p>
              {courseData.enrolledStudents.length}
              {courseData.enrolledStudents.length > 1 ? " students" : " student"}
            </p>
          </div>
          <p className="text-sm">
            Course by<span className="text-blue-600 underline"> Me</span>
          </p>
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="mb-2 rounded border border-gray-300 bg-white"
                >
                  <div
                    className="flex cursor-pointer select-none items-center justify-between px-4 py-3"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className={`transform transition-transform ${openSection[index] ? "rotate-180" : ""}`}
                        src={assets.down_arrow_icon}
                        alt="arrow icon"
                      />
                      <p className="text-sm font-medium md:text-base">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures -
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`max-h-96 overflow-hidden transition-all duration-300 ${openSection[index]} ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <ul className="list-discmd:pl10 pr4 border-t border-gray-300 py-2 pl-4 text-gray-600">
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <li
                          key={lectureIndex}
                          className="flex items-start gap-2 py-1"
                        >
                          <img
                            src={assets.play_icon}
                            alt="play icon"
                            className="mt-1 h-4 w-4"
                          />
                          <div className="flex w-full items-center justify-between text-xs text-gray-800 md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className="cursor-pointer text-blue-500"
                                >
                                  Preview
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "n"] },
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              className="pt-3"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            ></p>
          </div>
        </div>
        {/* Right Section */}
        <div className="md: z-10 min-w-[300px] max-w-course-card overflow-hidden rounded-none rounded-t bg-white shadow-custom-card sm:min-w-[420px]">
          {playData ? (
                < YouTube
                  videoId={playData.videoId}
                  opts={{ playerVars: { autoplay: 1 } }}
                  iframeClassName="w-full aspect-video"
                />
              ) : (
                <img src={courseData.courseThumbnail} alt="" />
              )}
          
          <div className="p-5">
            <div className="flex items-center gap-2">
              
              <img className="w-3.5" src={assets.time_left_clock_icon} alt="time"></img>
              <p className="text-red-500">
                <span>{courseData.discount}% days</span> left at this price
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <p className="text-2xl font-semibold text-gray-800 md:text-4xl">
                {currency}
                {(courseData.coursePrice - ((courseData.discount * courseData.coursePrice) / 100)).toFixed(2)}
              </p>
              <p className="text-gray-500 line-through md:text-lg">
                {currency}
                {(courseData.coursePrice).toFixed(2)}
              </p>
              <p className="text-gray-500 md:text-lg">
                {courseData.discount}%off
              </p>
            </div>
            <div className="flex items-center gap-4 pt-2 text-sm text-gray-500 md:pt-4 md:text-default">
              <div className="flex items-center gap-2">
                <img src={assets.star} alt="star icon`" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1"></div>
              <img src={assets.lesson_icon} alt="clock icon" />
              <p>{calculateNoOfLectures(courseData)} lessons</p>
            </div>
          </div>
          <button onClick={enrollCourse} className="mt-4 w-full rounded bg-blue-600 py-3 font-medium text-white md:mt-6">
            {isAlreadyEnrolled ? "AlreadyEnrolled" : "Enroll Now"}
          </button>

          <div className="pt-6">
            <p className="text-lg font-medium text-gray-800 md:text-xl">
              What's in the course?
            </p>
            <ul className="ml-4 list-disc pt-2 text-sm text-gray-500 md:text-default">
              <li>Lifetime access with free updates.</li>
              <li>Step-by-step, hands-on project guidance.</li>
              <li>Downloadable resources and source code.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
