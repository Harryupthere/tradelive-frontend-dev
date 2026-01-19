import React, { useEffect } from "react";
import "./VideoPopup.scss";

interface Props {
  videoUrl: string;
  onClose: () => void;
}

const VideoPopup: React.FC<Props> = ({ videoUrl, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden"; // disable scroll
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="video-overlay" onClick={onClose}>
      <div className="video-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <video
          src={videoUrl}
          controls
          autoPlay
          className="video-player"
           controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      disableRemotePlayback
                      onContextMenu={(e) => e.preventDefault()} // disable right-click
        />
      </div>
    </div>
  );
};

export default VideoPopup;
