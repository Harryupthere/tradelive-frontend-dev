import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  Send,
  Bot,
  User,
  Image as ImageIcon,
} from "lucide-react";
import "./AIChatAssistant.scss";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;

interface ChatMessage {
  id: number;
  image_url?: string;
  question: string;
  answer?: string;
  created_at: string;
  isUser: boolean;
  isLoading?: boolean;
}

const AIChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [aiPlan,setAiPlan]=useState<boolean>(false);
  const [dailyUsage,setDailyUsage]=useState<number>(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const navigate = useNavigate();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock API - Fetch chat history
  const fetchChatHistory = async (): Promise<ChatMessage[]> => {
    return new Promise(async (resolve) => {
      const historyData = await api.get(API_ENDPOINTS.aiChatHistory);
      if(historyData.data.data.ai_plan===0){
        setAiPlan(false);
      }else{
        setAiPlan(true);
      }
      setDailyUsage(historyData.data.data.today_count);
      resolve(historyData.data.data.history);
    });
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check and show upgrade modal
  useEffect(() => {
    if (!aiPlan && dailyUsage === 1) {
      setShowUpgradeModal(true);
    }
  }, [aiPlan, dailyUsage]);

  const loadChatHistory = async () => {
    try {
      const history = await fetchChatHistory();
      // Convert history to chat format
      const chatMessages: ChatMessage[] = [];

      history.forEach((item) => {
        // Add user question
        chatMessages.push({
          id: item.id * 2 - 1,
          question: item.question,
          created_at: item.created_at,
          isUser: true,
          image_url: item.image_url,
        });

        // Add AI response
        if (item.answer) {
          chatMessages.push({
            id: item.id * 2,
            question: "",
            answer: item.answer,
            created_at: item.created_at,
            isUser: false,
          });
        }
      });

      setMessages(chatMessages);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // ✅ allow re-selecting same file later
    e.target.value = "";
  };

  const uploadFileToS3 = async (file: File) => {
    try {
      const res = await api.post(API_ENDPOINTS.uploadRequest, {
        filename: file.name,
        fileType: file.type,
      });
      const { uploadUrl, fileUrl } = res?.data.data || {};
      if (!uploadUrl || !fileUrl) throw new Error("Invalid upload response");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !selectedImage || isLoading) return;
     if (!aiPlan && dailyUsage === 1) {
      setShowUpgradeModal(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      question: newQuestion,
      created_at: new Date().toISOString(),
      isUser: true,
      image_url: imagePreview || undefined,
    };
    const loadingMessage: ChatMessage = {
      id: Date.now() + 1,
      question: "",
      created_at: new Date().toISOString(),
      isUser: false,
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    setIsLoading(true);

    const questionText = newQuestion;
    setNewQuestion("");
    setSelectedImage(null);
    setImagePreview("");

    try {
      const imageUrl = selectedImage
        ? await uploadFileToS3(selectedImage)
        : null;

      await api.post(API_ENDPOINTS.aiSubmitQuery, {
        question: questionText,
        image_url: imageUrl,
      });

      // ✅ Always refresh history from backend
      await loadChatHistory();
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // ✅ CRITICAL
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isInitialLoading) {
    return (
      <div className="ai-chat">
        <div className="ai-chat__container">
          <div className="ai-chat__loading">
            <div className="ai-chat__spinner"></div>
            <p>Loading AI Assistant...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-chat">
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="ai-chat__upgrade-modal-overlay">
          <div className="ai-chat__upgrade-modal">
            <div className="ai-chat__upgrade-modal-content">
              <div className="ai-chat__upgrade-modal-icon">💎</div>
              <h2 className="ai-chat__upgrade-modal-title">Upgrade to Premium</h2>
              <p className="ai-chat__upgrade-modal-subtitle">
                You've reached your daily AI Chat limit
              </p>
              <p className="ai-chat__upgrade-modal-description">
                Unlock unlimited access to the AI Chart Assistant with our Premium Plan. Get advanced analysis, unlimited queries, and priority support.
              </p>
              <div className="ai-chat__upgrade-modal-price">
                <span className="ai-chat__upgrade-modal-amount">$10</span>
                <span className="ai-chat__upgrade-modal-period">/month</span>
              </div>
              <div className="ai-chat__upgrade-modal-features">
                <div className="ai-chat__upgrade-modal-feature">
                  <span className="ai-chat__upgrade-modal-check">✓</span>
                  Unlimited daily queries
                </div>
                <div className="ai-chat__upgrade-modal-feature">
                  <span className="ai-chat__upgrade-modal-check">✓</span>
                  Advanced chart analysis
                </div>
                <div className="ai-chat__upgrade-modal-feature">
                  <span className="ai-chat__upgrade-modal-check">✓</span>
                  Priority support
                </div>
              </div>
              <div className="ai-chat__upgrade-modal-actions">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="ai-chat__upgrade-modal-cancel"
                >
                  Maybe Later
                </button>
                <button className="ai-chat__upgrade-modal-upgrade"
                  onClick={() => navigate(`${base}checkout?aiPlan=true`)}
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ai-chat__container">
        {/* Header */}
        <div className="ai-chat__header">
          <div className="ai-chat__header-info">
            <div className="ai-chat__logo">
              <div className="ai-chat__logo-icon">
                <Bot size={24} />
              </div>
              <span className="ai-chat__logo-text">Tradelive24</span>
            </div>
            <div className="ai-chat__title-section">
              <h1 className="ai-chat__title">Via AI Chart Assistant</h1>
              <p className="ai-chat__subtitle">
                Upload a chart and ask educational trading questions
              </p>
            </div>
          </div>
          
          {/* Plan Status and Daily Usage */}
          <div className="ai-chat__header-stats">
            {aiPlan && (
              <div className="ai-chat__plan-badge">
                <span className="ai-chat__plan-badge-icon">⭐</span>
                <span className="ai-chat__plan-badge-text">Premium</span>
              </div>
            )}
            <div className="ai-chat__daily-usage">
              <span className="ai-chat__usage-label">Daily Usage:</span>
              <span className="ai-chat__usage-count">{dailyUsage}</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="ai-chat__messages">
          <div className="ai-chat__messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-chat__message ${message.isUser ? "ai-chat__message--user" : "ai-chat__message--ai"}`}
              >
                <div className="ai-chat__message-avatar">
                  {message.isUser ? (
                    <div className="ai-chat__avatar ai-chat__avatar--user">
                      <User size={20} />
                    </div>
                  ) : (
                    <div className="ai-chat__avatar ai-chat__avatar--ai">
                      <Bot size={20} />
                    </div>
                  )}
                </div>

                <div className="ai-chat__message-content">
                  {message.isUser ? (
                    <div className="ai-chat__user-message">
                      {message.image_url && (
                        <div className="ai-chat__image-preview">
                          <img src={message.image_url} alt="Trading chart" />
                        </div>
                      )}
                      <div className="ai-chat__message-bubble ai-chat__message-bubble--user">
                        <p>{message.question}</p>
                      </div>
                      <div className="ai-chat__message-time">
                        {formatTime(message.created_at)}
                      </div>
                    </div>
                  ) : (
                    <div className="ai-chat__ai-message">
                      <div className="ai-chat__message-bubble ai-chat__message-bubble--ai">
                        {message.isLoading ? (
                          <div className="ai-chat__typing-indicator">
                            <div className="ai-chat__typing-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                            <span className="ai-chat__typing-text">
                              {/* AI is analyzing...  */}
                              Via is Analyzing...
                            </span>
                          </div>
                        ) : (
                          //   <p>{message.answer}</p>
                          <div className="ai-chat__markdown">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.answer}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      {!message.isLoading && (
                        <div className="ai-chat__message-time">
                          {formatTime(message.created_at)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Section */}
        <div className="ai-chat__input-container">
          {imagePreview && (
            <div className="ai-chat__image-preview-container">
              <div className="ai-chat__image-preview">
                <img src={imagePreview} alt="Selected chart" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="ai-chat__remove-image"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="ai-chat__input-form">
            <div className="ai-chat__input-wrapper">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="ai-chat__upload-btn"
                disabled={isLoading}
              >
                <Upload size={20} />
              </button>

              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask about chart patterns, trends, or trading strategies..."
                className="ai-chat__message-input"
                rows={1}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />

              <button
                type="submit"
                className="ai-chat__send-btn"
                disabled={!newQuestion.trim() || !selectedImage || isLoading}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatAssistant;
