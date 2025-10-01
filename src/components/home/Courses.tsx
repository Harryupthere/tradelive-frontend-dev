import { Grid } from "@mui/material";
import ProductCard, { Course } from "../common/ProductCard";

const Courses = () => {
  const courses: Course[] = [
    { id: 1, title: "Trade Live Class", enrollments: "4.9K", rating: 5, image: "thumb1.jpg" },
    { id: 2, title: "Stock Market Basics", enrollments: "3.2K", rating: 4, image: "thumb2.jpg" },
    { id: 3, title: "Crypto Fundamentals", enrollments: "2.7K", rating: 4.5, image: "thumb3.jpg" },
    { id: 4, title: "Options Trading Mastery", enrollments: "6.1K", rating: 5, image: "thumb4.jpg" },
  ];

  return (
    <div className="courses-section">
      <div className="section-header">
        <div className="gradient-title">
          <h2>Explore</h2>
          <p>Courses & Webinars</p>
        </div>
      </div>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid size={{ lg: 3, md: 4, sm: 6 }} key={course.id}>
            <ProductCard course={course} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Courses;
