import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { AppContext } from "../../context/AppContext";
import assets from "../../assets/assets";
import YouTube from "react-youtube";
import { Rating } from "react-simple-star-rating";

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
      }
    });
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  (useEffect(() => {
    getCourseData();
  }),
    [courseId, enrolledCourses]);
  return (
    <>
      <div className="flex flex-col-reverse gap-10 p-4 sm:p-10 md:grid md:grid-cols-2 md:px-36">
        {/* left column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold"></h2>
          <div className="pt-5">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
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
                            src={
                              false ? assets.blue_tick_icon : assets.play_icon
                            }
                            alt="play icon"
                            className="mt-1 h-4 w-4"
                          />
                          <div className="flex w-full items-center justify-between text-xs text-gray-800 md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="cursor-pointer text-blue-500"
                                >
                                  Watch
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
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this course:</h1>
            <Rating initialValue={0}/>
          </div>
        </div>
        {/* right column */}
        <div className="md:mt-10 ">
          {playerData ? (
            <div>
              <YouTube
                videoId={playerData.lectureUrl.split('/').pop()}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-1">
                <p>{playerData.chapter}.{playerData.lecture}{playerData.lectureTitle}</p>
                <button className="text-blue-600 ">{false ? 'completed':'mark complete'}</button>
              </div>
            </div>
          ) : (
            <img src={courseData ? courseData.courseThumbnail : ""} alt="" />
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Player;
