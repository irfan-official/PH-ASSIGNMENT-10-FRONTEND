import { useContext } from "react";
import { Auth_Context } from "../context/AuthContext.jsx";
import axios from "axios";
import useAuth from "./useAuth.jsx";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export function useAxiosSecure() {
  // console.log("token ==> ", sessionStorage.getItem("accessToken"));

  instance.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${
      sessionStorage.getItem("accessToken") || ""
    }`;
    return config;
  });
  return instance;
}

export default useAxiosSecure;
