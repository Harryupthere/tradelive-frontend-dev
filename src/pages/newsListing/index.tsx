import { Search } from "lucide-react";
import { Grid } from "@mui/material";
import NewsCards, { News } from "../../components/common/NewaCard";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { useEffect, useState, useRef } from "react";
import CardShimmer from "../../components/common/cardShimmer";
import NoData from "../../components/common/NoData";
import Pagination from "../../components/common/Pagination";

const NewsListing = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const debounceTimer = useRef<number | null>(null);
    const DEBOUNCE_MS = 500;

    const fetchNews = async (search = '', page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`${API_ENDPOINTS?.getNews}?search=${search}&page=${page}&limit=9`);
            if (response?.status) {
                const data = response?.data?.data?.data?.news;
                setNews(Array.isArray(data) ? data : []);
                console.log("Fetched news:", response?.data.data.data);
                const total = response?.data?.data?.data.total || 0;
                setTotalPages(Math.ceil(total / 9));
            }
        } catch (error) {
            console.log("Failed to fetch news", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews('', 1);
    }, []);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = window.setTimeout(() => {
            fetchNews(value.trim(), 1);
        }, DEBOUNCE_MS);
    };

    // optional immediate search when user clicks Search button
    const handleSearchNow = () => {
        setCurrentPage(1);
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        fetchNews(searchTerm.trim(), 1);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchNews(searchTerm, page);
    }
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
                            placeholder="Search news..."
                            className="search-bar__input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="search-bar__btn" onClick={handleSearchNow}>Search</button>
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
                        news?.length > 0 ?
                        news?.map((item) => (
                            <Grid size={{  md: 4, sm: 6 }} key={item.id}>
                                <NewsCards news={item} />
                            </Grid>
                        ))
                        :
                        <NoData />
                    }
                </Grid>
                {!loading && news.length > 0 && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            <div className="blurs_wrapper"><div className="blurs_object is-fluo"></div></div>
        </div>
    );
};

export default NewsListing;

