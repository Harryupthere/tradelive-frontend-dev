import { Search } from "lucide-react";
import './courseListing.scss';
import { Grid } from "@mui/material";
import ProductCard, { Course } from "../../components/common/ProductCard";
import { api } from "../../api/Service";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import CardShimmer from "../../components/common/cardShimmer";

const CourseListing = () => {

    const [course, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await api.get(`${API_ENDPOINTS?.courses}`);
            if (response?.status) {
                const data = response?.data?.data?.data;
                setCourses(data)
            }
        } catch (error) {
            console.log("Failed to fetch news", error);
        }
        finally {
            setLoading(false);
        }
    };
    console.log('course', course)
    useEffect(() => {
        fetchCourses()
    }, []);

    return (
        <div className="course-listing-page">
            <div className="gradient-title" style={{ textAlign: 'center' }}>
                <p>Search for Courses</p>
            </div>
            <div className="search-bar">
                <div className="search-bar__wrapper">
                    <Search className="search-bar__icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="search-bar__input"
                    />
                    <button className="search-bar__btn">Search</button>
                </div>
            </div>

            <Grid container spacing={3}>
                {loading
                        ? Array.from(new Array(4)).map((_, index) => (
                            <Grid  size={{ md: 4, sm: 6 }}  key={index}>
                                <CardShimmer />
                            </Grid>
                        ))
                        :
                        course?.map((course) => (
                            <Grid size={{ md: 4, sm: 6 }} key={course.id}>
                                <ProductCard course={course} />
                            </Grid>
                        ))}
            </Grid>

            <div className="blurs_wrapper"><div className="blurs_object is-fluo"></div></div>
        </div>
    );
};

export default CourseListing;
