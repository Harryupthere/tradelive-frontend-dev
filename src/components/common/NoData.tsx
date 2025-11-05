import { SearchX } from 'lucide-react'


const NoData = () => {
  return (
    <div style={{height:'40vh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:'100%'}}>
        <SearchX style={{ fontSize: 50, color: '#ccc' }} />
        <h3 style={{marginTop:'20px'}}>Data Not Found</h3>
    </div>
  )
}

export default NoData