import { Rating } from "@mui/material"
import image from "../../utils/helpers"

const ProductCard = () => {
    return (
        <div className="course-card">
            <div className="course-card-img"><img src={image['thumb1.jpg']} alt="thumbnail" /></div>
            <div className="card-content">
                <h3 className="title">Trade live class</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, vel?</p>
                <div className="rating-align">
                    <div className="rating">
                        <Rating name="size-small" defaultValue={2} size="small" /> <span>(100)</span>
                    </div>
                    <div className="total-enroll">
                        4.9K Enrollments
                    </div>
                </div>
                <button type="button" className="gradient-btn">View Full Course</button>
            </div>
        </div>
    )
}

export default ProductCard
