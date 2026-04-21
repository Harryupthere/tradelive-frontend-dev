import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Clock,
  CheckCircle,
  Lock,
  ArrowLeft,
} from "lucide-react";
import "../courseDetail/courseDetail.scss";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { Grid } from "@mui/material";
import { getUser } from "../../utils/tokenUtils";
import Hls from "hls.js";

const base = import.meta.env.VITE_BASE;

interface Lecture {
  id: string;
  title: string;
  duration?: string;
  videoUrl: string;
  description: string;
  thumbnail?: string;
  subheading?: string;
}

interface CourseData {
  id: string;
  title: string;
  instructor: string;
  description: string;
  thumbnail: string;
  lectures: Lecture[];
  extra_data: any[];
}

const ProductResourcesDetail: React.FC = () => {
  const userDetails = getUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState<number>(0);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // ✅ FETCH DATA
  useEffect(() => {
    courseOverviewApiCall();
  }, []);

  // ✅ HLS PLAYER SETUP
  useEffect(() => {
    if (!currentLecture?.videoUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (currentLecture.videoUrl.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
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

  // ✅ FULLSCREEN
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

  // ✅ API CALL
  const courseOverviewApiCall = async () => {
    const res = await api.get(`${API_ENDPOINTS.productResources}/${id}`);
    if (res.status) {
      const apiData = res.data.data.data;

      const mappedCourse: CourseData = {
        id: apiData.id,
        title: apiData.title,
        instructor: apiData.meta.educator,
        description: apiData.description,
        thumbnail: apiData.preview_image,
        extra_data: apiData.extra_data || [],
        lectures: (apiData.course.content || []).map(
          (item: any, idx: number) => ({
            id: String(idx + 1),
            title: item.heading,
            duration: item.duration,
            videoUrl: item.url,
            description: item.description,
            thumbnail: item.thumbnail,
            subheading: item.subheading,
          })
        ),
      };

      setCourseData(mappedCourse);

      if (mappedCourse.lectures.length > 0) {
        setCurrentLecture(mappedCourse.lectures[0]);
      }
    }
  };

  // ✅ CLICK LECTURE
  const handleLectureClick = (lecture: Lecture, index: number) => {
    setCurrentLecture(lecture);
    setCurrentLectureIndex(index);
  };

  const handleBack = () => {
    navigate(`${base}resources`);
  };

  if (!courseData) return <div>Loading...</div>;

  return (
    <div className="course-detail-page">
      <div className="container">

        {/* HEADER */}
        <div className="course-detail-page__header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        <Grid container spacing={2}>
          
          {/* VIDEO */}
          <Grid size={{ lg: 8, sm: 12 }}>
            <div className="video-section">
              <div className="video-player">

                {currentLecture ? (
                  <div className="video-wrapper" ref={videoWrapperRef}>

                    {/* ✅ FIXED VIDEO */}
                    <video
                      ref={videoRef}
                      key={currentLecture.id}
                      controls
                      preload="auto"
                      playsInline
                      poster={currentLecture.thumbnail}
                      className="main-video"
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      disableRemotePlayback
                      crossOrigin="anonymous"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      Your browser does not support the video tag.
                    </video>

                    <button
                      className="fullscreen-btn"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    </button>
                  </div>
                ) : (
                  <div className="video-placeholder">
                    <img src={courseData.thumbnail} alt={courseData.title} />
                  </div>
                )}
              </div>

              {/* LECTURE INFO */}
              {currentLecture && (
                <div className="current-lecture-info">
                  <h2>{currentLecture.title}</h2>
                  <p>{currentLecture.description}</p>
                  {currentLecture.duration && (
                    <div className="lecture-meta">
                      <Clock size={16} />
                      {currentLecture.duration}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Grid>

          {/* SIDEBAR */}
          <Grid size={{ lg: 4, sm: 12 }}>
            <div className="course-sidebar">

              <div className="course-header">
                <h1>{courseData.title}</h1>
                <p>{courseData.description}</p>
              </div>

              {/* LECTURES */}
              <div className="lectures-section">
                <h3>Content</h3>
                <div className="lectures-list">
                  {courseData.lectures.map((lecture, index) => (
                    <div
                      key={lecture.id}
                      className={`lecture-item ${
                        currentLecture?.id === lecture.id ? "active" : ""
                      }`}
                      onClick={() => handleLectureClick(lecture, index)}
                    >
                      <div className="lecture-number">{index + 1}</div>

                      <div className="lecture-content">
                        <h4>{lecture.title}</h4>
                        {lecture.duration && (
                          <div className="lecture-duration">
                            <Clock size={14} />
                            {lecture.duration}
                          </div>
                        )}
                      </div>

                      <button className="play-btn">
                        <Play size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Grid>
        </Grid>

      </div>
    </div>
  );
};

export default ProductResourcesDetail;