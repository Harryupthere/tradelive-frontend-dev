import React, { useState } from "react";
import {
  Play,
  Clock,
  CheckCircle,
  Lock,
  User,
  Star,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import "./courseDetail.scss";
import { Navigate, useParams } from "react-router-dom";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { useNavigate } from "react-router-dom";
import { duration } from "@mui/material";

const base = import.meta.env.VITE_BASE;

// interface Lecture {
//     id: string;
//     title: string;
//     duration: string;
//     videoUrl: string;
//     isCompleted: boolean;
//     isLocked: boolean;
//     description: string;
// }

// interface CourseData {
//     id: string;
//     title: string;
//     instructor: string;
//     rating: number;
//     totalStudents: number;
//     totalDuration: string;
//     description: string;
//     thumbnail: string;
//     lectures: Lecture[];
// }

interface Lecture {
  id: string;
  title: string;
  duration?: string;
  videoUrl: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  description: string;
  thumbnail?: string;
  subheading?: string;
}

interface CourseData {
  id: string;
  title: string;
  instructor: string;
  rating?: number;
  totalStudents?: number;
  totalDuration?: string;
  description: string;
  thumbnail: string;
  lectures: Lecture[];
  // total number of lectures (content length)
  totalLectures?: number;
  // number of watched/completed lectures according to API (trueCount)
  watchedCount?: number;
  // list of lecture ids (string) that are completed (based on trueIndexes)
  completedLectureIds?: string[];
  // computed progress percentage (0-100)
  progressPercentage?: number;
}

// const CourseDetail: React.FC = () => {
//   const { id } = useParams();

//     const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
//     const [isPlaying, setIsPlaying] = useState(false);

//   //  const [courseData, setCourseData] = useState<CourseData | null>(null);

//     // Mock course data
//     const courseData: CourseData = {
//         id: '1',
//         title: 'Complete React Development Course',
//         instructor: 'John Smith',
//         rating: 4.8,
//         totalStudents: 12543,
//         totalDuration: '12h 30m',
//         description: 'Master React from basics to advanced concepts. Build real-world projects and learn modern React patterns, hooks, context, and state management.',
//         thumbnail: 'https://images.pexels.com/photos/11035539/pexels-photo-11035539.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
//         lectures: [
//             {
//                 id: '1',
//                 title: 'Introduction to React',
//                 duration: '15:30',
//                 videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//                 isCompleted: true,
//                 isLocked: false,
//                 description: 'Learn the basics of React and understand component-based architecture.'
//             },
//             {
//                 id: '2',
//                 title: 'JSX and Components',
//                 duration: '22:45',
//                 videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//                 isCompleted: true,
//                 isLocked: false,
//                 description: 'Deep dive into JSX syntax and creating reusable components.'
//             },
//             {
//                 id: '3',
//                 title: 'Props and State',
//                 duration: '28:15',
//                 videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//                 isCompleted: false,
//                 isLocked: false,
//                 description: 'Understanding props for data passing and state for component data management.'
//             },
//             {
//                 id: '4',
//                 title: 'Event Handling',
//                 duration: '18:20',
//                 videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//                 isCompleted: false,
//                 isLocked: false,
//                 description: 'Learn how to handle user interactions and events in React.'
//             },
//             {
//                 id: '5',
//                 title: 'React Hooks - useState',
//                 duration: '25:10',
//                 videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//                 isCompleted: false,
//                 isLocked: false,
//                 description: 'Master the useState hook for managing component state.'
//             },
//             {
//                 id: '6',
//                 title: 'React Hooks - useEffect',
//                 duration: '32:40',
//                 videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//                 isCompleted: false,
//                 isLocked: true,
//                 description: 'Learn useEffect for side effects and lifecycle management.'
//             },
//             {
//                 id: '7',
//                 title: 'Context API',
//                 duration: '27:55',
//                 videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
//                 isCompleted: false,
//                 isLocked: true,
//                 description: 'Understand React Context for global state management.'
//             },
//             {
//                 id: '8',
//                 title: 'Custom Hooks',
//                 duration: '24:30',
//                 videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
//                 isCompleted: false,
//                 isLocked: true,
//                 description: 'Create reusable logic with custom React hooks.'
//             }
//         ]
//     };

//     React.useEffect(() => {
//         // Set first unlocked lecture as default
//         const firstLecture = courseData.lectures.find(lecture => !lecture.isLocked);
//         if (firstLecture) {
//             setCurrentLecture(firstLecture);
//         }
//         courseOverviewApiCall()
//     }, []);

//     const courseOverviewApiCall=async()=>{
//         const res=await api.get(`${API_ENDPOINTS.courseDetails}/${id}`);
//         console.log(res.data.data)
//         if(res.status){
//             setCourseData(res.data.data.data)
//         }
//     }

//     const handleLectureClick = (lecture: Lecture) => {
//         if (!lecture.isLocked) {
//             setCurrentLecture(lecture);
//             setIsPlaying(false);
//         }
//     };

//     const handlePlayPause = () => {
//         setIsPlaying(!isPlaying);
//     };

//     const completedLectures = courseData.lectures.filter(l => l.isCompleted).length;
//     const progressPercentage = (completedLectures / courseData.lectures.length) * 100;

//     return (
//         <div className="course-detail-page">
//             <div className="course-container">
//                 {/* Video Player Section */}
//                 <div className="video-section">
//                     <div className="video-player">
//                         {currentLecture ? (
//                             <div className="video-wrapper">
//                                 <video
//                                     key={currentLecture.id}
//                                     controls
//                                     poster={courseData.thumbnail}
//                                     className="main-video"
//                                 >
//                                     <source src={currentLecture.videoUrl} type="video/mp4" />
//                                     Your browser does not support the video tag.
//                                 </video>
//                                 <div className="video-overlay">
//                                     <button
//                                         className="play-button"
//                                         onClick={handlePlayPause}
//                                     >
//                                         <Play size={24} />
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="video-placeholder">
//                                 <img src={courseData.thumbnail} alt={courseData.title} />
//                                 <div className="placeholder-overlay">
//                                     <Play size={48} />
//                                     <p>Select a lecture to start learning</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Current Lecture Info */}
//                     {currentLecture && (
//                         <div className="current-lecture-info">
//                             <h2>{currentLecture.title}</h2>
//                             <p>{currentLecture.description}</p>
//                             <div className="lecture-meta">
//                                 <span className="duration">
//                                     <Clock size={16} />
//                                     {currentLecture.duration}
//                                 </span>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Course Sidebar */}
//                 <div className="course-sidebar">
//                     {/* Course Header */}
//                     <div className="course-header">
//                         <h1>{courseData.title}</h1>
//                         <div className="course-meta">
//                             <div className="instructor">
//                                 <User size={16} />
//                                 <span>{courseData.instructor}</span>
//                             </div>
//                             <div className="rating">
//                                 <Star size={16} />
//                                 <span>{courseData.rating}</span>
//                             </div>
//                             <div className="students">
//                                 <BookOpen size={16} />
//                                 <span>{courseData.totalStudents.toLocaleString()} students</span>
//                             </div>
//                         </div>
//                         <p className="course-description">{courseData.description}</p>
//                     </div>

//                     {/* Progress Bar */}
//                     <div className="progress-section">
//                         <div className="progress-header">
//                             <span>Course Progress</span>
//                             <span>{completedLectures}/{courseData.lectures.length} completed</span>
//                         </div>
//                         <div className="progress-bar">
//                             <div
//                                 className="progress-fill"
//                                 style={{ width: `${progressPercentage}%` }}
//                             />
//                         </div>
//                     </div>

//                     {/* Lectures List */}
//                     <div className="lectures-section">
//                         <h3>Course Content</h3>
//                         <div className="lectures-list">
//                             {courseData.lectures.map((lecture, index) => (
//                                 <div
//                                     key={lecture.id}
//                                     className={`lecture-item ${currentLecture?.id === lecture.id ? 'active' : ''
//                                         } ${lecture.isLocked ? 'locked' : ''} ${lecture.isCompleted ? 'completed' : ''
//                                         }`}
//                                     onClick={() => handleLectureClick(lecture)}
//                                 >
//                                     <div className="lecture-number">
//                                         {lecture.isCompleted ? (
//                                             <CheckCircle size={20} />
//                                         ) : lecture.isLocked ? (
//                                             <Lock size={20} />
//                                         ) : (
//                                             <span>{index + 1}</span>
//                                         )}
//                                     </div>

//                                     <div className="lecture-content">
//                                         <h4>{lecture.title}</h4>
//                                         <div className="lecture-duration">
//                                             <Clock size={14} />
//                                             <span>{lecture.duration}</span>
//                                         </div>
//                                     </div>

//                                     <div className="lecture-actions">
//                                         {currentLecture?.id === lecture.id && (
//                                             <div className="now-playing">
//                                                 <div className="playing-indicator">
//                                                     <span></span>
//                                                     <span></span>
//                                                     <span></span>
//                                                 </div>
//                                             </div>
//                                         )}
//                                         {!lecture.isLocked && (
//                                             <button className="play-btn">
//                                                 <Play size={16} />
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="blurs_wrapper"><div className="blurs_object is-fluo"></div></div>
//             </div>
//         </div>
//     );
// };

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const [currentLectureIndex, setCurrentLectureIndex] = useState<number>(0);  

  React.useEffect(() => {
    courseOverviewApiCall();
  }, []);

  const courseOverviewApiCall = async () => {
    const res = await api.get(`${API_ENDPOINTS.courseDetails}/${id}`);
    if (res.status) {
      const apiData = res.data.data.data;
      // enrollment_progress payload example from API:
      // {
      //   falseCount: 10,
      //   falseIndexes: [],
      //   trueCount: 0,
      //   trueIndexes: []
      // }
      // We derive progress using content.length as total and trueCount as watched
      const enrollmentProgress = apiData.enrollment_progress || {};
      const totalLectures = Array.isArray(apiData.content)
        ? apiData.content.length
        : 0;
      const watchedCount = Number(enrollmentProgress.trueCount || 0);
      const trueIndexes: number[] = Array.isArray(enrollmentProgress.trueIndexes)
        ? enrollmentProgress.trueIndexes
        : [];
      // Map API response to CourseData
      const mappedCourse: CourseData = {
        id: apiData.id,
        title: apiData.product.title,
        subtitle:apiData.product.subtitle,
        instructor: apiData.product.meta.educator,
        rating: undefined, // If available, map from apiData.product.rating
       // totalStudents: Number(apiData.product.meta.students.replace(/,/g, "")),
        //totalDuration: apiData.product.meta.duration,
        description: apiData.product.description,
        thumbnail: apiData.product.preview_image,
        lectures: (apiData.content || []).map((item: any, idx: number) => ({
          id: String(idx + 1),
          title: item.heading,
          duration: item.duration,
          videoUrl: item.url,
          // mark completed if idx exists in trueIndexes
          isCompleted: trueIndexes.includes(idx),
          description: item.description,
          thumbnail: item.thumbnail,
          subheading: item.subheading,
        })),
        // additional metadata derived from enrollment_progress
        totalLectures: totalLectures,
        watchedCount: watchedCount,
        completedLectureIds: trueIndexes.map((i) => String(i + 1)),
        progressPercentage:
          totalLectures > 0 ? (watchedCount / totalLectures) * 100 : 0,
      };
      setCourseData(mappedCourse);
      // Set first lecture as default
      if (mappedCourse.lectures.length > 0) {
        // prefer first non-locked lecture, otherwise first lecture
        const firstAvailable =  mappedCourse.lectures[currentLectureIndex];
        setCurrentLecture(firstAvailable);
      }
    }
  };

  const handleLectureClick = (lecture: Lecture, index: number) => {
    if (!lecture.isLocked) {
      setCurrentLecture(lecture);
      setIsPlaying(false);
    }
    setCurrentLectureIndex(index);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    callUpdateProgress()
  };

  const callUpdateProgress=async()=>{
    try{
    const res=await api.patch(`${API_ENDPOINTS.updateLectureProgress}`,{
      product_id: Number(id),
      content_index: currentLectureIndex
    })
    if(res.status){
      console.log("Progress updated")
      // Optionally, refresh course data to update progress bar
      courseOverviewApiCall();
    }
    }catch(error){
      console.log(error)
    }
  }

  // const completedLectures =
  //   courseData?.lectures.filter((l) => l.isCompleted).length || 0;
  // const progressPercentage = courseData
  //   ? (completedLectures / courseData.lectures.length) * 100
  //   : 0;

  if (!courseData) return <div>Loading...</div>;

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
    const handleBackToCalculators = () => {
    navigate(`${base}course-overview/${id}`);
  };
  return (
    <div className="course-detail-page">
       <div className="course-detail-page__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Course Overview
          </button>
          {/* <h1 className="course-detail-page__title">{courseData.title}</h1> */}
        </div>
      <div className="course-container">
        {/* Video Player Section */}
        <div className="video-section">
          <div className="video-player">
            {currentLecture ? (
              <div className="video-wrapper">
                <video
                  key={currentLecture.id}
                  controls
                  poster={currentLecture.thumbnail}
                  onPlay={() => callUpdateProgress()}
                  className="main-video"
                >
                  <source src={currentLecture.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="video-overlay">
                  <button className="play-button" onClick={handlePlayPause}>
                    <Play size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="video-placeholder">
                <img src={courseData.thumbnail} alt={courseData.title} />
                <div className="placeholder-overlay">
                  <Play size={48} />
                  <p>Select a lecture to start learning</p>
                </div>
              </div>
            )}
          </div>

          {/* Current Lecture Info */}
          {currentLecture && (
            <div className="current-lecture-info">
              <h2>{currentLecture.title}</h2>
              {/* <p
                dangerouslySetInnerHTML={{ __html: currentLecture.description }}
              /> */}
              <p
                dangerouslySetInnerHTML={{
                  __html: decodeHtml(currentLecture.description),
                }}
              />
             {currentLecture.duration && <div className="lecture-meta">
                <span className="duration">
                  <Clock size={16} />
                  {currentLecture.duration}
                </span>
              </div>}
            </div>
          )}
        </div>

        {/* Course Sidebar */}
        <div className="course-sidebar">
          {/* Course Header */}
          <div className="course-header">
            <h1>{courseData.title}</h1>

            <p>{courseData.subtitle}</p>

            {/* <div className="course-meta">
              <div className="instructor">
                <User size={16} />
                <span>{courseData.instructor}</span>
              </div>
              <div className="students">
                <BookOpen size={16} />
                <span>
                  {courseData.totalStudents?.toLocaleString()} students
                </span>
              </div>
            </div> */}
            {/* <p
              className="course-description"
              dangerouslySetInnerHTML={{ __html: courseData.description }}
            /> */}
{/* 
            <p
              className="course-description"
              dangerouslySetInnerHTML={{
                __html: decodeHtml(courseData.description),
              }}
            /> */}
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-header">
              <span>Course Progress</span>
              <span>
                {courseData.watchedCount}/{courseData.totalLectures} completed
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${courseData.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Lectures List */}
          <div className="lectures-section">
            <h3>Course Content</h3>
            <div className="lectures-list">
              {courseData.lectures.map((lecture, index) => (
                <div
                  key={lecture.id}
                  className={`lecture-item ${
                    currentLecture?.id === lecture.id ? "active" : ""
                  } ${lecture.isLocked ? "locked" : ""} ${
                    lecture.isCompleted ? "completed" : ""
                  }`}
                  onClick={() => handleLectureClick(lecture, index)}
                >
                  {lecture.isCompleted && (
                    <div className="lecture-watched-tag">Watched</div>
                  )}
                  <div className="lecture-number">
                    {lecture.isCompleted ? (
                      <CheckCircle size={20} />
                    ) : lecture.isLocked ? (
                      <Lock size={20} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div className="lecture-content">
                    <h4>{lecture.title}</h4>
                   { lecture.duration &&<div className="lecture-duration">
                      <Clock size={14} />
                      <span>{lecture.duration}</span>
                    </div>}
                  </div>

                  <div className="lecture-actions">
                    {currentLecture?.id === lecture.id && (
                      <div className="now-playing">
                        <div className="playing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    )}
                    {!lecture.isLocked && (
                      <button className="play-btn">
                        <Play size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="blurs_wrapper">
          <div className="blurs_object is-fluo"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
