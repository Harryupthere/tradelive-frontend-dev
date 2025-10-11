import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronRight,
  MessageSquare,
  Heart,
  Reply,
  User,
  Calendar,
  Quote,
  UploadCloud,
  X,
  MessageCircle,
} from "lucide-react";
import "./ForumTopicsPage.scss";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import image from "../../utils/helpers";

import { errorMsg, successMsg } from "../../utils/customFn";

const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;

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
};
interface CategoryType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface SubCategory {
  id: string;
  uniqueId: string;
  name: string;
  description: string;
  icon: string;
  categoryType: CategoryType;
}

interface QuotedThread {
  id: string;
  message: string;
}

interface Thread {
  id: string;
  threadType: string;
  message: string;
  images?: string[];
  likedCount: string;
  createdAt: string;
  quotedThread?: QuotedThread;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface ForumTopicsData {
  kind: "categories" | "threads";
  data: SubCategory[] | Thread[];
}

const ForumTopicsPage: React.FC = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [topicsData, setTopicsData] = useState<ForumTopicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [forumName, setForumName] = useState("");
  // ...existing code...
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string>("");

  const [forumCategoryIdNumber, setForumCategoryIdNumber] = useState<
    number | null
  >(null);

  const [openReplies, setOpenReplies] = useState<{ [threadId: string]: boolean }>({});


  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFiles(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "reply" | "quote" | "message" | null
  >(null);
  const [replyToThread, setReplyToThread] = useState<Thread | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  // ...existing code...

  // ...existing code...
  const openReplyModal = (thread: Thread) => {
    setModalType("reply");
    setReplyToThread(thread);
    setModalOpen(true);
    setMessage("");
  };

  const openQuoteModal = (thread: Thread) => {
    setModalType("quote");
    setReplyToThread(thread);
    setModalOpen(true);
    setMessage("");
  };

  const openMessageModal = () => {
    setModalType("message");
    setReplyToThread(null);
    setModalOpen(true);
    setMessage("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setReplyToThread(null);
    setMessage("");
    setSelectedFiles([]);
  };
  // ...existing code...

  // ...existing code...
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setSelectedFiles(selectedFile ? [selectedFile] : []);
    setPreview(URL.createObjectURL(selectedFile));
  };
  // ...existing code...

  useEffect(() => {

    fetchTopicsData();
  }, [forumId]);

      const fetchTopicsData = async () => {
      if (!forumId) return;

      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${apiUrl}threads?forumId=${forumId}`);
        const data = response.data.data;
        //console.log(data)
        setTopicsData(data);
        setForumCategoryIdNumber(data.data[0]?.forumCategory.id || null);

        // Set forum name from first item's categoryType if available
        if (data.kind === "categories" && data.data.length > 0) {
          setForumName(data.data[0].categoryType.name);
        } else if (data.kind === "threads") {
          // You might want to pass forum name differently for threads
          setForumName("Forum Discussion");
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        // Use mock data for development
        setTopicsData({
          kind: "threads",
          data: [
            {
              id: "5",
              threadType: "quote",
              message: "I am also here to help you too",
              images: [
                "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
              ],
              likedCount: "0",
              createdAt: "2025-09-26T07:39:47.000Z",
              quotedThread: {
                id: "1",
                message:
                  "We are here to help people to service their mac laptops by themselves",
              },
            },
            {
              id: "1",
              threadType: "fresh",
              message:
                "We are here to help people to service their mac laptops by themselves",
              images: [
                "https://cdn-icons-png.flaticon.com/512/2749/2749777.png",
              ],
              likedCount: "0",
              createdAt: "2025-09-24T17:24:37.000Z",
            },
          ],
        });
        setForumName("Mac Services Forum");
      } finally {
        setLoading(false);
      }
    };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubCategoryClick = (subCategory: SubCategory) => {
    navigate(`${base}forum/${subCategory.uniqueId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(dateString);
  };

  const getFilteredData = () => {
    if (!topicsData || !searchTerm) return topicsData?.data || [];

    if (topicsData.kind === "categories") {
      return (topicsData.data as SubCategory[]).filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return (topicsData.data as Thread[]).filter((item) =>
        item.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  if (loading) {
    return (
      <div className="forum-topics-page">
        <div className="forum-topics-page__container">
          <div className="forum-topics-page__loading">
            <div className="forum-topics-page__loading-spinner"></div>
            <p>Loading forum topics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!topicsData) {
    return (
      <div className="forum-topics-page">
        <div className="forum-topics-page__container">
          <div className="forum-topics-page__empty">
            <h2>Error loading topics</h2>
            <p>Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredData = getFilteredData();

  const uploadFileToS3 = async (file: File) => {
    try {
      // 1. Get presigned URL from backend
      const res = await axios.post(`${apiUrl}upload/request`, {
        filename: file.name,
        fileType: file.type,
      });
      const { uploadUrl, fileUrl } = res.data.data;

      // 2. Upload file directly to S3
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Return the CloudFront URL to save in DB
      return fileUrl;
    } catch (err) {
      console.error("File upload failed", err);
      return null;
    }
  };

  const callMessgaesend = async () => {
    setSending(true);
    try {
      const imageUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await uploadFileToS3(file);
        if (url) imageUrls.push(url);
      }
      // console.log(replyToThread)
      await axios.post(`${apiUrl}threads`, {
        forumCategoryId: parseInt(forumCategoryIdNumber),
        parentThreadId:
          modalType === "message" ? null : parseInt(replyToThread?.id),
        images: imageUrls,
        threadType: modalType === "message" ? "fresh" : modalType,
        message,
      });
      closeModal();
      setSelectedFiles([]);
      successMsg("Message sent successfully");
      fetchTopicsData()
    } catch (err) {
      errorMsg("Failed to send message");
    }
    setSending(false);
  };

  const scrollToThread = (threadId: string) => {
  const el = document.getElementById(`thread-${threadId}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // Optionally, highlight the thread briefly
    el.classList.add("highlight-thread");
    setTimeout(() => el.classList.remove("highlight-thread"), 1200);
  }
};
  return (
    <div className="forum-topics-page">
      <div className="forum-topics-page__container">
        {/* Header */}
        <header className="forum-topics-page__header">
          <div className="forum-topics-page__breadcrumb">
            <button
              onClick={() => navigate("/forum")}
              className="forum-topics-page__breadcrumb-item"
            >
              Forum
            </button>
            <ChevronRight
              size={16}
              className="forum-topics-page__breadcrumb-separator"
            />
            <span className="forum-topics-page__breadcrumb-current">
              {forumName}
            </span>
          </div>
          <h1 className="forum-topics-page__title">{forumName}</h1>
        </header>

        {/* Search Bar */}
        <div className="forum-topics-page__search">
          <div className="blurs_wrapper">
            <div className="blurs_object is-fluo"></div>
          </div>
          <div className="forum-topics-page__search-wrapper">
            <Search className="forum-topics-page__search-icon" size={20} />
            <input
              type="text"
              placeholder={
                topicsData.kind === "categories"
                  ? "Search categories..."
                  : "Search discussions..."
              }
              value={searchTerm}
              onChange={handleSearchChange}
              className="forum-topics-page__search-input"
            />
            <button className="forum-topics-page__search-btn">Search</button>
          </div>
        </div>
        {topicsData.kind === "threads" && (
          <div className="thread-top__actions">
            <button className="message-box" onClick={openMessageModal}>
              <img src={image["chat.png"]} alt="message" />
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="forum-topics-page__main">
          {filteredData.length > 0 ? (
            <>
              {topicsData.kind === "categories" ? (
                <div className="forum-topics-page__categories">
                  {(filteredData as SubCategory[]).map((category) => (
                    <div
                      key={category.id}
                      className="forum-category-card"
                      onClick={() => handleSubCategoryClick(category)}
                    >
                      <div className="forum-category-card__icon">
                        <img src={category.icon} alt={category.name} />
                      </div>
                      <div className="forum-category-card__content">
                        <h3 className="forum-category-card__name">
                          {category.name}
                        </h3>
                        <p className="forum-category-card__description">
                          {category.description}
                        </p>
                        <div className="forum-category-card__meta">
                          <span className="forum-category-card__id">
                            #{category.uniqueId}
                          </span>
                        </div>
                      </div>
                      <div className="forum-category-card__actions">
                        <MessageSquare size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="forum-topics-page__threads">
                  {(filteredData as Thread[]).map((thread) => (
                    <article
                      key={thread.id}
                      className="thread-card"
                      id={`thread-${thread.id}`}
                    >
                      <div className="thread-card__header">
                        <div className="thread-card__user">
                          <div className="thread-card__avatar">
                            {thread.user?.avatar ? (
                              <img
                                src={thread.user.avatar}
                                alt={thread.user.name}
                              />
                            ) : (
                              <User size={24} />
                            )}
                          </div>
                          <div className="thread-card__user-info">
                            <span className="thread-card__username">
                              {thread.user?.name || "Anonymous User"}
                            </span>
                            <span className="thread-card__timestamp">
                              <Calendar size={12} />
                              {formatTimeAgo(thread.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="thread-card__actions">
                          <button
                            className="thread-card__action"
                            onClick={() => openReplyModal(thread)}
                          >
                            <Reply size={16} />
                            Reply
                          </button>

                          <button
                            className="thread-card__action"
                            onClick={() => openQuoteModal(thread)}
                          >
                            <Quote size={16} />
                            Quote
                          </button>
                        </div>
                      </div>
                      {thread.quotedThread && (
                        <div
                          className="thread-card__quote"
                          style={{ cursor: "pointer" }}
                          onClick={() => scrollToThread(thread.quotedThread.id)}
                          title="Go to quoted message"
                        >
                          <div className="thread-card__quote-header">
                            <MessageSquare size={14} />
                            <span>Quote to:</span>
                          </div>
                          <p className="thread-card__quote-message">
                            {thread.quotedThread.message}
                          </p>
                        </div>
                      )}

                      <div className="thread-card__content">
                        {thread.images && thread.images.length > 0 && (
                          <div className="thread-card__images">
                            {thread.images.map((image, index) => (
                              <div key={index} className="thread-card__image">
                                <img
                                  src={image}
                                  alt={`Attachment ${index + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="thread-card__message">{thread.message}</p>
                      </div>

                      {thread.replies && thread.replies.length > 0 && (
                        <div className="thread-card__replies-toggle">
                          <button
                            onClick={() =>
                              setOpenReplies((prev) => ({
                                ...prev,
                                [thread.id]: !prev[thread.id],
                              }))
                            }
                            className="thread-card__action"
                          >
                            {openReplies[thread.id]
                              ? `Hide Replies (${thread.replies.length})`
                              : `Show Replies (${thread.replies.length})`}
                          </button>
                        </div>
                      )}

                      {/* Replies list */}
                      {openReplies[thread.id] &&
                        thread.replies &&
                        thread.replies.length > 0 && (
                          <div className="thread-card__replies-list">
                            {thread.replies.map((reply, idx) => (
                              <div
                                key={reply.id || idx}
                                className="thread-reply"
                              >
                                <div className="thread-reply__header">
                                  <div className="thread-reply__avatar">
                                    {reply.user?.avatar ? (
                                      <img
                                        src={reply.user.avatar}
                                        alt={reply.user.name}
                                      />
                                    ) : (
                                      <User size={20} />
                                    )}
                                  </div>
                                  <div className="thread-reply__user-info">
                                    <span className="thread-reply__user">
                                      {reply.user?.name || "Anonymous"}
                                    </span>
                                    <span className="thread-reply__timestamp">
                                      <Calendar size={12} />
                                      {formatTimeAgo(reply.createdAt)}
                                    </span>
                                  </div>
                                </div>

                                {reply.images && reply.images.length > 0 && (
                                  <div className="thread-reply__images">
                                    {reply.images.map((img, i) => (
                                      <div
                                        key={i}
                                        className="thread-reply__image"
                                      >
                                        <img
                                          src={img}
                                          alt={`Reply Attachment ${i + 1}`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="thread-reply__message">
                                  {reply.message}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      <div className="thread-card__footer">
                        <button className="thread-card__like-btn">
                          <Heart size={16} />
                          <span>{thread.likedCount} likes</span>
                        </button>
                        <span className="thread-card__thread-type">
                          {thread.threadType === "fresh"
                            ? "Original Post"
                            : "Reply"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="forum-topics-page__empty">
              <h2>
                {topicsData.kind === "categories"
                  ? "No subcategories found"
                  : "No threads yet"}
              </h2>
              <p>
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Be the first to start a discussion!"}
              </p>
            </div>
          )}
        </main>
        <div className="blurs_wrapper">
          <div className="blurs_object is-fluo"></div>
        </div>
      </div>
      <Modal open={modalOpen} onClose={closeModal} className="forum-modal">
        <Box sx={style}>
          <h2>
            {modalType === "reply" && "Reply to Message"}
            {modalType === "quote" && "Quote Message"}
            {modalType === "message" && "New Message"}
          </h2>
          {replyToThread && (
            <div className="forum-modal-quoted">
              <p>
                <b>Original:</b> {replyToThread.message}
              </p>
            </div>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            rows={5}
            style={{ width: "100%", marginBottom: 12 }}
          />
          {/* File upload input */}
          {/* <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading || sending}
            style={{ marginBottom: 12 }}
          />

          {selectedFiles.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <b>Selected files:</b>
              <ul>
                {selectedFiles.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )} */}
          <Box className="upload-container">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />

            {!preview ? (
              <Box className="upload-box" onClick={handleUploadClick}>
                <UploadCloud className="upload-icon" />
                <Typography>Click to upload image</Typography>
              </Box>
            ) : (
              <Box className="preview-container">
                <img src={preview} alt="Preview" className="preview-image" />
                <IconButton className="delete-btn" onClick={removeFile}>
                  <X />
                </IconButton>
              </Box>
            )}
          </Box>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button
              onClick={closeModal}
              disabled={sending}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              className="gradient-btn"
              onClick={() => {
                callMessgaesend();
              }}
              disabled={!message.trim() || sending}
            >
              Send
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ForumTopicsPage;
