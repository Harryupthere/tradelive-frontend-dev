import { Container, Grid, Rating } from "@mui/material";
import "./courseOverview.scss";
import { Play } from "../../icon/icons";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { successMsg } from "../../utils/customFn";
import { getUser } from "../../utils/tokenUtils";

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

        if (getUser()?.userType.id == 2 || courseDetail.type == 1) {
          const payload = { product_id: parseInt(id) };
          const res = await api.post(API_ENDPOINTS.enrollment, payload);
          if (res.data.status) {
            successMsg(res.data.data.message);
            fetchCourses();
          }
        } else {
          navigate(`${base}checkout`);
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
                  handleEnroll(e, courseDetail.enrolled);
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
        {/* Instructor card section */}
        {courseDetail?.instructors && (
          <div className="instructor-section">
            <h2 className="section-title">Instructor</h2>
            <div
              className="instructor-card"
              onClick={() => navigate(`${base}instructor/${courseDetail.instructors[0].id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`${base}instructor/${courseDetail.instructors[0].id}`);
              }}
            >
              <div className="instructor-card__image">
            
                <img
                  src={courseDetail.instructors[0].profile_image || '/'}
                  alt={courseDetail.instructors[0].name}
                  onError={(ev: any) => {
                    ev.currentTarget.src = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
              </div>
              <div className="instructor-card__content">
                <h3 className="instructor-card__name">{courseDetail.instructors[0].name}</h3>
                {courseDetail.instructors[0].designation && (
                  <p className="instructor-card__designation">{courseDetail.instructors[0].designation}</p>
                )}
                {courseDetail.instructors[0].bio && (
                  <p className="instructor-card__bio">{courseDetail.instructors[0].bio}</p>
                )}
                <button className="instructor-card__button">View Profile</button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CourseOverview;
