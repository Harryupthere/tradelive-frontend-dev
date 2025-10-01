import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, Users } from 'lucide-react';
import './ForumPage.scss';
import axios from "axios";
// import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;
const apiUrl = import.meta.env.VITE_API_URL;
interface ForumSubCategory {
  id: string;
  uniqueId: string;
  name: string;
  description: string;
  icon: string;
  keywords?: string[];
  viewCount?: number;
  createdBy?: string;
  createdAt?: string;
  staffCreated?: number;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdBy?: string;
  createdAt?: string;
  staffCreated?: number;
  forumCategories: ForumSubCategory[];
}

// Mock data matching your API response
const mockForumData: ForumCategory[] = [
  {
    "id": "1",
    "name": "Electronics",
    "description": "This forum category is dedicated to electronic items and their uses",
    "icon": "https://cdn-icons-png.flaticon.com/512/997/997500.png",
    "createdBy": "Admin",
    "createdAt": "2024-01-15T10:30:00Z",
    "staffCreated": 1,
    "forumCategories": [
      {
        "id": "4",
        "uniqueId": "nc4tb9nma1",
        "name": "iPhone",
        "description": "This forum category is dedicated to iPhone discussions and support",
        "icon": "https://cdn4.iconfinder.com/data/icons/smart-phones-technologies/512/iphone.png",
        "keywords": ["iPhone", "iOS", "Apple", "mobile", "smartphone"],
        "viewCount": 15420,
        "createdBy": "TechModerator",
        "createdAt": "2024-01-20T14:15:00Z",
        "staffCreated": 1
      },
      {
        "id": "3",
        "uniqueId": "xh6osi616a",
        "name": "Mac Services",
        "description": "This forum category is dedicated to Mac device services and troubleshooting",
        "icon": "https://cdn.imgbin.com/15/11/21/imgbin-remote-backup-service-computer-icons-apple-icon-format-mac-disk-icons-e24pMnwwFC1ip1HhXw6VH5fjy.jpg",
        "keywords": ["Mac", "macOS", "repair", "service", "troubleshooting"],
        "viewCount": 8930,
        "createdBy": "ServiceExpert",
        "createdAt": "2024-02-01T09:45:00Z",
        "staffCreated": 0
      }
    ]
  },
  {
    "id": "2",
    "name": "Software",
    "description": "Forum for software-related discussions and support",
    "icon": "https://cdn-icons-png.flaticon.com/512/2702/2702602.png",
    "createdBy": "SoftwareGuru",
    "createdAt": "2024-01-18T16:20:00Z",
    "staffCreated": 0,
    "forumCategories": [
      {
        "id": "5",
        "uniqueId": "sft123",
        "name": "Windows",
        "description": "Discussion about Windows OS, troubleshooting, and tips",
        "icon": "https://cdn-icons-png.flaticon.com/512/732/732225.png",
        "keywords": ["Windows", "Microsoft", "OS", "troubleshooting", "tips"],
        "viewCount": 22150,
        "createdBy": "WindowsExpert",
        "createdAt": "2024-01-25T11:30:00Z",
        "staffCreated": 1
      },
      {
        "id": "6",
        "uniqueId": "sft124",
        "name": "Linux",
        "description": "Linux distributions, commands, and system administration",
        "icon": "https://cdn-icons-png.flaticon.com/512/226/226772.png",
        "keywords": ["Linux", "Ubuntu", "terminal", "commands", "open-source"],
        "viewCount": 18760,
        "createdBy": "LinuxMaster",
        "createdAt": "2024-02-05T13:20:00Z",
        "staffCreated": 0
      }
    ]
  },
  {
    "id": "3",
    "name": "Gaming",
    "description": "Gaming discussions, reviews, and community",
    "icon": "https://cdn-icons-png.flaticon.com/512/686/686589.png",
    "createdBy": "GameModerator",
    "createdAt": "2024-01-22T12:00:00Z",
    "staffCreated": 1,
    "forumCategories": [
      {
        "id": "7",
        "uniqueId": "gm001",
        "name": "PC Gaming",
        "description": "PC games, hardware requirements, and performance optimization",
        "icon": "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
        "keywords": ["PC", "gaming", "hardware", "performance", "graphics"],
        "viewCount": 31240,
        "createdBy": "PCGamer",
        "createdAt": "2024-01-28T15:45:00Z",
        "staffCreated": 0
      },
      {
        "id": "8",
        "uniqueId": "gm002",
        "name": "Console Gaming",
        "description": "PlayStation, Xbox, Nintendo discussions and game reviews",
        "icon": "https://cdn-icons-png.flaticon.com/512/686/686681.png",
        "keywords": ["PlayStation", "Xbox", "Nintendo", "console", "games"],
        "viewCount": 27890,
        "createdBy": "ConsoleGuru",
        "createdAt": "2024-02-03T10:15:00Z",
        "staffCreated": 1
      }
    ]
  }
];

