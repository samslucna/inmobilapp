import axios from "./axiosInstance";

export const loginRequest = async (email, password) => {
  try {
     const { data } = await axios.post("api/login", { email, password });

  return data; // Debe retornar { token: "..." }
  } catch (error) {
    console.log(error)
  }
 
}; 