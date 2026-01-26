import { useRef, useState } from "react";
import "./VideoFrame.scss";

interface VideoFrameProps {
  videoUrl: string;
  poster?: string;
}

const VideoFrame: React.FC<VideoFrameProps> = ({ videoUrl, poster }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState<boolean>(false);

  const handlePlay = (): void => {
    if (!videoRef.current) return;

    videoRef.current.muted = false;
    videoRef.current.loop = false;
    videoRef.current.controls = true;
    videoRef.current.play();

    setStarted(true);
  };

  return (
    <div className="video-wrapper">
      <div className="video-frame">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        {!started && (
          <button
            className="play-btn"
            onClick={handlePlay}
            aria-label="Play video"
          >
            ▶
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoFrame;
