import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(undefined);
  const [shows, setShows] = useState([]);
  const [favouriteMovies, setFavouriteMovies] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const token = await getToken();
      console.log("Admin Token:", token);

      const { data } = await axios.get("/api/admin/isadmin", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error("fetchIsAdmin Error:", error);
      setIsAdmin(false);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("fetchShows Error:", error);
    }
  };

  const fetchFavouriteMovies = async () => {
    try {
      const token = await getToken();
      console.log("Fav Token:", token);

      const { data } = await axios.get("/api/user/favourites", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setFavouriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("fetchFavouriteMovies Error:", error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavouriteMovies();
    } else {
      setIsAdmin(undefined);
      setFavouriteMovies([]);
    }
  }, [user]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favouriteMovies,
    fetchFavouriteMovies
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
