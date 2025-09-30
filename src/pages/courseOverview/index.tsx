import { Container, Grid, Rating } from "@mui/material"
import image from "../../utils/helpers"
import './courseOverview.scss'
import { Play } from "../../icon/icons"
import { useEffect, useState } from "react"
import { API_ENDPOINTS } from "../../constants/ApiEndPoints"
import { api } from "../../api/Service"
import { useParams } from "react-router-dom"
const CourseOverview = () => {
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
                setCourseDetail(data)
            }
        } catch (error) {
            console.log("Failed to fetch news", error);
        }
    };

    useEffect(() => {
        fetchCourses()
    }, []);

    function decodeHtml(html: string): string {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    return (
        <div className="course-overview">
            <Container>
                <Grid container spacing={3}>
                    <Grid size={{ lg: 7, sm: 12 }} >
                        <div className="course-content">
                            <div className="title">
                                {courseDetail?.title}
                            </div>
                            <p className="description">
                                {courseDetail?.subtitle}
                            </p>

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
                                <div className="total-enroll">Enrollments( {courseDetail.enrolledCount}) </div>
                            </div>
                            <button type="button" className="gradient-btn">
                                Enroll Now
                            </button>
                        </div>
                    </Grid>
                    <Grid size={{ lg: 5, sm: 12 }} >
                        <div className="course-image">
                            <img src={image['thumb1.jpg']} alt="preview" />
                            <button className="play-btn">
                                <Play />
                            </button>
                        </div>
                    </Grid>
                </Grid>
                <div
                    className="description-section"
                    dangerouslySetInnerHTML={{
                        __html: decodeHtml(courseDetail?.description || ''),
                    }}
                />
            </Container>
        </div>
    )
}

export default CourseOverview