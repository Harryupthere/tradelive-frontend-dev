import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";

import "../profile/Profile.scss";

import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { successMsg, errorMsg } from "../../utils/customFn";
import { getUser } from "../../utils/tokenUtils";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../utils/redux/typedHook";
import { setUserProfile } from "../../utils/redux/slice";
import { setUser as persistUser } from "../../utils/tokenUtils";
import { Box, Dialog, IconButton, Modal, Typography, useMediaQuery, useTheme } from "@mui/material";
import './supportTickets.scss'
const style = {
  bgcolor: "background.paper",
  p: 2,
  backgroundColor: "var(--bg-modal)",

};

const base = import.meta.env.VITE_BASE || "/";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tickets, setTickets] = useState([]);
  const [ticketPagination, setTicketPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });

  const [ticketModal, setTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    description: "",
  });

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets(1);
  }, []);

  const fetchTickets = async (page = 1) => {
    try {
      const res = await api.get(
        `${API_ENDPOINTS.supportTickets}?page=${page}&limit=${ticketPagination.limit}`,
      );
      if (res.data.status) {
        setTickets(res.data.data.data);

        setTicketPagination({
          ...ticketPagination,
          page,
          total: res.data.data.total,
          total_pages: res.data.data.total_pages,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createTicket = async () => {
    if (
      !ticketForm.name ||
      !ticketForm.email ||
      !ticketForm.mobile ||
      !ticketForm.subject ||
      !ticketForm.description
    ) {
      errorMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(API_ENDPOINTS.createSupportTicket, ticketForm);

      if (res.data.status) {
        successMsg("Ticket created successfully");
        setTicketModal(false);
        fetchTickets(1);

        setTicketForm({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          description: "",
        });
      }
    } catch (err) {
      errorMsg("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-page__section">
        <div className="profile-page__section-header">
          <h2>Support Tickets</h2>

          <button className="gradient-btn" onClick={() => setTicketModal(true)}>
            Create Ticket
          </button>
        </div>

        <div className="profile-page__table-container">
          <table className="profile-page__table">
            <thead>
              <tr>
                <th>Ticket No</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Admin Note</th>
                <th>Updated At</th>
              </tr>
            </thead>

            <tbody>
              {tickets?.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.ticket_number}</td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.description}</td>
                  <td>
                    <span className={`ticket-status ${ticket.status}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td>{ticket.admin_notes ? ticket.admin_notes : "-"}</td>
                  <td>{new Date(ticket.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {ticketPagination.total_pages > 1 && (
            <Pagination
              currentPage={ticketPagination.page}
              totalPages={ticketPagination.total_pages}
              onPageChange={(page) => fetchTickets(page)}
            />
          )}
        </div>
      </div>

      <Dialog
        open={ticketModal}
        onClose={() => setTicketModal(false)}
        className="profile-modal"
        //  fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
      >
        <Box sx={style}>
          <h2 className="modal-title" style={{color:'#fff'}}>Create Support Ticket</h2>

          <div className="trade-journal-form supprot-tichet-form">
            <div className="form-row">
              <label>Name</label>
              <input
                className="input-group"
                value={ticketForm.name}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, name: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input
                className="input-group"
                value={ticketForm.email}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, email: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Mobile</label>
              <input
                className="input-group"
                value={ticketForm.mobile}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, mobile: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label>Subject</label>
              <input
                className="input-group"
                value={ticketForm.subject}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, subject: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                className="input-group"
                rows={4}
                value={ticketForm.description}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                className="cancel-btn"
                onClick={() => setTicketModal(false)}
              >
                Cancel
              </button>

              <button className="gradient-btn" onClick={createTicket} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </Box>
      </Dialog >
    </div>
  );
};

export default ProfilePage;
