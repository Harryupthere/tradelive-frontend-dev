import { Container } from "@mui/material"
import Courses from "../../components/home/Courses"

const Home = () => {
  return (
    <>
    <section>
      <Container>
        <Courses/>
      </Container>
      <div className="blurs_wrapper"><div className="blurs_object is-fluo"></div></div>
      </section>
    </>
  )
}

export default Home