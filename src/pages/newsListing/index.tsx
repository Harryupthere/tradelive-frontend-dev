import { Search } from "lucide-react";
import { Container, Grid } from "@mui/material";
import NewsCards, { News } from "../../components/common/NewaCard";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { useEffect, useState } from "react";
import CardShimmer from "../../components/common/cardShimmer";

const NewsListing = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(false); 
    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await api.get(`${API_ENDPOINTS?.getNews}`);
            if (response?.status) {
                const data = response?.data?.data?.data?.news;
                setNews(data)
            }
        } catch (error) {
            console.log("Failed to fetch news",error);
        }
    finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews()
    }, []);

    return (
        <div className="course-listing-page">
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
                    {loading
                        ? Array.from(new Array(4)).map((_, index) => (
                            <Grid  size={{ md: 4, sm: 6 }}  key={index}>
                                <CardShimmer />
                            </Grid>
                        ))
                        :
                        news?.map((item) => (
                        <Grid size={{  md: 4, sm: 6 }} key={item.id}>
                            <NewsCards news={item} />
                        </Grid>
                    ))}
                </Grid>
            <div className="blurs_wrapper"><div className="blurs_object is-fluo"></div></div>
        </div>
    );
};

export default NewsListing;
