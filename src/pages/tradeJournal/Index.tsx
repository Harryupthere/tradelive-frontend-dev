import { Box, Modal, useMediaQuery } from "@mui/material";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { successMsg, errorMsg } from "../../utils/customFn";
import Pagination from "../../components/common/Pagination";
import "../profile/Profile.scss";
import { useEffect, useState } from "react";
import NoData from "../../components/common/NoData";

const TradeJournal: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "95%" : 500,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 2,
    backgroundColor: "var(--bg-modal)",
    borderRadius: "8px",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const [tradeJournalsPagination, setTradeJournalsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [tradeJournals, setTradeJournals] = useState([]);
  const [isEditTradeJournal, setIsEditTradeJournal] = useState(false);
  const [editingTradeJournalId, setEditingTradeJournalId] = useState<
    number | null
  >(null);
  const [addTradejournralModalOpen, setAddTradejournalModalOpen] =
    useState(false);
  const [tradejounralOpen, setTradejounralOpen] = useState(false);
  const [currentTradeJournal, setCurrentTradeJournal] = useState<any>(null);
  const [tradeJournalFormData, setTradeJournalFormData] = useState({
    symbol: "",
    lot_size: "",
    take_profit: "",
    stop_loss: "",
    entry_price: "",
    exit_price: "",
    trade_type: "", // buy / sell
    trade_date: "",
    // picture: "",
    // reason: "",
    picture: [],
    reason: [],
  });
  // const [tradeJournalFile, setTradeJournalFile] = useState<File | null>(null);
  // const [tradeJournalPreview, setTradeJournalPreview] = useState<string | null>(
  //   null,
  // );
  const [tradeEntries, setTradeEntries] = useState([
    {
      file: null as File | null,
      preview: "",
      picture: "",
      reason: "",
    },
  ]);

  const addTradeEntry = () => {
    setTradeEntries((prev) => [
      ...prev,
      {
        file: null,
        preview: "",
        picture: "",
        reason: "",
      },
    ]);
  };

  const removeTradeEntry = (index: number) => {
    setTradeEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const updateReason = (index: number, value: string) => {
    const data = [...tradeEntries];
    data[index].reason = value;
    setTradeEntries(data);
  };

  const updatePictureUrl = (index: number, value: string) => {
    const data = [...tradeEntries];
    data[index].picture = value;
    data[index].preview = value;
    setTradeEntries(data);
  };

  // const updatePictureFile = (
  //   index: number,
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const file = e.target.files?.[0];

  //   if (!file) return;

  //   const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  //   if (!allowed.includes(file.type)) {
  //     errorMsg("Only jpg/png/webp allowed");
  //     return;
  //   }

  //   if (file.size > 5 * 1024 * 1024) {
  //     errorMsg("Image must be less than 5MB");
  //     return;
  //   }

  //   const data = [...tradeEntries];

  //   data[index].file = file;
  //   data[index].preview = URL.createObjectURL(file);

  //   setTradeEntries(data);
  // };


  const updatePictureFile = (
  index: number,
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (!allowed.includes(file.type)) {
    errorMsg("Only jpg/png/webp allowed");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    errorMsg("Image must be less than 5MB");
    return;
  }

  const data = [...tradeEntries];

  data[index].file = file;

  // New preview
  data[index].preview = URL.createObjectURL(file);

  // Keep existing picture URL until upload
  // Don't clear data[index].picture

  setTradeEntries(data);
};

  const [tradeJournalUploading, setTradeJournalUploading] = useState(false);

  useEffect(() => {
    fetchTradeJournals(1);
  }, []);

  const fetchTradeJournals = async (page = 1) => {
    try {
      const res = await api.get(
        `${API_ENDPOINTS.tradeJournal}?page=${page}&limit=${tradeJournalsPagination.limit}`,
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
              (res.data.data.data.total || 0) / tradeJournalsPagination.limit,
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
      // // basic validation
      // if (!tradeJournalFormData.symbol || !tradeJournalFormData.reason) {
      //   errorMsg("Please provide symbol and reason");
      //   return;
      // }
      // setTradeJournalUploading(true);
      // let pictureUrl = tradeJournalFormData.picture || null;
      // // if a file is selected, upload it to S3 and use returned URL
      // if (tradeJournalFile) {
      //   const uploaded = await uploadFileToS3(tradeJournalFile);
      //   if (!uploaded) {
      //     setTradeJournalUploading(false);
      //     errorMsg("Image upload failed");
      //     return;
      //   }
      //   pictureUrl = uploaded;
      // }

      // // const payload = {
      //   symbol: tradeJournalFormData.symbol,
      //   lot_size: tradeJournalFormData.lot_size,
      //   take_profit: tradeJournalFormData.take_profit,
      //   stop_loss: tradeJournalFormData.stop_loss,
      //   trade_date: tradeJournalFormData.trade_date || null,
      //   picture: pictureUrl,
      //   reason: tradeJournalFormData.reason,
      // };

      const pictureUrls: string[] = [];
      const reasons: string[] = [];

      // if (tradeJournalFile) {
      if (tradeEntries) {
        // const uploaded = await uploadFileToS3(tradeJournalFile);

        // if (!uploaded) {
        //   errorMsg("Image upload failed");
        //   return;
        // }

        // pictureUrl = uploaded;

        for (const item of tradeEntries) {
          let url = item.picture;

          if (item.file) {
            const uploaded = await uploadFileToS3(item.file);

            if (!uploaded) {
              errorMsg("Image upload failed");
              return;
            }

            url = uploaded;
          }

          pictureUrls.push(url);
          reasons.push(item.reason);
        }
      }

      const payload = {
        symbol: tradeJournalFormData.symbol,
        lot_size: tradeJournalFormData.lot_size,
        take_profit: tradeJournalFormData.take_profit,
        stop_loss: tradeJournalFormData.stop_loss,
        entry_price: tradeJournalFormData.entry_price,
        exit_price: tradeJournalFormData.exit_price,
        trade_type: tradeJournalFormData.trade_type,
        trade_date: tradeJournalFormData.trade_date || null,
        // picture: pictureUrl,
        // reason: tradeJournalFormData.reason,
        picture_json: pictureUrls,
        reason_json: reasons,
      };

      const res = await api.post(API_ENDPOINTS.tradeJournal, payload);
      if (res?.data?.status) {
        successMsg("Trade journal added");
        closeAddTradeJournal();
        // setTradeJournalFile(null);
        // setTradeJournalPreview(null);
        setTradeEntries([
          {
            file: null,
            preview: "",
            picture: "",
            reason: "",
          },
        ]);
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
    setIsEditTradeJournal(false);
    setEditingTradeJournalId(null);
    setAddTradejournalModalOpen(false);
    setTradeJournalFormData({
      symbol: "",
      lot_size: "",
      take_profit: "",
      stop_loss: "",
      trade_date: "",
      picture: [],
      reason: [],
    });
    // setTradeJournalFile(null);
    // setTradeJournalPreview(null);
  };

  const openEditTradeJournal = (journal: any) => {
    setIsEditTradeJournal(true);
    setEditingTradeJournalId(journal.id);

    setTradeJournalFormData({
      symbol: journal.symbol || "",
      lot_size: journal.lot_size || "",
      take_profit: journal.take_profit || "",
      stop_loss: journal.stop_loss || "",
      entry_price: journal.entry_price || "",
      exit_price: journal.exit_price || "",
      trade_type: journal.trade_type || "",
      trade_date: journal.trade_date
        ? new Date(journal.trade_date).toISOString().slice(0, 16)
        : "",
      // picture: journal.picture || "",
      // reason: journal.reason || "",
         picture: journal.picture_json || [],
    reason: journal.reason_json || [],
    });

    // setTradeJournalPreview(journal.picture || null);
    //const entries =
      // (journal.picture || []).map((picture: string, index: number) => ({
      //   file: null,
      //   preview: picture,
      //   picture,
      //   reason: journal.reason?.[index] || "",
      // })) || [];

      const entries =
  (journal.picture_json || []).map((picture: string, index: number) => ({
    file: null,
    preview: picture,
    picture,
    reason: journal.reason_json?.[index] || "",
  }));

    setTradeEntries(
      entries.length
        ? entries
        : [
            {
              file: null,
              preview: "",
              picture: "",
              reason: "",
            },
          ],
    );

    closeTradeJournal();
    setAddTradejournalModalOpen(true);
  };

  const updateTradeJournalApi = async () => {
    try {
      setTradeJournalUploading(true);

      // let pictureUrl = tradeJournalFormData.picture || null;

      const pictureUrls: string[] = [];
      const reasons: string[] = [];

      // if (tradeJournalFile) {
      if (tradeEntries) {
        // const uploaded = await uploadFileToS3(tradeJournalFile);

        // if (!uploaded) {
        //   errorMsg("Image upload failed");
        //   return;
        // }

        // pictureUrl = uploaded;

        for (const item of tradeEntries) {
          let url = item.picture;

          if (item.file) {
            const uploaded = await uploadFileToS3(item.file);

            if (!uploaded) {
              errorMsg("Image upload failed");
              return;
            }

            url = uploaded;
          }

          pictureUrls.push(url);
          reasons.push(item.reason);
        }
      }

      const payload = {
        symbol: tradeJournalFormData.symbol,
        lot_size: tradeJournalFormData.lot_size,
        take_profit: tradeJournalFormData.take_profit,
        stop_loss: tradeJournalFormData.stop_loss,
        entry_price: tradeJournalFormData.entry_price,
        exit_price: tradeJournalFormData.exit_price,
        trade_type: tradeJournalFormData.trade_type,
        trade_date: tradeJournalFormData.trade_date,
        // picture: pictureUrl,
        // reason: tradeJournalFormData.reason,
        picture_json: pictureUrls,
        reason_json: reasons,
      };

      const res = await api.put(
        `${API_ENDPOINTS.tradeJournal}/${editingTradeJournalId}`,
        payload,
      );

      if (res?.data?.status) {
        successMsg("Trade journal updated successfully");

        closeAddTradeJournal();

        fetchTradeJournals(tradeJournalsPagination.page || 1);

        setIsEditTradeJournal(false);
        setEditingTradeJournalId(null);
      }
    } catch (err: any) {
      errorMsg(
        err?.response?.data?.message || "Failed to update trade journal",
      );
    }

    setTradeJournalUploading(false);
  };
  return (
    <div className="profile-page">
      <div className="">
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
                <th>Entry</th>
                <th>Exit</th>
                <th>Type</th>
                <th>Picture</th>
                <th>Reason</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tradeJournals?.length > 0 ? (
                tradeJournals?.map((t: any, index) => (
                  <tr key={t.id}>
                    <td className="profile-page__table-id">{index + 1}</td>
                    <td>{t.symbol}</td>
                    <td>{t.lot_size}</td>
                    <td>{t.take_profit}</td>
                    <td>{t.stop_loss}</td>
                    <td>{new Date(t.trade_date).toLocaleString()}</td>
                    <td>{t.entry_price || "—"}</td>
                    <td>{t.exit_price || "—"}</td>
                    <td>
                      <span className={`trade-type ${t.trade_type}`}>
                        {t.trade_type}
                      </span>
                    </td>
                    <td>
                      {t.picture_json && t.picture_json.length>1 ? (
                        "Please open to view"
                      ) : (
                        <img
                          src={t.picture_json[0]}
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
                      )}
                    </td>
                    <td>{t.reason_json && t.reason_json.length > 1 ? "Please open to view" : t.reason_json[0]}</td>
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
                            className="profile-page__delete-btn"
                            onClick={() => deleteTradeJournal(t.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="profile-page__save-trd-btn"
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
                ))
              ) : (
                <NoData col={10} />
              )}
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
              <label>Entry Price</label>
              <input
                className="input-group"
                value={currentTradeJournal?.entry_price || ""}
                readOnly
              />
            </div>

            <div className="form-row">
              <label>Exit Price</label>
              <input
                className="input-group"
                value={currentTradeJournal?.exit_price || ""}
                readOnly
              />
            </div>

            <div className="form-row">
              <label>Trade Type</label>
              <input
                className="input-group"
                value={currentTradeJournal?.trade_type || ""}
                readOnly
              />
            </div>
            {/* <div className="form-row">
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
            </div> */}

            {currentTradeJournal?.picture_json?.length > 0 ? (
              currentTradeJournal.picture_json.map(
                (picture: string, index: number) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid rgba(255,255,255,.15)",
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 20,
                    }}
                  >
                    <h4 style={{ marginBottom: 12 }}>
                      Trade Entry #{index + 1}
                    </h4>

                    <div className="form-row">
                      <label>Picture</label>
                      {picture ? (
                        <img
                          src={picture}
                          alt={`Trade ${index + 1}`}
                          style={{
                            width: "100%",
                            maxHeight: 220,
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
                        value={currentTradeJournal?.reason_json?.[index] || ""}
                        readOnly
                        rows={5}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                ),
              )
            ) : (
              <span>No Pictures Available</span>
            )}

            <div className="form-row blocked-type">
              <label>Mentor Feedback</label>
              <textarea
                className="input-group"
                value={currentTradeJournal?.mentor_feedback || ""}
                readOnly
                rows={5}
                style={{
                  width: "100%",
                  backgroundColor: "#f5f5f5",
                  fontWeight: 500,
                }}
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
              <button
                className="gradient-btn"
                onClick={() => openEditTradeJournal(currentTradeJournal)}
              >
                Edit
              </button>

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

          {/* <div className="forum-modal-quoted">
            <p>
              <b>Reason:</b>
            </p>
          </div> */}
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
            <div className="form-row">
              <label>Entry Price</label>
              <input
                className="input-group"
                type="number"
                value={tradeJournalFormData.entry_price}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    entry_price: e.target.value,
                  })
                }
                placeholder="e.g. 25000"
              />
            </div>

            <div className="form-row">
              <label>Exit Price</label>
              <input
                className="input-group"
                type="number"
                value={tradeJournalFormData.exit_price}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    exit_price: e.target.value,
                  })
                }
                placeholder="e.g. 26000"
              />
            </div>

            <div className="form-row">
              <label>Trade Type</label>
              <select
                className="input-group"
                value={tradeJournalFormData.trade_type}
                onChange={(e) =>
                  setTradeJournalFormData({
                    ...tradeJournalFormData,
                    trade_type: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
           

            {tradeEntries.map((entry, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <h4 style={{ margin: 0 }}>Trade Entry #{index + 1}</h4>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="gradient-btn"
                      onClick={addTradeEntry}
                    >
                      + Add
                    </button>

                    {tradeEntries.length > 1 && (
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => removeTradeEntry(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Upload Image */}

                <div className="form-row blocked-type">
                  <label>Picture</label>

                  <input
                    className="input-group"
                    type="file"
                    accept="image/*"
                    onChange={(e) => updatePictureFile(index, e)}
                  />

                  <input
                    className="input-group"
                    type="text"
                    value={entry.picture}
                    onChange={(e) => updatePictureUrl(index, e.target.value)}
                    placeholder="Or paste image URL"
                    style={{ marginTop: 10 }}
                  />

                  {entry.preview && (
                    <div style={{ marginTop: 10 }}>
                      <img
                        src={entry.preview}
                        alt="preview"
                        style={{
                          width: 150,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Reason */}

                <div className="form-row blocked-type">
                  <label>Reason</label>

                  <textarea
                    className="input-group"
                    rows={5}
                    value={entry.reason}
                    onChange={(e) => updateReason(index, e.target.value)}
                    placeholder="Enter your trade reason..."
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}

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
                onClick={
                  isEditTradeJournal
                    ? updateTradeJournalApi
                    : addTradeJournalApi
                }
                disabled={tradeJournalUploading}
              >
                {tradeJournalUploading
                  ? isEditTradeJournal
                    ? "Updating..."
                    : "Saving..."
                  : isEditTradeJournal
                    ? "Update"
                    : "Save"}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default TradeJournal;
