import { Search } from "lucide-react";
import { Grid } from "@mui/material";
import NewsCards, { News } from "../../components/common/NewaCard";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { useEffect, useState, useRef } from "react";
import CardShimmer from "../../components/common/cardShimmer";
import NoData from "../../components/common/NoData";

const NewsListing = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const debounceTimer = useRef<number | null>(null);
    const DEBOUNCE_MS = 500;

    const fetchNews = async (search = '') => {
        setLoading(true);
        try {
            const response = await api.get(`${API_ENDPOINTS?.getNews}?search=${search}`);
            if (response?.status) {
                const data = response?.data?.data?.data?.news;
                setNews(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.log("Failed to fetch news", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews('');
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
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = window.setTimeout(() => {
            fetchNews(value.trim());
        }, DEBOUNCE_MS);
    };

    // optional immediate search when user clicks Search button
    const handleSearchNow = () => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        fetchNews(searchTerm.trim());
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
            <div className="blurs_wrapper"><div className="blurs_object is-fluo"></div></div>
        </div>
    );
};

export default NewsListing;


// import { useState, useEffect, useRef, useCallback } from "react";
// import { Grid } from "@mui/material";
// import { Search } from "lucide-react";

// import NewsCards, { News } from "../../components/common/NewaCard";
// import CardShimmer from "../../components/common/cardShimmer";
// import NoData from "../../components/common/NoData";
// import { api } from "../../api/Service";
// import { API_ENDPOINTS } from "../../constants/ApiEndPoints";

// const NewsListing = () => {
//   const [news, setNews] = useState<News[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const DEBOUNCE_MS = 500;

//   // ✅ fetch function wrapped in useCallback for stability
//   const fetchNews = useCallback(async (search = "") => {
//     setLoading(true);
//     try {
//       const response = await api.get(`${API_ENDPOINTS.getNews}?search=${search}`);
//       if (response?.status) {
//         const data = response?.data?.data?.data?.news || [];
//         setNews(Array.isArray(data) ? data : []);
//       } else {
//         setNews([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch news:", error);
//       setNews([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ✅ Initial fetch on mount
//   useEffect(() => {
//     fetchNews("");
//   }, [fetchNews]);

//   // ✅ Cleanup debounce timer on unmount
//   useEffect(() => {
//     return () => {
//       if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//       }
//     };
//   }, []);

//   // ✅ Debounced search handler
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (debounceTimer.current) {
//       clearTimeout(debounceTimer.current);
//     }

//     debounceTimer.current = setTimeout(() => {
//       fetchNews(value.trim());
//     }, DEBOUNCE_MS);
//   };

//   // ✅ Immediate search when clicking button
//   const handleSearchNow = () => {
//     if (debounceTimer.current) {
//       clearTimeout(debounceTimer.current);
//     }
//     fetchNews(searchTerm.trim());
//   };

//   return (
//     <div className="course-listing-page">
//       <div className="gradient-title" style={{ textAlign: "center" }}>
//         <p>News Catalog</p>
//       </div>

//       {/* 🔍 Search Bar */}
//       <div className="search-bar">
//         <div className="search-bar__wrapper">
//           <Search className="search-bar__icon" size={20} />
//           <input
//             type="text"
//             placeholder="Search news..."
//             className="search-bar__input"
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//           <button
//             className="search-bar__btn"
//             onClick={handleSearchNow}
//             disabled={loading}
//           >
//             {loading ? "Searching..." : "Search"}
//           </button>
//         </div>
//       </div>

//       {/* 📰 News Cards */}
//       <Grid container spacing={3}>
//         {loading ? (
//           Array.from(new Array(4)).map((_, index) => (
//             <Grid item md={4} sm={6} key={index}>
//               <CardShimmer />
//             </Grid>
//           ))
//         ) : news?.length > 0 ? (
//           news.map((item) => (
//             <Grid item md={4} sm={6} key={item.id}>
//               <NewsCards news={item} />
//             </Grid>
//           ))
//         ) : (
//           <NoData />
//         )}
//       </Grid>

//       <div className="blurs_wrapper">
//         <div className="blurs_object is-fluo"></div>
//       </div>
//     </div>
//   );
// };

// export default NewsListing;
