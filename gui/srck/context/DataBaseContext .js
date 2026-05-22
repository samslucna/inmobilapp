import React, { createContext, useState } from "react";

//Componentes
//Providers

export const ConfigContext = createContext();

const ConfigProvider = (props) => {
  const [configTheme, setConfigTheme] = useState({
    logo: "",
    bkgrounImg: "",
    company: "TestCompany",
    icon: "",
  });

  const [datahost, setDataHost] = useState({
    domain: "localhost:8080",
    page: "postd",
    table: "",
  });

  return (
    <ConfigContext.Provider
      value={{
        datahost,
        configTheme,
        setDataHost,
        setConfigTheme,
      }}
    >
      {" "}
      {props.children}{" "}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
