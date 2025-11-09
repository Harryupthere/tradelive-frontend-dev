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
import { ArrowLeft, Heart } from "lucide-react";

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
  const [courseFeedback, setCourseFeedback] = useState([]);
  const [addCommentPopUp, setAddCommentPopUp] = useState(false);
  const [userCommented, setUserCommented] = useState(false);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch (e) {
      return iso;
    }
  };

  const getFeedbackArray = () => {
    // API might return array or { feedbacks: [...] }
    if (Array.isArray(courseFeedback)) return courseFeedback as any[];
    if ((courseFeedback as any)?.feedbacks) return (courseFeedback as any).feedbacks;
    return [];
  };

  const toggleLike = async (fb: any) => {
    const userId = getUser()?.id;
    if (!userId) {
      successMsg("Please login to like comments");
      return;
    }

    const feedbacks = getFeedbackArray();
    const idx = feedbacks.findIndex((f) => String(f.id) === String(fb.id));
    if (idx === -1) return;

    const liked = (fb.liked_user_ids || []).map(String).includes(String(userId));

    // optimistic update
    const updated = [...feedbacks];
    const item = { ...updated[idx] };
    if (liked) {
      item.liked_user_ids = (item.liked_user_ids || []).filter((u: any) => String(u) !== String(userId));
      item.like_count = Math.max(0, (item.like_count || 0) - 1);
    } else {
      item.liked_user_ids = [...(item.liked_user_ids || []), userId];
      item.like_count = (item.like_count || 0) + 1;
    }
    updated[idx] = item;

    // save back to state (preserve original shape)
    if (Array.isArray(courseFeedback)) setCourseFeedback(updated as any);
    else setCourseFeedback({ ...(courseFeedback as any), feedbacks: updated } as any);

    // // call backend - ASSUMPTION: endpoint POST /product-feedback/:productId/like
    // try {
    //   const res = await api.post(`${API_ENDPOINTS.courseOverviewFeedback}/${id}/like`, {
    //     feedback_id: fb.id,
    //   });
    //   if (res?.data?.status) {
    //     // success - optionally show message
    //   } else {
    //     // revert optimistic update on failure
    //     fetchCoursesFeedbacks();
    //   }
    // } catch (err) {
    //   console.error("Like API failed", err);
    //   fetchCoursesFeedbacks();
    // }
  };


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

  const fetchCoursesFeedbacks = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS?.courseOverviewFeedback}/${id}`);
      console.log('response feedback', response)
      if (response?.data?.status) {
        const data = response?.data?.data;
        setCourseFeedback(data);
        // set userCommented if current user already left feedback
        try {
          const userId = getUser()?.id;
          const arr = Array.isArray(data) ? data : data?.feedbacks || [];
          const already = arr.some((f: any) => String(f.user?.id) === String(userId));
          setUserCommented(Boolean(already));
        } catch (e) {
          setUserCommented(false);
        }
      }
    } catch (error) {
      console.log("Failed to fetch news", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCoursesFeedbacks()
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
      const handleBackToCalculators = () => {
    navigate(`${base}courses`);
  };

  const handleComment = () => {
  // here I want a popup to add comment and star rating
  // please remember rating can be given from 1 to 5 without it user can not submit
  }
  
  // open add comment popup (UI only)
  const openAddComment = () => {
    setAddCommentPopUp(true);
  };

  const closeAddComment = () => {
    setAddCommentPopUp(false);
  };
  return (
    <div className="course-overview">
      <Container>
        <Grid container spacing={3}>
          <Grid size={{ lg: 7, sm: 12 }}>
            <div className="course-detail-page__header">
          <button className="back-button" onClick={handleBackToCalculators}>
            <ArrowLeft size={20} />
            Back to Courses
          </button>
          {/* <h1 className="course-detail-page__title">{courseData.title}</h1> */}
        </div>
        {/* Add Comment popup (UI placeholder) */}
        {addCommentPopUp && (
          <div className="add-comment-modal">
            <div className="add-comment-modal__backdrop" onClick={closeAddComment} />
            <div className="add-comment-modal__panel">
              <h3>Add your feedback</h3>
              <p className="muted">(UI only) Add comment form goes here. Rating (1-5) required to submit.</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="border-btn" onClick={closeAddComment}>Close</button>
              </div>
            </div>
          </div>
        )}
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

        {/* Feedback Section */}
        <div className="feedback-section">
          <div className="feedback-header">
            <h3 className="section-title">Recent Feedback</h3>
           {courseDetail.enrolled   && <button type="button" className="add-comment-btn" onClick={()=>openAddComment()}>Add Comment</button>}
          </div>
          <div className="feedback-list">
            {getFeedbackArray().length === 0 && (
              <div className="no-feedback">No feedback yet</div>
            )}
            {getFeedbackArray().map((f: any) => (
              <div className="feedback-card" key={f.id}>
                <div className="feedback-card__head">
                  <div className="user-info">
                    <div className="user-name">{f.user?.first_name} {f.user?.last_name}</div>
                    <div className="user-meta">User Id - {f.user?.unique_id} • Member since - {formatDate( f.createdAt)} •  Enrolled - {formatDate(f.user?.enrollments?.[0]?.enrolled_at)}</div>
                  </div>
                </div>

                <div className="feedback-comment">{f.comment}</div>

                {/* show star rating if present (value out of 5) */}
                {(f.rating || f.star || f.rating_value) > 0 && (
                  <div className="feedback-stars">
                    <Rating
                      name={`read-${f.id}`}
                      value={Number(f.rating || f.star || f.rating_value || 0)}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </div>
                )}

                {f.user.id!==getUser().id && <div className="feedback-actions">
                  <button
                    className={`like-btn ${ (f.liked_user_ids || []).map(String).includes(String(getUser()?.id)) ? 'liked' : ''}`}
                    onClick={() => toggleLike(f)}
                    aria-label="like"
                  >
                    <Heart size={18} />
                    <span className="like-count">{f.like_count || 0}</span>
                  </button>
                </div>}
              </div>
            ))}
          </div>
        </div>
        {/* Instructor card section */}
        {courseDetail?.instructors?.length > 0 && (
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
