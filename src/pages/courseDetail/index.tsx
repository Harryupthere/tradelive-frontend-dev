import React, { useState, useEffect } from "react";
import { useRef } from "react";
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
import { duration, Grid } from "@mui/material";
import { getToken, getTokenKey, getUser } from "../../utils/tokenUtils";
import Hls from "hls.js";
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
  extra_data: [];
  // total number of lectures (content length)
  totalLectures?: number;
  // number of watched/completed lectures according to API (trueCount)
  watchedCount?: number;
  // list of lecture ids (string) that are completed (based on trueIndexes)
  completedLectureIds?: string[];
  // computed progress percentage (0-100)
  progressPercentage?: number;
}

const CourseDetail: React.FC = () => {

   const { courses_allowance } = getUser();
      const navigate = useNavigate();
      if(courses_allowance !== 2){
        navigate(`${base}dashboard`);
      }

  const userDetails = getUser();
  const { id } = useParams();

  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressCalled, setProgressCalled] = useState(false);

  const [currentLectureIndex, setCurrentLectureIndex] = useState<number>(0);

  React.useEffect(() => {
    courseOverviewApiCall();
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!currentLecture?.videoUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (currentLecture.videoUrl.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 60,
          maxMaxBufferLength: 120,
          enableWorker: true,
          lowLatencyMode: false,
        });
        hls.loadSource(currentLecture.videoUrl);
        hls.attachMedia(video);

        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = currentLecture.videoUrl;
      }
    } else {
      video.src = currentLecture.videoUrl;
    }
  }, [currentLecture]);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoWrapperRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.log("Fullscreen error:", err);
    }
  };

  const courseOverviewApiCall = async () => {
    const res = await api.get(`${API_ENDPOINTS.courseDetails}/${id}`);
    if (res.status) {
      const apiData = res.data.data.data;
      const enrollmentProgress = apiData.enrollment_progress || {};
      const totalLectures = Array.isArray(apiData.content)
        ? apiData.content.length
        : 0;
      const watchedCount = Number(enrollmentProgress.trueCount || 0);
      const trueIndexes: number[] = Array.isArray(
        enrollmentProgress.trueIndexes,
      )
        ? enrollmentProgress.trueIndexes
        : [];
      // Map API response to CourseData
      const mappedCourse: CourseData = {
        id: apiData.id,
        title: apiData.product.title,
        subtitle: apiData.product.subtitle,
        instructor: apiData.product.meta.educator,
        rating: undefined, // If available, map from apiData.product.rating
        // totalStudents: Number(apiData.product.meta.students.replace(/,/g, "")),
        //totalDuration: apiData.product.meta.duration,
        description: apiData.product.description,
        thumbnail: apiData.product.preview_image,
        extra_data: apiData.product.extra_data || null,

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
          extra_data: item.extra_data || null,
          isVideoReady: item.isVideoReady == 1 || false, // Add this flag to track video readiness
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
        const firstAvailable = mappedCourse.lectures[currentLectureIndex];
        setCurrentLecture(firstAvailable);
      }
    }
  };

  const handleLectureClick = (lecture: Lecture, index: number) => {
    if (!lecture.isCompleted) {
      setIsPlaying(true);
    }
    setProgressCalled(false);
    setCurrentLecture(lecture);
    setCurrentLectureIndex(index);
  };

  // const handlePlayPause = () => {
  //   setIsPlaying(!isPlaying);
  //   callUpdateProgress();
  // };

  const handlePlayPause = () => {
    setIsPlaying(false);
  };

  //   const handlePlayPause = () => {
  //   if (!videoRef.current) return;

  //   if (isPlaying) {
  //     videoRef.current.pause();
  //   } else {
  //     videoRef.current.play();
  //     callUpdateProgress();
  //   }

  //   setIsPlaying(!isPlaying);
  // };

  // const callUpdateProgress = async () => {
  //   //alert(1)
  //   try {
  //     const res = await api.patch(`${API_ENDPOINTS.updateLectureProgress}`, {
  //       product_id: Number(id),
  //       content_index: currentLectureIndex,
  //     });
  //     if (res.status) {
  //       // Optionally, refresh course data to update progress bar
  //      // courseOverviewApiCall();
  //     }
  //   } catch (error) {
  //     console.log(error, "??");
  //     console.log(error);
  //   }
  // };
  const callUpdateProgress = async () => {
    try {
      const res = await api.patch(`${API_ENDPOINTS.updateLectureProgress}`, {
        product_id: Number(id),
        content_index: currentLectureIndex,
      });

      if (res.status && courseData) {
        const updatedLectures = courseData.lectures.map((lecture, idx) => {
          if (idx === currentLectureIndex) {
            return { ...lecture, isCompleted: true };
          }
          return lecture;
        });

        const newWatchedCount = (courseData.watchedCount || 0) + 1;

        setCourseData({
          ...courseData,
          lectures: updatedLectures,
          watchedCount: newWatchedCount,
          progressPercentage:
            (newWatchedCount / (courseData.totalLectures || 1)) * 100,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const Watermark: React.FC<{ text: string }> = ({ text }) => {
    const [pos, setPos] = useState({ top: 10, left: 10 });

    useEffect(() => {
      const interval = setInterval(() => {
        const top = Math.floor(Math.random() * 70) + 5; // 5% to 75%
        const left = Math.floor(Math.random() * 70) + 5; // 5% to 75%
        setPos({ top, left });
      }, 5000); // move every 5 sec

      return () => clearInterval(interval);
    }, []);

    return (
      <div
        className="video-watermark"
        style={{
          top: `${pos.top}%`,
          left: `${pos.left}%`,
        }}
      >
        {text}
      </div>
    );
  };

  const handleBuffer = () => {
    const video = videoRef.current;
    if (video) {
      const currentTime = video.currentTime;
      video.load();
      video.currentTime = currentTime;
      video.play();
    }
  };

  return (
    <div className="course-detail-page">
      <div className="container">
        {/* Video Player Section */}
        <div className="course-detail-page__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Course Overview
          </button>
          {/* <h1 className="course-detail-page__title">{courseData.title}</h1> */}
        </div>
        <Grid container spacing={2}>
          <Grid size={{ lg: 8, sm: 12 }}>
            <div className="video-section">
              <div className="video-player">
                {currentLecture ? (
                  <div className="video-wrapper" ref={videoWrapperRef}>
                    {!currentLecture.isVideoReady ? (
                      <video
                        ref={videoRef}
                        key={currentLecture.id}
                        // TODO: Uncomment controls when video is ready
                        // controls
                        preload="auto"
                        playsInline
                        poster={currentLecture.thumbnail}
                        // TODO: Uncomment onPlay when video is ready
                        // onPlay={() => callUpdateProgress()}
                        className="main-video"
                        // TODO: Uncomment controlsList when video is ready
                        // controlsList="nodownload noplaybackrate"
                        disablePictureInPicture
                        disableRemotePlayback
                        crossOrigin="anonymous"
                        onContextMenu={(e) => e.preventDefault()} // disable right-click
                        // TODO: Remove this when video is ready to prevent accidental playing
                        onPlay={(e) => e.preventDefault()}
                        onWaiting={handleBuffer}
                        onStalled={handleBuffer}
                      >
                        {/* <source
                          src={currentLecture.videoUrl}
                          type="video/mp4"
                        /> */}
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <video
                        ref={videoRef}
                        key={currentLecture.id}
                        // TODO: Uncomment controls when video is ready
                        controls
                        preload="auto"
                        playsInline
                        poster={currentLecture.thumbnail}
                        // TODO: Uncomment onPlay when video is ready
                        onPlay={() => {
                          if (!progressCalled) {
                            callUpdateProgress();
                            setProgressCalled(true);
                          }
                        }}
                        className="main-video"
                        // TODO: Uncomment controlsList when video is ready
                        controlsList="nodownload noplaybackrate"
                        disablePictureInPicture
                        disableRemotePlayback
                        crossOrigin="anonymous"
                        onContextMenu={(e) => e.preventDefault()} // disable right-click
                        // TODO: Remove this when video is ready to prevent accidental playing
                        // onPlay={(e) => e.preventDefault()}
                        // onWaiting={handleBuffer}
                        // onStalled={handleBuffer}
                      >
                        {/* <source
                          src={currentLecture.videoUrl}
                          type="video/mp4"
                        /> */}
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <Watermark text={`User: ${userDetails?.video_unique_id}`} />
                    <button
                      className="fullscreen-btn"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    </button>

                    {isPlaying && (
                      <div className="video-overlay">
                        <button
                          className="play-button"
                          // // TODO: Uncomment the line below when video is ready to play
                          // // onClick={handlePlayPause}
                          // disabled // Remove this line when video is ready
                          onClick={
                            currentLecture.isVideoReady
                              ? handlePlayPause
                              : undefined
                          }
                          disabled={!currentLecture.isVideoReady}
                        >
                          <Play size={24} />
                        </button>
                      </div>
                    )}
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

{Number(id) === 6 && (
  <div className="important-note">
    <h3>⚠️ Important Note</h3>

    <p>
      To provide the most effective learning experience, all step-by-step trade examples 
      and live market walkthroughs will be discussed in <strong>Module 5 under Playback</strong>.
      In that module, we will use historical data to simulate real market conditions, allowing 
      you to see exactly how structure, supply/demand zones, and entry triggers align before a move occurs.
    </p>

    <h4>What You'll Learn in Module 5 (Playback)</h4>

    <ul>
      <li><strong>Synthesis:</strong> Apply structure, zones, and price action together in a live-action environment.</li>
      <li><strong>Real-World Setups:</strong> See a complete breakdown of high-probability trade examples.</li>
      <li><strong>Execution Logic:</strong> Understand the specific entry confirmations used to pull the trigger.</li>
      <li><strong>Risk Management:</strong> Learn how to set stop-losses and plan exits effectively.</li>
      <li><strong>Confidence Building:</strong> Bridge the gap between theory and execution.</li>
    </ul>
  </div>
)}
              {/* Current Lecture Info */}
              {currentLecture && (
                <div className="current-lecture-info">
                  <h2>{currentLecture.title}</h2>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: decodeHtml(currentLecture.description),
                    }}
                  />
                  {currentLecture.duration && (
                    <div className="lecture-meta">
                      <span className="duration">
                        <Clock size={16} />
                        {currentLecture.duration}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Grid>

          <Grid size={{ lg: 4, sm: 12 }}>
            {/* Course Sidebar */}
            <div className="course-sidebar">
              {/* Course Header */}
              <div className="course-header">
                <h1>{courseData.title}</h1>

                <p>{courseData.subtitle}</p>

                {/* here i want to show extra_data which has key value pairs like {"name":"module1 video 1","link":"pdf link"} */}
                {courseData?.extra_data &&
                  courseData?.extra_data.length > 0 && (
                    <div className="extra-data">
                      <p className="documents-title">Course Documents</p>

                      {courseData.extra_data.map((item, index) => (
                        <div key={index} className="extra-item">
                          <h4>{item.name}</h4>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open PDF
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                {currentLecture?.extra_data &&
                  currentLecture?.extra_data.length > 0 && (
                    <div className="extra-data">
                      <p className="documents-title">
                        Current Lecture Documents
                      </p>

                      {currentLecture.extra_data.map((item, index) => (
                        <div key={index} className="extra-item">
                          <h4>{item.name}</h4>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open PDF
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

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
                    {courseData.watchedCount}/{courseData.totalLectures}{" "}
                    completed
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
                        {lecture.duration && (
                          <div className="lecture-duration">
                            <Clock size={14} />
                            <span>{lecture.duration}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        {lecture.isCompleted && (
                          <div className="lecture-watched-tag">Watched</div>
                        )}
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <div className="blurs_wrapper">
          <div className="blurs_object is-fluo"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
