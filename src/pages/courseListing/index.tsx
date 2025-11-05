import { Search } from "lucide-react";
import './courseListing.scss';
import { Grid } from "@mui/material";
import ProductCard, { Course } from "../../components/common/ProductCard";
import { api } from "../../api/Service";
import { useEffect, useState, useRef } from "react";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import CardShimmer from "../../components/common/cardShimmer";

const CourseListing = () => {

    const [course, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const debounceTimer = useRef<number | null>(null);
    const DEBOUNCE_MS = 500;

    const fetchCourses = async (search = '') => {
        setLoading(true);
        try {
            const response = await api.get(`${API_ENDPOINTS?.courses}?search=${search}`);
            if (response?.status) {
                // adapt to your API shape
                const data = response?.data?.data?.data ?? response?.data?.data ?? response?.data;
                setCourses(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.log("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };
    console.log('course', course)
    useEffect(() => {
        fetchCourses('')
    }, []);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = window.setTimeout(() => {
            fetchCourses(value.trim());
        }, DEBOUNCE_MS);
    };

    // optional immediate search when user clicks Search button
    const handleSearchNow = () => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        fetchCourses(searchTerm.trim());
    };

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
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="search-bar__btn" onClick={handleSearchNow}>Search</button>
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
