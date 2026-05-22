import React, { createContext, useState, useContext } from "react";
import { ToolsContext } from "./ToolsContext";

import apiClient from "../services/api";
export const LoginContext = createContext();

const LoginProvider = (props) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [logued, setLogued] = useState(false);
  const { setCookieXcsrf } = useContext(ToolsContext);

  const registerUser = async (data) => {
    try {
       await setCookieXcsrf(data);
    return apiClient.post("/api/register", data).then(() => {
      console.log("Register successful!");
    });
    } catch (error) {
       console.log(error);
    }
   
  };

  const loginUser = async (data) => {
    try {
      return await apiClient.post("/api/login", data);
    } catch (error) {
      let res={status:error.status} ;
      
      return res;
    }
  };

  const logout = async () => {
    try {
          const usr = JSON.parse(localStorage.getItem("user"));
    let response = await apiClient.get("/api/logout",
       { headers: {
          Authorization: `Bearer ${usr.data.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": usr.data.token,
        },}
      );

    let msg = await response;

    return msg;
      
    } catch (error) {
       console.log(error);
    }

  };

  return (
    <LoginContext.Provider
      value={{
        user,
        logued,
        setLogued,
        setUser,
        registerUser,
        loginUser,
        logout,
      }}
    >
      {" "}
      {props.children}{" "}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
