import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  User,
  Smile,
  Paperclip,
  MoreVertical,
} from "lucide-react";
import "./ChatDiscussion.scss";
import { io, Socket } from "socket.io-client";
import { getUser } from "../../utils/tokenUtils";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
const apiUrl = import.meta.env.VITE_WS_URL;
interface Message {
  id: string;
  user_id: string;
  user_name: string;
  profile_image: string;
  message: string;
  timestamp: string;
  is_own: boolean;
}
const ChatDiscussion: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const user = getUser() || { id: null };

  // Sample messages data
  const sampleMessages: Message[] = [
    //  {
    //   id: '1',
    //   user_id: '101',
    //   user_name: 'John Smith',
    //   profile_image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    //   message: 'Hey everyone! Just finished the advanced trading course. Really helpful insights on risk management.',
    //   timestamp: '2025-01-15T10:30:00Z',
    //   is_own: false
    // },
  ];

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setMessages(sampleMessages);
  //     setIsLoading(false);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect to your NestJS WebSocket Gateway
    socketRef.current = io(apiUrl, {
      transports: ["websocket"],
    });

    // Join the chat room (room_id = 1)
    socketRef.current.emit("joinRoom", { roomId: 1 });

    socketRef.current.on("joinedRoom", () => {
      console.log("Joined room 1");
    });

    // Listen for new messages
    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          user_id: msg.sender?.id || "admin",
          user_name:
            msg.sender_type === "admin" ? "Admin" : msg.sender.first_name,
          profile_image:
            msg.sender_type === "admin"
              ? "https://cdn-icons-png.flaticon.com/512/2206/2206368.png"
              : msg.sender?.profile || "",
          message: msg.message,
          timestamp: msg.created_at,
          is_own: msg.sender?.id === user.id,
        },
      ]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketRef.current?.emit("sendMessage", {
      roomId: 1,
      senderId: user.id,
      senderType: "user",
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  useEffect(() => {
    async function loadMessages() {
      const resposne = await api.get(API_ENDPOINTS.chatMessages);
      let data = [];
      if (resposne.data.status) {
        data = resposne.data.data;
      }
      const formatted = data.map((msg: any) => ({
        id: msg.id,
        user_id: msg.sender?.id || "admin",
        user_name:
          msg.sender_type === "admin" ? "Admin" : msg.sender.first_name,
        profile_image:
          msg.sender_type === "admin"
            ? "https://cdn-icons-png.flaticon.com/512/2206/2206368.png"
            : msg.sender?.profile || "",
        message: msg.message,
        timestamp: msg.created_at,
        is_own: msg.sender?.id === user.id,
      }));

      setMessages(formatted);
      setIsLoading(false);
    }

    loadMessages();
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="chat-discussion">
        <div className="chat-discussion__container">
          <div className="chat-discussion__loading">
            <div className="chat-discussion__spinner"></div>
            <p>Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-discussion">
      <div className="chat-discussion__container">
        {/* Header */}
        <div className="chat-discussion__header">
          <div className="chat-discussion__header-info">
            <div className="chat-discussion__chat-info">
              <h1 className="chat-discussion__title">Chat & Discussion</h1>
              <p className="chat-discussion__subtitle">
                Community Trading Discussion
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-discussion__chat-container">
          {/* Messages Area */}
          <div className="chat-discussion__messages">
            <div className="chat-discussion__messages-list">
              {messages.map((message, index) => {
                const showDate =
                  index === 0 ||
                  formatDate(messages[index - 1].timestamp) !==
                    formatDate(message.timestamp);

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="chat-discussion__date-separator">
                        <span>{formatDate(message.timestamp)}</span>
                      </div>
                    )}

                    <div
                      className={`chat-discussion__message ${
                        message.is_own
                          ? "chat-discussion__message--own"
                          : "chat-discussion__message--other"
                      }`}
                    >
                      {!message.is_own && (
                        <div className="chat-discussion__message-avatar">
                          <img
                            src={message.profile_image}
                            alt={message.user_name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "chat-discussion__avatar-fallback--hidden"
                              );
                            }}
                          />
                          <div className="chat-discussion__avatar-fallback chat-discussion__avatar-fallback--hidden">
                            <User size={20} />
                          </div>
                        </div>
                      )}

                      <div className="chat-discussion__message-content">
                        {!message.is_own && (
                          <div className="chat-discussion__message-header">
                            <span className="chat-discussion__message-name">
                              {message.user_name}
                            </span>
                          </div>
                        )}

                        <div className="chat-discussion__message-bubble">
                          <p className="chat-discussion__message-text">
                            {message.message}
                          </p>
                        </div>

                        <div className="chat-discussion__message-time">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="chat-discussion__typing-indicator">
                  <div className="chat-discussion__typing-avatar">
                    <User size={16} />
                  </div>
                  <div className="chat-discussion__typing-bubble">
                    <div className="chat-discussion__typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="chat-discussion__input-container">
            <form
              onSubmit={handleSendMessage}
              className="chat-discussion__input-form"
            >
              <div className="chat-discussion__input-wrapper">
                {/* <button type="button" className="chat-discussion__attachment-btn">
                  <Paperclip size={20} />
                </button> */}

                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="chat-discussion__message-input"
                />

                {/* <button type="button" className="chat-discussion__emoji-btn">
                  <Smile size={20} />
                </button> */}

                <button
                  type="submit"
                  className="chat-discussion__send-btn"
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDiscussion;
