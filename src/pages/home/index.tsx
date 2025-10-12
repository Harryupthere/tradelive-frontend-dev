import { Container } from "@mui/material"
import Courses from "../../components/home/Courses"
import Banner from "../../components/home/Banner"
import './home.scss'
import image from '../../assets/images/bar-graph.png'

const Home = () => {
  return (
    <div className="home-wrapped">
      <Banner />
      <section>
        <Container>
          <div className="center-content">
            <div className="overlay-img"><img src={image} alt="img"/></div>
              <h2 className="title">Our Belief</h2>
              <h2 className="gradient-text">Trading Knowledge Should Be Free.</h2>
              <p>
                At TradeLive24, we believe education isn’t a luxury — it’s a foundation.
                That’s why our goal is to make high-quality trading education accessible to everyone, without fake promises or expensive paywalls.
                Learn the craft, understand the markets, and grow with a community that values knowledge over hype.

              </p>
          </div>
          <Courses />
        </Container>
      </section>
    </div>
  )
}

export default Home