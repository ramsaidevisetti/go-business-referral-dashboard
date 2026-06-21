import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL:
    "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api",
});

API.interceptors.request.use((config) => {
  const token = Cookies.get("jwt_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;