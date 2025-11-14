import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useContext,
} from "react";
import useAxiosSecure from "../hooks/useAxiosSecure.jsx";
import useAxios from "../hooks/useAxios.jsx";
import { Auth_Context } from "./AuthContext.jsx";
import food_image from "../lib/food_image.js";
export const Data_Context = createContext();

export async function fetchWithRetry(apiCall, retries = 7, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (err) {
      if (i === retries - 1) throw err; // last retry — throw error
      await new Promise((res) => setTimeout(res, delay)); // wait before retry
      console.log(`Retrying... (${i + 1})`);
    }
  }
}

function DataContext({ children }) {
  let { user, loading } = useContext(Auth_Context);

  const axiosInstance = useAxios();
  const axiosSecureInstance = useAxiosSecure();

  const [usersFeedback, setUsersFeedback] = useState([]);
  const [topReviewers, setTopReviewers] = useState([]);
  const [limitedReviewsData, setLimitedReviewsData] = useState([]);
  const [myFavoriteReviews, setMyFavoriteReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [foodie, setFoodie] = useState(food_image);

  const [loader, setLoader] = useState(true);

  const HomeDataFetching = useCallback(async () => {
    try {
      setLoader(true);

      // Retry 3 times if backend is waking up (cold start)
      const res1 = await fetchWithRetry(() =>
        axiosInstance.get("/api/v1/home-data")
      );
      setLimitedReviewsData(res1.data.data);

      const res2 = await fetchWithRetry(() =>
        axiosInstance.get("/api/v1/home-others-data")
      );
      setUsersFeedback(res2.data.usersFeedback);
      setTopReviewers(res2.data.topReviewers);

      setFoodie(food_image);
    } catch (error) {
      alert("Backend waking up… please try again.");
    } finally {
      setLoader(false);
    }
  }, []);

  const AllReviewsDataFetching = useCallback(async () => {
    try {
      setLoader(true);

      const res = await fetchWithRetry(() =>
        axiosInstance.get("/api/v1/shows/all-reviews")
      );

      // console.log("All reviews === ", res.data);
      setAllReviews(res.data.data);
    } catch (error) {
      console.error("Error fetching service data:", error);
      alert("Backend waking up… please try again.");
    } finally {
      setLoader(false);
    }
  }, []);

  const MyFavoriteReviewsDataFetching = useCallback(async () => {
    try {
      setLoader(true);

      const res1 = await fetchWithRetry(() =>
        axiosInstance.get("/api/v1/home-data")
      );
      setLimitedReviewsData(res1.data.data);

      const res2 = await fetchWithRetry(() =>
        axiosInstance.get("/api/v1/home-others-data")
      );
      setUsersFeedback(res2.data.usersFeedback);
    } catch (error) {
      console.error("Error fetching service data:", error);
      alert("Backend waking up… please try again.");
    } finally {
      setLoader(false);
    }
  }, []);

  const MyReviewsDataFetching = useCallback(async () => {
    try {
      setLoader(true);

      const res1 = await fetchWithRetry(() =>
        axiosInstance.get("/api/v1/home-data")
      );
      setLimitedReviewsData(res1.data.data);

      const res2 = await fetchWithRetry(() =>
        axiosInstance.get("/api/v1/home-others-data")
      );
      setUsersFeedback(res2.data.usersFeedback);
    } catch (error) {
      console.error("Error fetching service data:", error);
      alert("Backend waking up… please try again.");
    } finally {
      setLoader(false);
    }
  }, []);

  useMemo(() => {
    HomeDataFetching();
    AllReviewsDataFetching();
    MyFavoriteReviewsDataFetching();
    MyReviewsDataFetching();
  }, [HomeDataFetching]);

  return (
    <Data_Context.Provider
      value={{
        limitedReviewsData,
        usersFeedback,
        topReviewers,
        allReviews,
        myReviews,
        myFavoriteReviews,
        foodie,
        loader,
        setLoader,
      }}
    >
      {children}
    </Data_Context.Provider>
  );
}

export default DataContext;
