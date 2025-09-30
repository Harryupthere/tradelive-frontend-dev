import { Search } from "lucide-react";
import { Container, Grid } from "@mui/material";
import NewsCards, { News } from "../../components/common/NewaCard";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { useEffect } from "react";
// http://16.16.127.61/api/v1/
const NewsListing = () => {
    const news: News[] = [
        { id: 1, title: "Trade Live Class", date: "20-20-2025", image: "thumb1.jpg" },
        { id: 2, title: "Stock Market Basics", date: "20-20-2025", image: "thumb2.jpg" },
        { id: 3, title: "Crypto Fundamentals", date: "20-20-2025", image: "thumb3.jpg" },
        { id: 4, title: "Options Trading Mastery", date: "20-20-2025", image: "thumb4.jpg" },
        { id: 1, title: "Trade Live Class", date: "20-20-2025", image: "thumb5.jpg" },
        { id: 2, title: "Stock Market Basics", date: "20-20-2025", image: "thumb6.jpg" },
        { id: 3, title: "Crypto Fundamentals", date: "20-20-2025", image: "thumb7.jpg" },
        { id: 4, title: "Options Trading Mastery", date: "20-20-2025", image: "thumb8.jpg" },
    ];
    const fetchNews = async () => {
        try {
            const response = await api.get(`${API_ENDPOINTS?.getNews}`);
            console.log("Users:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    };
        useEffect(() => {
           fetchNews()
    }, []);
    return (
        <div className="course-listing-page">
            <Container>
                <div className="gradient-title" style={{ textAlign: 'center' }}>
                    <p>News Catalog</p>
                </div>
                <div className="search-bar">
                    <div className="search-bar__wrapper">
                        <Search className="search-bar__icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="search-bar__input"
                        />
                        <button className="search-bar__btn">Search</button>
                    </div>
                </div>

                <Grid container spacing={3}>
                    {news.map((item) => (
                        <Grid size={{ lg: 3, md: 4, sm: 6 }} key={item.id}>
                            <NewsCards news={item} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <div className="blurs_wrapper"><div className="blurs_object is-fluo"></div></div>
        </div>
    );
};

export default NewsListing;
