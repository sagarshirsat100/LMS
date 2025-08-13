import React, { useRef, useState, useEffect } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import {AppContext} from '../../context/AppContext'

const AddCourse = () => {
  const {backendUrl, getToken} = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId),
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter,
        ),
      );
    }
  };

   const addLecture = ()=>{
    setChapters(
      chapters.map((chapter)=> {
        if(chapter.chapterId === currentChapterId){
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid()
          };
          // console.log("LectureId" , lectureId);
          console.log("Lecture" , newLecture);
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  }
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if(!image) {
        toast.error("thumbnail not selected");
      }
      const courseData = {
        courseTitle,
        courseDescription : quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }
      const formData = new FormData()
      formData.append('courseData',JSON.stringify(courseData))
      formData.append('image',image)

      const token = await getToken()
      const {data} = await axios.post(backendUrl+'/api/educator/add-course', formData, {headers: {Authorization:`Bearer ${token}`}})
      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters ([])
        quillRef.current.root.innerHTML
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };



  useEffect(() => {
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);
  return (
    <div className="flex h-screen flex-col items-start justify-between overflow-scroll p-4 pb-0 pt-8 md:p-8 md:pb-0">
      <form onClick={handleSubmit}>
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="rounded border border-gray-500 px-3 py-2 outline-none md:py-2.5"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex flex-col gap-1">
            <p>Course Price</p>
            <input
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="w-28 rounded border border-gray-500 px-3 py-2 outline-none md:py-2.5"
              required
            />
          </div>
          <div className="flex flex-col items-center md:gap-3">
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3">
              <img
                src={assets.file_upload_icon}
                alt=""
                className="rounded bg-blue-500 p-3"
              />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              <img
                className="max-h-10"
                src={image ? URL.createObjectURL(image) : ""}
                alt=""
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="w-28 rounded border border-gray-500 px-3 py-2 outline-none md:py-2.5"
            required
          />
        </div>
        {/* Adding Chapters & Lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="rounded-1g mb-4 border bg-white">
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center">
                  <img
                    onClick={() => handleChapter("toggle", chapter.chapterId)}
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                    className={`mr-2 cursor-pointer transition-all ${
                      chapter.collapsed && "-rotate-90"
                    }`}
                  />
                  I
                  <span className="font-semibold">
                    {chapterIndex + 1} {chapter.chapterTitle}
                  </span>
                </div>
                <span>{chapter.chapterContent.length} Lectures</span>
                <img
                  onClick={() => handleChapter("remove", chapter.chapterId)}
                  src={assets.cross_icon}
                  alt=""
                  className="cursor-pointer"
                />
              </div>
              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div>
                      {!chapter.collapsed && (
                        <div className="p-4">
                          {chapter.chapterContent.map(
                            (lecture, lectureIndex) => (
                              <div
                                key={lectureIndex}
                                className="mb-2 flex items-center justify-between"
                              >
                                <span>
                                  {lectureIndex + 1} {lecture.lectureTitle} -
                                  {lecture.lectureDuration} mins -
                                  <a
                                    href={lecture.lectureUrl}
                                    target="_blank"
                                    className="text-blue-500"
                                  >
                                    Link
                                  </a>
                                  {lecture.isPreviewFree
                                    ? "Free Preview"
                                    : "Paid"}
                                </span>
                                <img
                                  onClick={() =>
                                    handleLecture(
                                      "remove",
                                      chapter.chapterId,
                                      lectureIndex,
                                    )
                                  }
                                  src={assets.cross_icon}
                                  alt=""
                                  className="cursor-pointer"
                                />
                              </div>
                            ),
                          )}
                          <div
                            onClick={() =>
                              handleLecture("add", chapter.chapterId)
                            }
                            className="mt-2 inline-flex cursor-pointer rounded bg-gray-100 p-2"
                          >
                            + Add Lectures
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-100 p-2"
                    onClick={() => handleChapter("add")}
                  >
                    + Add Chapter
                  </div>
                  {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                      <div className="relative w-full max-w-80 rounded bg-white p-4 text-gray-700">
                        <h2 className="mb-4 text-lg font-semibold">
                          Add Lecture
                        </h2>

                        <div className="mb-2">
                          <p>Lecture Title</p>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded border px-2 py-1"
                            value={lectureDetails.lectureTitle}
                            onChange={(e) =>
                              setLectureDetails({
                                ...lectureDetails,
                                lectureTitle: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="mb-2">
                          <p>Duration (minutes)</p>
                          <input
                            type="number"
                            className="mt-1 block w-full rounded border px-2 py-1"
                            value={lectureDetails.lectureDuration}
                            onChange={(e) =>
                              setLectureDetails({
                                ...lectureDetails,
                                lectureDuration: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="mb-2">
                          <p>Lecture URL </p>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded border px-2 py-1"
                            value={lectureDetails.lectureUrl}
                            onChange={(e) =>
                              setLectureDetails({
                                ...lectureDetails,
                                lectureUrl: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="mb-2">
                          <p>Is Preview Free? </p>
                          <input
                            type="checkbox"
                            className="mt-1 block w-full rounded border px-2 py-1"
                            value={lectureDetails.isPreviewFree}
                            // onClick={(e) => setLectureDetails({...lectureDetails, isPreviewFree: e.target.value})}
                            onClick={(e) =>
                              setLectureDetails({
                                ...lectureDetails,
                                isPreviewFree: true,
                              })
                            }
                          />
                        </div>

                        <button
                          className="px-4py2 w-full rounded bg-blue-400 text-white"
                          onClick={addLecture}
                          type="button"
                        >
                          Add
                        </button>

                        <img
                          onClick={() => setShowPopup(false)}
                          className="absolute right-4 top-4 w-4 cursor-pointer"
                          src={assets.cross_icon}
                          alt=""
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="relative w-full max-w-80 rounded bg-white p-4 text-gray-700">
              <h2 className="mb-4 text-lg font-semibold">Add Lecture</h2>

              <div className="mb-2">
                <p>Lecture Title</p>
                <input
                  type="text"
                  className="mt-1 block w-full rounded border px-2 py-1"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                <p>Duration (minutes)</p>
                <input
                  type="number"
                  className="mt-1 block w-full rounded border px-2 py-1"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                <p>Lecture URL </p>
                <input
                  type="text"
                  className="mt-1 block w-full rounded border px-2 py-1"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                <p>Is Preview Free? </p>
                <input
                  type="checkbox"
                  className="mt-1 block w-full rounded border px-2 py-1"
                  value={lectureDetails.isPreviewFree}
                  // onClick={(e) => setLectureDetails({...lectureDetails, isPreviewFree: e.target.value})}
                  onClick={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: true,
                    })
                  }
                />
              </div>

              <button
                className="px-4py2 w-full rounded bg-blue-400 text-white"
                onClick={addLecture}
                type="button"
              >
                Add
              </button>

              <img
                onClick={() => setShowPopup(false)}
                className="absolute right-4 top-4 w-4 cursor-pointer"
                src={assets.cross_icon}
                alt=""
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          className="my-4 w-max rounded bg-black px-8 py-2 pt-2.5 font-semibold text-white"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
