import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MessageCircle, User, Smile, Paperclip, MoreVertical } from 'lucide-react';
import './ChatDiscussion.scss';

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
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample messages data
  const sampleMessages: Message[] = [
    {
      id: '1',
      user_id: '101',
      user_name: 'John Smith',
      profile_image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'Hey everyone! Just finished the advanced trading course. Really helpful insights on risk management.',
      timestamp: '2025-01-15T10:30:00Z',
      is_own: false
    },
    {
      id: '2',
      user_id: '102',
      user_name: 'Sarah Johnson',
      profile_image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'That course is amazing! The section on portfolio diversification changed my whole approach.',
      timestamp: '2025-01-15T10:32:00Z',
      is_own: false
    },
    {
      id: '3',
      user_id: '103',
      user_name: 'You',
      profile_image: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'I agree! The practical examples really helped me understand the concepts better.',
      timestamp: '2025-01-15T10:35:00Z',
      is_own: true
    },
    {
      id: '4',
      user_id: '104',
      user_name: 'Michael Chen',
      profile_image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'Has anyone tried implementing the strategies from the technical analysis module?',
      timestamp: '2025-01-15T10:40:00Z',
      is_own: false
    },
    {
      id: '5',
      user_id: '105',
      user_name: 'Emily Davis',
      profile_image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'Yes! I started using the moving average crossover strategy and it\'s working well so far.',
      timestamp: '2025-01-15T10:42:00Z',
      is_own: false
    },
    {
      id: '6',
      user_id: '103',
      user_name: 'You',
      profile_image: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: 'That\'s great to hear! I\'m still working through the options trading section.',
      timestamp: '2025-01-15T10:45:00Z',
      is_own: true
    }
  ];

  useEffect(() => {
    // Simulate loading messages
    const timer = setTimeout(() => {
      setMessages(sampleMessages);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user_id: '103',
      user_name: 'You',
      profile_image: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      is_own: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate typing indicator for other users
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
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
            {/* <div className="chat-discussion__logo">
              <div className="chat-discussion__logo-icon">
                <MessageCircle size={24} />
              </div>
              <span className="chat-discussion__logo-text">FINGRAD</span>
            </div> */}
            <div className="chat-discussion__chat-info">
              <h1 className="chat-discussion__title">Chat & Discussion</h1>
              <p className="chat-discussion__subtitle">Community Trading Discussion</p>
            </div>
          </div>
{/* 
          <button className="chat-discussion__menu-btn">
            <MoreVertical size={20} />
          </button> */}
        </div>

        {/* Chat Container */}
        <div className="chat-discussion__chat-container">
          {/* Messages Area */}
          <div className="chat-discussion__messages">
            <div className="chat-discussion__messages-list">
              {messages.map((message, index) => {
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
                
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="chat-discussion__date-separator">
                        <span>{formatDate(message.timestamp)}</span>
                      </div>
                    )}
                    
                    <div className={`chat-discussion__message ${message.is_own ? 'chat-discussion__message--own' : 'chat-discussion__message--other'}`}>
                      {!message.is_own && (
                        <div className="chat-discussion__message-avatar">
                          <img 
                            src={message.profile_image} 
                            alt={message.user_name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('chat-discussion__avatar-fallback--hidden');
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
                            <span className="chat-discussion__message-name">{message.user_name}</span>
                          </div>
                        )}
                        
                        <div className="chat-discussion__message-bubble">
                          <p className="chat-discussion__message-text">{message.message}</p>
                        </div>
                        
                        <div className="chat-discussion__message-time">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>

                      {message.is_own && (
                        <div className="chat-discussion__message-avatar">
                          <img 
                            src={message.profile_image} 
                            alt={message.user_name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('chat-discussion__avatar-fallback--hidden');
                            }}
                          />
                          <div className="chat-discussion__avatar-fallback chat-discussion__avatar-fallback--hidden">
                            <User size={20} />
                          </div>
                        </div>
                      )}
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
            <form onSubmit={handleSendMessage} className="chat-discussion__input-form">
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