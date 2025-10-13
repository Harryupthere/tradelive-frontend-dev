import { Container } from "@mui/material";
import Courses from "../../components/home/Courses";
import Banner from "../../components/home/Banner";
import "./home.scss";
import image from "../../assets/images/bar-graph.png";
import glob from "../../assets/images/glob.png";
import Slider from "react-slick";
import { useRef } from "react";
import ProductCard,{ Course } from "../../components/common/ProductCard";
import { ArrowRight } from "lucide-react";



const base = import.meta.env.VITE_BASE;

// ✅ Slider settings
const responsiveSlider = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  initialSlide: 0,
  arrows: false,
  dots: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Home = () => {
  const sliderRef = useRef<Slider | null>(null);

  const courses: Course[] = [
    { id: 1, title: "Trade Live Class", enrollments: "4.9K", rating: 5 },
    { id: 2, title: "Stock Market Basics", enrollments: "3.2K", rating: 4 },
    { id: 3, title: "Crypto Fundamentals", enrollments: "2.7K", rating: 4.5 },
    { id: 4, title: "Options Trading Mastery", enrollments: "6.1K", rating: 5 },
  ];

  return (
    <div className="home-wrapped">
      <Banner />
      <Container>
        <div className="center-content">
          <div className="overlay-img">
            <img src={image} alt="img" />
          </div>
          <h2 className="title">Our Belief</h2>
          <h2 className="gradient-text">Trading Knowledge Should Be Free.</h2>
          <p>
            At TradeLive24, we believe education isn’t a luxury — it’s a
            foundation. That’s why our goal is to make high-quality trading
            education accessible to everyone, without fake promises or expensive
            paywalls. Learn the craft, understand the markets, and grow with a
            community that values knowledge over hype.
          </p>
        </div>

        <section className="whatis-trade">
          <div className="blurs_wrapper">
            <div className="blurs_object is-fluo"></div>
          </div>
          <div className="left-content">
            <div className="globe-wrapper">
              <img src={glob} alt="glob" className="glob" />
            </div>
            <h2 className="bottom-title">
              What <img src={`${base}TRADELIVE24-logo.png`} alt="logo" /> Is
            </h2>
          </div>
          <div className="right-content">
            <h2 className="gradient-text">
              The Modern Hub for Traders Who Want More.
            </h2>
            <p>
              TradeLive24 connects traders, educators, and enthusiasts who live
              for the markets. No gimmicks. No signals. Just real insights, real
              discussions, and real growth.
            </p>
          </div>
        </section>

        <section className="watch">
          <div className="left-content">
            <h2 className="title">Watch & Learn</h2>
            <h2 className="gradient-text">
              Learn My Trading Style —<br/> Real Market Education.
            </h2>
            <p>
              Each video breaks down live price action, structure, and strategy
              — the way professionals think.
            </p>
            <p>Practical, actionable, and completely transparent.</p>

              <button className="gradient-btn">
                        Start Learning
                        <ArrowRight size={20} />
                      </button>

                          <div className="slider-arrows">
              <button
                className="nav-arrow"
                onClick={() => sliderRef.current?.slickPrev()}
              >
                ←
              </button>
              <button
                className="nav-arrow"
                onClick={() => sliderRef.current?.slickNext()}
              >
                →
              </button>
            </div>
          </div>

          <div className="right-content">
            <div className="slider-container">
              <Slider ref={sliderRef} {...responsiveSlider}>
                {courses.map((course) => (
                  <div key={course.id} className="courses-slide">
                    <ProductCard course={course} />
                  </div>
                ))}
              </Slider>
            </div>

        
          </div>
        </section>
{/* 
        <section>
          <Courses />
        </section> */}
      </Container>
    </div>
  );
};

export default Home;
