
import { useState } from "react";
import NoData from "../../components/common/NoData";
import VideoPopup from "../../components/common/VideoPopup";
import "../profile/Profile.scss";

const BrokerageTutorials: React.FC = () => {

  const [brokerageTutorials] = useState([
    {name:"Demo Tutorial",description:"This is a demo tutorial",watch_url:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"}
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const openVideo = (url: string) => {
    setActiveVideo(url);
    setShowPopup(true);
  };
  const closeVideo = () => {
    setShowPopup(false);
    setActiveVideo(null);
  };

  // useEffect(() => {
  //   fetchPlatformTutorials();
  // }, []);

  // const fetchPlatformTutorials = async () => {
  //   try {
  //     const res = await api.get(`${API_ENDPOINTS.platformTutorials}`);
  //     if (res.data.status) {
  //        setPlatformTutorials(res.data.data.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="profile-page">
      <div className="">
        <div className="profile-page__section-header">
          <h2>Brokerage Tutorials</h2>
        </div>

        <div className="profile-page__table-container">
          <table className="profile-page__table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Name</th>
                <th>Description</th>
                <th>Watch Now</th> 
                {/* i want it to be a action button  */}
              </tr>
            </thead>
            <tbody>
              {brokerageTutorials?.length > 0 ? (
                brokerageTutorials?.map((t: any, index) => (
                  <tr key={t.id}>
                    <td className="profile-page__table-id">{index + 1}</td>
                    <td>{t.name}</td>
                    <td>{t.description}</td>
                    <td>
                      <button onClick={() => openVideo(t.watch_url)}>
                        Watch Now
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <NoData col={10} />
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showPopup && activeVideo && (
        <VideoPopup videoUrl={activeVideo} onClose={closeVideo} />
      )}
    </div>
  );
};

export default BrokerageTutorials;
