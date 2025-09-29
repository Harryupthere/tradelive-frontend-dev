import { Search } from "lucide-react";
import './courseListing.scss';
import { Container, Grid } from "@mui/material";
import ProductCard, { Course }from "../../components/common/ProductCard";

const CourseListing = () => {
    const courses: Course[] = [
        { id: 1, title: "Trade Live Class", enrollments: "4.9K", rating: 5, image: "thumb1.jpg" },
        { id: 2, title: "Stock Market Basics", enrollments: "3.2K", rating: 4, image: "thumb2.jpg" },
        { id: 3, title: "Crypto Fundamentals", enrollments: "2.7K", rating: 4.5, image: "thumb3.jpg" },
        { id: 4, title: "Options Trading Mastery", enrollments: "6.1K", rating: 5, image: "thumb4.jpg" },
        { id: 1, title: "Trade Live Class", enrollments: "4.9K", rating: 5, image: "thumb5.jpg" },
        { id: 2, title: "Stock Market Basics", enrollments: "3.2K", rating: 4, image: "thumb6.jpg" },
        { id: 3, title: "Crypto Fundamentals", enrollments: "2.7K", rating: 4.5, image: "thumb7.jpg" },
        { id: 4, title: "Options Trading Mastery", enrollments: "6.1K", rating: 5, image: "thumb8.jpg" },
      ];
    return (
        <div className="course-listing-page">
            <Container>
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
                        {courses.map((course) => (
                          <Grid size={{ lg: 3, md: 4, sm: 6 }} key={course.id}>
                            <ProductCard course={course} />
                          </Grid>
                        ))}
                      </Grid>


            </Container>
            <div className="blurs_wrapper"><div className="blurs_object is-fluo"></div></div>
        </div>
    );
};

export default CourseListing;
