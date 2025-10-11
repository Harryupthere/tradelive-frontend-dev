import { Container, Grid, Rating } from "@mui/material";
import "./courseOverview.scss";
import { Play } from "../../icon/icons";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";
import {  useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {  successMsg } from "../../utils/customFn";

const base = import.meta.env.VITE_BASE;

const CourseOverview = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  interface CourseDetail {
    title?: string;
    subtitle?: string;
    enrolledCount?: number;
    description?: string;
  }
  const [courseDetail, setCourseDetail] = useState<CourseDetail>({});

  const fetchCourses = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS?.courseOverview}/${id}`);
      if (response?.status) {
        const data = response?.data?.data?.data;
        setCourseDetail(data);
      }
    } catch (error) {
      console.log("Failed to fetch news", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  function decodeHtml(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const handleEnroll = async (e, enrollerd) => {
    e.preventDefault();
    try {
      if (enrollerd) {
        navigate(`${base}course/detail/${id}`);
      } else {
        const payload = { product_id: parseInt(id) };
        const res = await api.post(API_ENDPOINTS.enrollment, payload);
        if (res.data.status) {
          successMsg(res.data.data.message);
          fetchCourses();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="course-overview">
      <Container>
        <Grid container spacing={3}>
          <Grid size={{ lg: 7, sm: 12 }}>
            <div className="course-content">
              <div className="title">{courseDetail?.title}</div>
              <p className="description">{courseDetail?.subtitle}</p>

              <div className="rating-align">
                <div className="rating">
                  <Rating
                    name="size-small"
                    defaultValue={5}
                    precision={0.5}
                    size="small"
                    readOnly
                  />{" "}
                  <span>({Math.floor(Math.random() * 200)})</span>
                </div>
                <div className="total-enroll">
                  Enrollments( {courseDetail.enrolledCount}){" "}
                </div>
              </div>
              <button
                type="button"
                className="gradient-btn"
                onClick={(e) => {
                  handleEnroll(e,courseDetail.enrolled);
                }}
              >
                {courseDetail.enrolled ? "Open" : "Enroll Now"}
              </button>
            </div>
          </Grid>
          <Grid size={{ lg: 5, sm: 12 }}>
            <div className="course-image">
              <img src={courseDetail.preview_image} alt="preview" />
              <button className="play-btn">
                <Play />
              </button>
            </div>
          </Grid>
        </Grid>
        <div
          className="description-section"
          dangerouslySetInnerHTML={{
            __html: decodeHtml(courseDetail?.description || ""),
          }}
        />
      </Container>
    </div>
  );
};

export default CourseOverview;
