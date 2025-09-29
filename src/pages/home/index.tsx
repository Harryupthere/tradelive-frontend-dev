import { Grid } from "@mui/material"
import ProductCard from "../../components/common/ProductCard"

const Home = () => {
  return (
    <>
      <div>Home</div>
      <Grid container>
        <Grid size={{md:4}}>
          <ProductCard/>
        </Grid>
      </Grid>
    </>
  )
}

export default Home