const ForumPage: React.FC = () => {
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaGFyc2guY2hvdWhhbjAxMEBnbWFpbC5jb20iLCJzdWJfaWQiOiIxIiwidHlwZSI6ImxvZ2luIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTkyNDkyMDUsImV4cCI6MTc1OTI1MjgwNX0._DxzvplUZYfNfkW2sanrKWYXbm9X0hNoBk5C8uYIKWw`;


  const [forumData, setForumData] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate API call
    const fetchForumData = async () => {
      setLoading(true);
    //   // Simulate network delay
    //   await new Promise(resolve => setTimeout(resolve, 1000));

      try {
      let res = await axios.get(`${apiUrl}forum-category-types`, {
        // headers: {
        //   Authorization: `Bearer ${token}`, // 👈 add bearer token
        // },
      });
    console.log(res.data.data.data.data)

    //   setForumData(mockForumData);
      setForumData(res.data.data.data.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }


    };

    fetchForumData();
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubCategoryClick = (subCategory: ForumSubCategory) => {
    // Placeholder for navigation to category topics
    console.log('Navigate to category:', subCategory.name);
    alert(`Navigate to ${subCategory.name} topics`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const filteredData = forumData.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.forumCategories.some(sub =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="forum-page">
        <div className="forum-page__container">
          <div className="forum-page__loading">
            <div className="forum-page__loading-spinner"></div>
            <p>Loading forum categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-page">
      <div className="forum-page__container">
        {/* Banner Section */}
        <section className="forum-page__banner">
          <h1 className="forum-page__banner-title">Community Forum</h1>
          <p className="forum-page__banner-description">
            Join our vibrant community to discuss, share knowledge, and get help from fellow members
          </p>
        </section>

        {/* Search Bar */}
        <section className="forum-page__search">
          <div className="forum-page__search-wrapper">
            <Search className="forum-page__search-icon" size={20} />
            <input
              type="text"
              placeholder="Search categories and topics..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="forum-page__search-input"
            />
            <button className="forum-page__search-btn">Search</button>
          </div>
        </section>

        {/* Forum Categories */}
        <main className="forum-page__main">
          {filteredData.length > 0 ? (
            <div className="forum-page__categories">
              {filteredData.map(category => (
                <div key={category.id} className="forum-category">
                  <div
                    className="forum-category__header"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="forum-category__header-content">
                      <div className="forum-category__icon">
                        <img src={category.icon} alt={category.name} />
                      </div>
                      <div className="forum-category__info">
                        <div className="forum-category__name-wrapper">
                          <h2 className="forum-category__name">{category.name}</h2>
                          {category.staffCreated === 1 && (
                            <span className="forum-category__staff-badge">Staff</span>
                          )}
                        </div>
                        <p className="forum-category__description">{category.description}</p>
                        <div className="forum-category__meta">
                            {/* {console.log(category.createdBy)} */}
                          {/* {category.createdBy && ( */}
                            <span className="forum-category__created-by">
                              Created by: <strong>{category.createdBy?category.createdBy.name:"Unknown"}</strong>
                            </span>
                          {/* )} */}
                          {category.createdAt && (
                            <span className="forum-category__created-at">
                              on {formatDate(category.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="forum-category__stats">
                        <span className="forum-category__subcategories">
                          {category.forumCategories.length} subcategories
                        </span>
                      </div>
                    </div>
                    <div className="forum-category__toggle">
                      {expandedCategories.has(category.id) ? (
                        <ChevronUp size={24} />
                      ) : (
                        <ChevronDown size={24} />
                      )}
                    </div>
                  </div>

                  <div
                    className={`forum-category__content ${
                      expandedCategories.has(category.id) ? 'forum-category__content--expanded' : ''
                    }`}
                  >
                    <div className="forum-category__subcategories">
                      {category.forumCategories.map(subCategory => (
                        <div
                          key={subCategory.id}
                          className="forum-subcategory"
                          onClick={() => handleSubCategoryClick(subCategory)}
                        >
                          <div className="forum-subcategory__icon">
                            <img src={subCategory.icon} alt={subCategory.name} />
                          </div>
                          <div className="forum-subcategory__content">
                            <div className="forum-subcategory__header">
                              <div className="forum-subcategory__name-wrapper">
                                <h3 className="forum-subcategory__name">{subCategory.name}</h3>
                                {subCategory.staffCreated === 1 && (
                                  <span className="forum-subcategory__staff-badge">Staff</span>
                                )}
                              </div>
                              <span className="forum-subcategory__unique-id">#{subCategory.uniqueId}</span>
                            </div>
                            <p className="forum-subcategory__description">{subCategory.description}</p>
                            {subCategory.keywords && subCategory.keywords.length > 0 && (
                              <div className="forum-subcategory__keywords">
                                {subCategory.keywords.slice(0, 3).map((keyword, index) => (
                                  <span key={index} className="forum-subcategory__keyword">
                                    {keyword}
                                  </span>
                                ))}
                                {subCategory.keywords.length > 3 && (
                                  <span className="forum-subcategory__keyword-more">
                                    +{subCategory.keywords.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="forum-subcategory__meta">
                              {/* {subCategory.createdBy && ( */}
                                <span className="forum-subcategory__created-by">
                                  By: <strong>{subCategory.createdBy?subCategory.createdBy.name:"Unknown"}</strong>
                                </span>
                              {/* )} */}
                              {subCategory.createdAt && (
                                <span className="forum-subcategory__created-at">
                                  {formatDate(subCategory.createdAt)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="forum-subcategory__stats">
                            {subCategory.viewCount !== undefined && (
                              <div className="forum-subcategory__stat">
                                <Users size={16} />
                                <span>{formatViewCount(subCategory.viewCount)} views</span>
                              </div>
                            )}
                            <div className="forum-subcategory__stat">
                              <MessageSquare size={16} />
                              <span>Topics</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="forum-page__empty">
              <h2>No categories found</h2>
              <p>Try adjusting your search terms</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ForumPage;