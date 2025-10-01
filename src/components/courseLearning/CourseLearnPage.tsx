import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Clock } from "lucide-react";
import "./CourseLearnPage.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;

interface VideoContent {
  heading: string;
  subheading: string;
  thumbnail: string;
  url: string;
  description: string;
}

interface CourseData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  meta: {};
  type: "single" | "multiple";
  content: VideoContent[];
}

// Mock data for demonstration
const mockCourseData: CourseData = {
  id: 1,
  title: "React Advanced Patterns",
  subtitle: "Master React hooks, context, and performance optimization",
  description:
    "<h2>Overview</h2><p>This comprehensive React course will take you from intermediate to advanced level, covering the most important patterns and techniques used in modern React development.</p><p>You'll learn how to build scalable, maintainable React applications using advanced patterns like compound components, render props, and custom hooks.</p>",
  meta: "Advanced Level • 12 weeks • 2,847 students",
  type: "multiple",
  content: [
    {
      heading: "Introduction to Advanced React",
      subheading: "Getting started with advanced concepts",
      thumbnail:
        "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      description:
        "<h3>Introduction</h3><p>Welcome to the advanced React course. In this first video, we'll cover the prerequisites and what you'll learn throughout the course.</p>",
    },
    {
      heading: "Custom Hooks Deep Dive",
      subheading: "Building reusable logic with custom hooks",
      thumbnail:
        "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      description:
        "<h3>Custom Hooks</h3><p>Learn how to extract component logic into reusable custom hooks. We'll build several practical examples.</p>",
    },
    {
      heading: "Context API and State Management",
      subheading: "Managing global state effectively",
      thumbnail:
        "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description:
        "<h3>Context API</h3><p>Master the Context API for state management and learn when to use it vs other solutions.</p>",
    },
    {
      heading: "Performance Optimization",
      subheading: "Making your React apps lightning fast",
      thumbnail:
        "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      description:
        "<h3>Performance</h3><p>Optimize your React applications using memo, useMemo, useCallback, and other techniques.</p>",
    },
    {
      heading: "Advanced Component Patterns",
      subheading: "Compound components and render props",
      thumbnail:
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      description:
        "<h3>Component Patterns</h3><p>Learn advanced component patterns that make your code more flexible and reusable.</p>",
    },
  ],
};

const CourseLearnPage: React.FC = () => {
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaGFyc2guY2hvdWhhbjAxMEBnbWFpbC5jb20iLCJzdWJfaWQiOiIxIiwidHlwZSI6ImxvZ2luIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTg3NDEyMzksImV4cCI6MTc1ODc0NDgzOX0.c-lp29O2ycNqRrwGub2q2XFADIYYmGC118KiTutGKrQ`;
  const { id } = useParams<{ id: string }>(); // 👈 get id from URL

  const navigate = useNavigate();
  const [courseData, setCourseData] = useState<CourseData>();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = courseData?.content[currentVideoIndex];

  useEffect(() => {
    callApi();
  }, []);

  const callApi = async () => {
    try {
      let res = await axios.get(`${apiUrl}courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 add bearer token
        },
      });
    
      setCourseData(res.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next video for multiple type courses
      if (
        courseData.type === "multiple" &&
        currentVideoIndex < courseData.content.length - 1
      ) {
        setTimeout(() => {
          setCurrentVideoIndex(currentVideoIndex + 1);
          setIsPlaying(true);
        }, 1000);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentVideoIndex, courseData?.type, courseData?.content.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [isPlaying, currentVideoIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen();
      }
    }
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;


    function decodeHtml(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  return (
    <div className="course-learn-page">
     {courseData && <div className="course-learn-page__container">
        {/* Header */}
        <header className="course-learn-page__header">
          <h1 className="course-learn-page__title">{courseData?.product?.title}</h1>
          <p className="course-learn-page__subtitle">{courseData?.product?.subtitle}</p>
          {courseData?.type === "multiple" && (
            <div className="course-learn-page__current-video">
              <h2 className="course-learn-page__video-heading">
                {currentVideo?.heading}
              </h2>
              <p className="course-learn-page__video-subheading">
                {currentVideo?.subheading}
              </p>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="course-learn-page__main">
          {/* Video Section */}
          <div className="course-learn-page__video-section">
            <div className="course-learn__video">
              <div className="course-learn__video-player">
                <video
                  ref={videoRef}
                  src={currentVideo?.url}
                  className="course-learn__video-element"
                  onClick={togglePlay}
                />

                {/* Video Controls */}
                <div className="course-learn__video-controls">
                  <div className="course-learn__video-progress">
                    <div
                      className="course-learn__video-progress-bar"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <div className="course-learn__video-controls-bottom">
                    <div className="course-learn__video-controls-left">
                      <button
                        onClick={togglePlay}
                        className="course-learn__video-btn"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="course-learn__video-btn"
                      >
                        {isMuted ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                      <span className="course-learn__video-time">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="course-learn__video-controls-right">
                      <button
                        onClick={toggleFullscreen}
                        className="course-learn__video-btn"
                      >
                        <Maximize size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist Section (only for multiple type) */}
          {courseData?.type === "multiple" && (
            <aside className="course-learn__playlist">
              <h3 className="course-learn__playlist-title">Course Content</h3>
              <div className="course-learn__playlist-videos">
                {courseData?.content.map((video, index) => (
                  <div
                    key={index}
                    className={`course-learn__playlist-item ${
                      index === currentVideoIndex
                        ? "course-learn__playlist-item--active"
                        : ""
                    }`}
                    onClick={() => handleVideoSelect(index)}
                  >
                    <div className="course-learn__playlist-thumbnail">
                      <img src={video.thumbnail} alt={video.heading} />
                      {index === currentVideoIndex && isPlaying && (
                        <div className="course-learn__playlist-playing">
                          <div className="course-learn__playlist-playing-indicator" />
                        </div>
                      )}
                    </div>
                    <div className="course-learn__playlist-content">
                      <h4 className="course-learn__playlist-heading">
                        {video.heading}
                      </h4>
                      <p className="course-learn__playlist-subheading">
                        {video.subheading}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </main>

        {/* Description Section */}
        <section className="course-learn__description">
          <div className="course-learn__description-content">
            {courseData?.type === "single" ? (
              <div
                dangerouslySetInnerHTML={{ __html: decodeHtml(currentVideo?.description) }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: decodeHtml(currentVideo?.description) }}
              />
            )}
          </div>

          {/* {courseData?.meta && (
            <div className="course-learn__meta">
              <Clock size={16} />
              <span>{courseData?.meta}</span>
            </div>
          )} */}
        </section>
        <aside className="course-detail__sidebar">
          <div className="course-detail__meta-box">
            <div className="course-detail__meta-content">
              {Object.entries(courseData?.product?.meta).map(([key, value]) => (
                <div key={key} className="course-detail__meta-item">
                  <div className="course-detail__meta-info">
                    <span className="course-detail__meta-label">{key}</span>
                    <span className="course-detail__meta-value">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>}
    </div>
  );
};

export default CourseLearnPage;
