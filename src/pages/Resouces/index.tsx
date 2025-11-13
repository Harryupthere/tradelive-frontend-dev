import { Search } from "lucide-react";
import { Grid } from "@mui/material";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { useEffect, useState, useRef } from "react";
import CardShimmer from "../../components/common/cardShimmer";
import NoData from "../../components/common/NoData";
import ResourceCard, { Resource } from "../../components/common/ResourceCard";

const Resources = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [pageNumber,setPageNumber] = useState<number>(1);
    const [limits,setLimits] = useState<number>(10);
    const debounceTimer = useRef<number | null>(null);
    const DEBOUNCE_MS = 500;

    const fetchResources = async (search = '',page=1,limit=10) => {
        setLoading(true);
        try {
            const response = await api.get(`${API_ENDPOINTS?.resources}?page=${page}&limit=${limit}&search=${search}`);
            if (response?.status) {
                const data = response?.data?.data?.data;
                setResources(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.log("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources('');
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
            fetchResources(value.trim());
        }, DEBOUNCE_MS);
    };

    // optional immediate search when user clicks Search button
    const handleSearchNow = () => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        fetchResources(searchTerm.trim());
    }
    return (
        <div className="course-listing-page">
                <div className="gradient-title" style={{ textAlign: 'center' }}>
                    <p>Resources Catalog</p>
                </div>
                <div className="search-bar">
                    <div className="search-bar__wrapper">
                        <Search className="search-bar__icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search resources..."
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
                        resources?.length > 0 ?
                        resources?.map((item) => (
                            <Grid size={{  md: 4, sm: 6 }} key={item.id}>
                                <ResourceCard resource={item} />
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

export default Resources;

