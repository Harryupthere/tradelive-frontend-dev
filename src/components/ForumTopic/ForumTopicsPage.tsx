import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  MessageSquare,
  Heart,
  Reply,
  User,
  Calendar,
  Image as ImageIcon,
  Quote
} from "lucide-react";
import "./ForumTopicsPage.scss";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;

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

  const [topicsData, setTopicsData] = useState<ForumTopicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [forumName, setForumName] = useState("");

  // ...existing code...
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
  };
  // ...existing code...

  useEffect(() => {
    const fetchTopicsData = async () => {
      if (!forumId) return;

      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${apiUrl}threads?forumId=${forumId}`);
        const data = response.data.data;
        //console.log(data)
        setTopicsData(data);

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

    fetchTopicsData();
  }, [forumId]);

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
        <section className="forum-topics-page__search">
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
        </section>
        {topicsData.kind === "threads" && (
          <div className="thread-top__actions">
            <button
              className="thread-top__action"
              onClick={openMessageModal}
            >
              <MessageSquare size={18} /> New Message
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
                    <article key={thread.id} className="thread-card">
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
                          <button className="thread-card__action">
                            <Reply size={16} />
                            Reply
                          </button>

                          <button className="thread-card__action">
                            <Quote size={16} />
                            Quote
                          </button>
                        </div>
                        
                      </div>

                      {thread.quotedThread && (
                        <div className="thread-card__quote">
                          <div className="thread-card__quote-header">
                            <MessageSquare size={14} />
                            <span>Replying to:</span>
                          </div>
                          <p className="thread-card__quote-message">
                            {thread.quotedThread.message}
                          </p>
                        </div>
                      )}

                      <div className="thread-card__content">
                        <p className="thread-card__message">{thread.message}</p>

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
                      </div>

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
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="forum-modal"
        overlayClassName="forum-modal-overlay"
      >
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
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={closeModal} disabled={sending}>
            Cancel
          </button>
          <button
            onClick={async () => {
              setSending(true);
              try {
                await axios.post(`${apiUrl}threads`, {
                  forumCategoryId: forumId,
                  parentThreadId:
                    modalType === "message" ? null : replyToThread?.id,
                  images: [], // Add image upload logic if needed
                  threadType: modalType === "message" ? "fresh" : modalType,
                  message,
                });
                closeModal();
                // Optionally, refresh the thread list here
              } catch (err) {
                alert("Failed to send message");
              }
              setSending(false);
            }}
            disabled={!message.trim() || sending}
          >
            Send
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ForumTopicsPage;
