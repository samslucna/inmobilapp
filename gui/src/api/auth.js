import axios from "./axiosInstance";

export const loginRequest = async (email, password) => {
  const { data } = await axios.post("api/login", { email, password });
  return data; // Debe retornar { token: "..." }
}; 