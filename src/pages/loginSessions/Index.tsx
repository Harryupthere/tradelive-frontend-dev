import { Box, Modal, useMediaQuery } from "@mui/material";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { successMsg, errorMsg } from "../../utils/customFn";
import Pagination from "../../components/common/Pagination";
import "../profile/Profile.scss";
import { useEffect, useState } from "react";
import NoData from "../../components/common/NoData";
import { formatDate } from "../../utils/customFn";

const LoginSessions: React.FC = () => {


  const [tradeJournals, setTradeJournals] = useState([]);

  useEffect(() => {
    fetchTradeJournals();
  }, []);

  const fetchTradeJournals = async () => {
    try {
      const res = await api.get(`${API_ENDPOINTS.liveSessions}`);
      if (res.data.status) {
         setTradeJournals(res.data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profile-page">
      <div className="">
        <div className="profile-page__section-header">
          <h2>Login Sessions</h2>
        </div>

        <div className="profile-page__table-container">
          <table className="profile-page__table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>IP Address</th>
                <th>Device ID</th>
                <th>Date time</th>
              </tr>
            </thead>
            <tbody>
              {tradeJournals?.length > 0 ? (
                tradeJournals?.map((t: any, index) => (
                  <tr key={t.id}>
                    <td className="profile-page__table-id">{index + 1}</td>
                    <td>{t.ip_address}</td>
                    <td>{t.user_agent}</td>
                    <td>{new Date(t.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <NoData col={10} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginSessions;
