import { Search } from "lucide-react";
import { Grid } from "@mui/material";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { useEffect, useState, useRef } from "react";
import CardShimmer from "../../components/common/cardShimmer";
import NoData from "../../components/common/NoData";
import PlatformCard, { Platformc } from "../../components/common/PlatformCard";
import PlatformProductCard, {
  ProductPlatformI,
} from "../../components/common/ProductPlatformCard";
import { getUser } from "../../utils/tokenUtils";
import { useNavigate } from "react-router-dom";
const base = import.meta.env.VITE_BASE;

const Platform = () => {

    const { courses_allowance } = getUser();
        const navigate = useNavigate();
        if(courses_allowance === 0){
          navigate(`${base}dashboard`);
        }
  const [platforms, setPlatform] = useState<Platformc[]>([]);
  const [platformsProduct, setPlatformProduct] = useState<ProductPlatformI[]>(
    [],
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [limits, setLimits] = useState<number>(10);
  const debounceTimer = useRef<number | null>(null);
  const DEBOUNCE_MS = 500;

  const fetchPlatform = async (search = "", page = 1, limit = 10) => {
    setLoading(true);
    try {
      // Backend API disabled for now (no platforms yet), showing placeholder image only.
      // const response = await api.get(`${API_ENDPOINTS?.platforms}?page=${page}&limit=${limit}&search=${search}`);
      // if (response?.status) {
      //     const data = response?.data?.data?.data;
      //     setPlatform(Array.isArray(data) ? data : []);
      // }
      setPlatform([]);
      // Backend API disabled for now (no platforms yet), showing placeholder image only.
      const response1 = await api.get(
        `${API_ENDPOINTS?.productPlatform}?page=${page}&limit=${limit}&search=${search}`,
      );
      console.log("Product Platform response", response1);
      if (response1?.status) {
        const data = response1?.data?.data?.data;
        setPlatformProduct(Array.isArray(data) ? data : []);
      }
      setPlatform([]);
    } catch (error) {
      console.log("Failed to fetch platforms", error);
      setPlatform([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Disabled backend call for now, just render default placeholder image while admin content is absent.
    fetchPlatform("");
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
      fetchPlatform(value.trim());
    }, DEBOUNCE_MS);
  };

  // optional immediate search when user clicks Search button
  const handleSearchNow = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    fetchPlatform(searchTerm.trim());
  };
  return (
    <div className="course-listing-page">
      <div className="gradient-title" style={{ textAlign: "center" }}>
        <p>Platform Catalog</p>
      </div>
      <div className="search-bar">
        <div className="search-bar__wrapper">
          <Search className="search-bar__icon" size={20} />
          <input
            type="text"
            placeholder="Search platforms..."
            className="search-bar__input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="search-bar__btn" onClick={handleSearchNow}>
            Search
          </button>
        </div>
      </div>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(4)).map((_, index) => (
            <Grid size={{ md: 4, sm: 6 }} key={index}>
              <CardShimmer />
            </Grid>
          ))
        ) : platforms?.length > 0 ? (
          platforms?.map((item) => (
            <Grid size={{ md: 4, sm: 6 }} key={item.id}>
              <PlatformCard resource={item} />
            </Grid>
          ))
        ) : (
          <>
           
            <>
              {platformsProduct?.length > 0 &&
                platformsProduct?.map((item) => (
                  <Grid size={{ md: 4, sm: 6 }} key={item.id}>
                    <PlatformProductCard course={item} />
                  </Grid>
                ))}
            </>
          </>
        )}
      </Grid>
      <div className="blurs_wrapper">
        <div className="blurs_object is-fluo"></div>
      </div>
    </div>
  );
};

export default Platform;
