import axios from "axios";
import authStore from "../store/AuthStore";

const instance = axios.create({
  baseURL: "http://178.156.202.87/",
  withCredentials:true,
  withXSRFToken:true,
});

instance.interceptors.request.use((config) => {
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export default instance;