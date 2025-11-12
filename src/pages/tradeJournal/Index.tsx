import { setUser as persistUser } from "../../utils/tokenUtils";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { successMsg, errorMsg } from "../../utils/customFn";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import '../profile/Profile.scss'
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 2,
  backgroundColor: "var(--bg-modal)",
  borderRadius: "8px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const TradeJournal: React.FC = () => {
  const [tradeJournalsPagination, setTradeJournalsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [tradeJournals, setTradeJournals] = useState([]);

  const [addTradejournralModalOpen, setAddTradejournalModalOpen] =
    useState(false);
  const [tradejounralOpen, setTradejounralOpen] = useState(false);
  const [currentTradeJournal, setCurrentTradeJournal] = useState<any>(null);
  const [tradeJournalFormData, setTradeJournalFormData] = useState({
    symbol: "",
    lot_size: "",
    take_profit: "",
    stop_loss: "",
    trade_date: "",
    picture: "",
    reason: "",
  });
  const [tradeJournalFile, setTradeJournalFile] = useState<File | null>(null);
  const [tradeJournalPreview, setTradeJournalPreview] = useState<string | null>(
    null
  );
  const [tradeJournalUploading, setTradeJournalUploading] = useState(false);

  useEffect(() => {
    fetchTradeJournals(1);
  }, []);

  const fetchTradeJournals = async (page = 1) => {
    try {
      const res = await api.get(
        `${API_ENDPOINTS.tradeJournal}?page=${page}&limit=${tradeJournalsPagination.limit}`
      );
      if (res.data.status) {
        setTradeJournals(res.data.data.data.journals);
        setTradeJournalsPagination({
          ...tradeJournalsPagination,
          page,
          total: res.data.data.data.total || 0,
          total_pages:
            res.data.data.data.total_pages ||
            Math.ceil(
              (res.data.data.data.total || 0) / tradeJournalsPagination.limit
            ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTradeJournal = async (id: any) => {
    if (!id) return;
    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete this trade journal entry?"
    // );
    // if (!confirmDelete) return;
    try {
      const res = await api.delete(`${API_ENDPOINTS.tradeJournal}/${id}`);
      if (res?.data?.status) {
        successMsg("Trade journal entry deleted");
        // refresh current page
        fetchTradeJournals(tradeJournalsPagination.page || 1);
      } else {
        errorMsg(res?.data?.message || "Failed to delete entry");
      }
    } catch (err: any) {
      console.error("Delete trade journal failed", err);
      errorMsg(err?.response?.data?.message || "Failed to delete entry");
    }
  };

  const uploadFileToS3 = async (file: File) => {
    try {
      // 1. request presigned url
      const res = await api.post(API_ENDPOINTS.uploadRequest, {
        filename: file.name,
        fileType: file.type,
      });
      const { uploadUrl, fileUrl } = res?.data.data || {};
      if (!uploadUrl || !fileUrl) throw new Error("Invalid upload response");

      // 2. upload to S3 (PUT). If CORS errors occur, backend S3 CORS must be configured.
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. return final file url (CloudFront or S3 path) to save in DB
      return fileUrl;
    } catch (err) {
      console.error("S3 upload failed", err);
      return null;
    }
  };

  const addTradeJournalApi = async () => {
    try {
      // basic validation
      if (!tradeJournalFormData.symbol || !tradeJournalFormData.reason) {
        errorMsg("Please provide symbol and reason");
        return;
      }
      setTradeJournalUploading(true);
      let pictureUrl = tradeJournalFormData.picture || null;
      // if a file is selected, upload it to S3 and use returned URL
      if (tradeJournalFile) {
        const uploaded = await uploadFileToS3(tradeJournalFile);
        if (!uploaded) {
          setTradeJournalUploading(false);
          errorMsg("Image upload failed");
          return;
        }
        pictureUrl = uploaded;
      }

      const payload = {
        symbol: tradeJournalFormData.symbol,
        lot_size: tradeJournalFormData.lot_size,
        take_profit: tradeJournalFormData.take_profit,
        stop_loss: tradeJournalFormData.stop_loss,
        trade_date: tradeJournalFormData.trade_date || null,
        picture: pictureUrl,
        reason: tradeJournalFormData.reason,
      };

      const res = await api.post(API_ENDPOINTS.tradeJournal, payload);
      if (res?.data?.status) {
        successMsg("Trade journal added");
        closeAddTradeJournal();
        setTradeJournalFile(null);
        setTradeJournalPreview(null);
        fetchTradeJournals(tradeJournalsPagination.page || 1);
      } else {
        errorMsg(res?.data?.message || "Failed to add trade journal");
      }
    } catch (err: any) {
      console.error("Add trade journal failed", err);
      errorMsg(err?.response?.data?.message || "Failed to add trade journal");
    }
    setTradeJournalUploading(false);
  };

  const openTradeJournal = (journal: any) => {
    setCurrentTradeJournal(journal);
    setTradejounralOpen(true);
  };

  const closeTradeJournal = () => {
    setTradejounralOpen(false);
  };

  const addTradeJournal = () => {
    setAddTradejournalModalOpen(true);
  };

  const closeAddTradeJournal = () => {
    setAddTradejournalModalOpen(false);
    setTradeJournalFormData({
      symbol: "",
      lot_size: "",
      take_profit: "",
      stop_loss: "",
      trade_date: "",
      picture: "",
      reason: "",
    });
    setTradeJournalFile(null);
    setTradeJournalPreview(null);
  };

  return (
    <div className="profile-page">
      <div className="profile-page__section">
        <div className="profile-page__section-header">
          <h2>Trade Journals</h2>
          <button
            className="profile-page__save-btn"
            onClick={() => addTradeJournal()}
          >
            Add Trade Journal
          </button>
        </div>

        <div className="profile-page__table-container">
          <table className="profile-page__table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Symbol</th>
                <th>Lot Size</th>
                <th>Take Profit</th>
                <th>Stop Loss</th>
                <th>Trade Date</th>
                <th>Picture</th>
                <th>Reason</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tradeJournals.map((t: any, index) => (
                <tr key={t.id}>
                  <td className="profile-page__table-id">{index + 1}</td>
                  <td>{t.symbol}</td>
                  <td>{t.lot_size}</td>
                  <td>{t.take_profit}</td>
                  <td>{t.stop_loss}</td>
                  <td>{new Date(t.trade_date).toLocaleString()}</td>
                  <td>
                    {t.picture ? (
                      <img
                        src={t.picture}
                        alt={t.symbol}
                        style={{
                          width: 64,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                        onError={(e: any) => {
                          e.currentTarget.src = "/fallback-image.png";
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{t.reason || "—"}</td>
                  <td>
                    {t.created_at
                      ? new Date(t.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    {String(t.is_deleted) === "0" ? (
                      <>
                        {" "}
                        <button
                          className="profile-page__save-btn"
                          onClick={() => deleteTradeJournal(t.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="profile-page__save-btn"
                          onClick={() => openTradeJournal(t)}
                        >
                          Open
                        </button>
                      </>
                    ) : (
                      <span className="muted">Deleted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tradeJournals.length > 0 &&
            tradeJournalsPagination.total_pages > 1 && (
              <Pagination
                currentPage={tradeJournalsPagination.page}
                totalPages={tradeJournalsPagination.total_pages}
                onPageChange={(p: number) => fetchTradeJournals(p)}
              />
            )}
        </div>
      </div>
      <Modal
        open={tradejounralOpen}
        onClose={closeTradeJournal}
        className="profile-modal"
      >
        <Box sx={style}>
          <h2 className="modal-title">Your Trade Journl</h2>

          <div className="forum-modal-quoted">
            <p>
              <b>reason</b>
            </p>
          </div>
          <div className="trade-journal-view">
            <div className="form-row">
              <label>Symbol</label>
              <input
                className="input-group"
                type="text"
                value={currentTradeJournal?.symbol || ""}
                readOnly
              />
            </div>
            <div className="form-row">
              <label>Lot Size</label>
              <input
                className="input-group"
                type="text"
                value={currentTradeJournal?.lot_size || ""}
                readOnly
              />
            </div>
            <div className="form-row">
              <label>Take Profit</label>
              <input
                className="input-group"
                type="text"
                value={currentTradeJournal?.take_profit || ""}
                readOnly
              />
            </div>
            <div className="form-row">
              <label>Stop Loss</label>
              <input
                className="input-group"
                type="text"
                value={currentTradeJournal?.stop_loss || ""}
                readOnly
              />
            </div>
            <div className="form-row">
              <label>Trade Date</label>
              <input
                className="input-group"
                type="text"
                value={
                  currentTradeJournal?.trade_date
                    ? new Date(currentTradeJournal.trade_date).toLocaleString()
                    : ""
                }
                readOnly
              />
            </div>
            <div className="form-row">
              <label>Picture</label>
              {currentTradeJournal?.picture ? (
                <img
                  src={currentTradeJournal.picture}
                  alt="journal"
                  style={{
                    width: "100%",
                    maxHeight: 180,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              ) : (
                <span>—</span>
              )}
            </div>
            <div className="form-row blocked-type">
              <label>Reason</label>
              <textarea
                className="input-group"
                value={currentTradeJournal?.reason || ""}
                readOnly
                rows={5}
                style={{ width: "100%" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <button className="border-btn" onClick={closeTradeJournal}>
                Close
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={addTradejournralModalOpen}
        onClose={closeAddTradeJournal}
        className="profile-modal"
      >
        <Box sx={style}>
          <h2 className="modal-title">Add trade Journal</h2>

          <div className="forum-modal-quoted">
            <p>
              <b>Reason:</b>
            </p>
          </div>
          <div className="trade-journal-form">
            <div className="form-row">
              <label>Symbol</label>
              <input
                className="input-group"
                type="text"
                value={tradeJournalFormData.symbol}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    symbol: e.target.value,
                  })
                }
                placeholder="e.g. USDT"
              />
            </div>
            <div className="form-row">
              <label>Lot Size</label>
              <input
                className="input-group"
                type="text"
                value={tradeJournalFormData.lot_size}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    lot_size: e.target.value,
                  })
                }
                placeholder="e.g. 30"
              />
            </div>
            <div className="form-row">
              <label>Take Profit</label>
              <input
                className="input-group"
                type="text"
                value={tradeJournalFormData.take_profit}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    take_profit: e.target.value,
                  })
                }
                placeholder="e.g. 90%"
              />
            </div>
            <div className="form-row">
              <label>Stop Loss</label>
              <input
                className="input-group"
                type="text"
                value={tradeJournalFormData.stop_loss}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    stop_loss: e.target.value,
                  })
                }
                placeholder="e.g. 32"
              />
            </div>
            <div className="form-row">
              <label>Trade Date</label>
              <input
                className="input-group"
                type="datetime-local"
                value={tradeJournalFormData.trade_date}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    trade_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-row blocked-type">
              <label>Picture URL</label>
              <input
                className="input-group"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  if (!f) return;
                  const allowed = [
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/webp",
                  ];
                  const maxSize = 5 * 1024 * 1024; // 5MB
                  if (!allowed.includes(f.type)) {
                    errorMsg("Only jpg, png or webp images are allowed");
                    return;
                  }
                  if (f.size > maxSize) {
                    errorMsg("Image must be smaller than 5MB");
                    return;
                  }
                  setTradeJournalFile(f);
                  const reader = new FileReader();
                  reader.onload = () =>
                    setTradeJournalPreview(reader.result as string);
                  reader.readAsDataURL(f);
                }}
              />
              <input
                className="input-group"
                type="text"
                value={tradeJournalFormData.picture}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    picture: e.target.value,
                  })
                }
                placeholder="Or paste image URL"
                style={{ flex: 1 }}
              />
              {tradeJournalPreview && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={tradeJournalPreview}
                    alt="preview"
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                </div>
              )}
            </div>
            <div className="form-row blocked-type">
              <label>Reason</label>
              <textarea
                className="input-group"
                value={tradeJournalFormData.reason}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    reason: e.target.value,
                  })
                }
                placeholder="Type your reason..."
                rows={5}
                style={{ width: "100%" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <button className="cancel-btn" onClick={closeAddTradeJournal}>
                Cancel
              </button>
              <button
                className="gradient-btn"
                onClick={addTradeJournalApi}
                disabled={tradeJournalUploading}
              >
                {tradeJournalUploading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default TradeJournal;
