import { Container } from "@mui/material"
import Courses from "../../components/home/Courses"
import Banner from "../../components/home/Banner"


const Home = () => {
  return (
    <>
    <Banner/>
    <section>
      <Container>
        <Courses/>
      </Container>
      </section>
    </>
  )
}

export default Home