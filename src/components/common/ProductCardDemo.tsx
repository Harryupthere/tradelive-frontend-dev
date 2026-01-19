import React, { useState } from "react";
import VideoPopup from "./VideoPopup";
import image from "../../assets/images/thumb1.jpg";

const ProductCardDemo: React.FC<ProductCardProps> = ({ course , onPlay}) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="course-card" onClick={onPlay}>
        <div className="course-card-img">
          <img src={course.demo_image_url || image} alt={course.title} />
        </div>

        <div className="card-content">
          <h3 className="title">{course.title}</h3>
          <p>{course.subtitle}</p>

          <button
            type="button"
            className="border-btn"
           onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          >
            View Demo Course
          </button>
        </div>
      </div>

      {/* {showPopup && (
        <VideoPopup
          videoUrl={course.demo_video_url}
          onClose={() => setShowPopup(false)}
        />
      )} */}
    </>
  );
};

export default ProductCardDemo;
