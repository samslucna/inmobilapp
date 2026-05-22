import React, { createContext, useState } from "react";

//Componentes
//Providers

export const ConfigContext = createContext();

const ConfigProvider = (props) => {
  const [confg, setConfg] = useState({});
  const [descFile, setDescFile] = useState({ name: "", description: "" });
const [reportList, setReportList] = useState([]);
  const [fileUpload, setFileUpload] = useState(null);
const [datasTable, setDatasTable] = useState([]);
  return (
    <ConfigContext.Provider
      value={{
        confg,
        setConfg,

        fileUpload,
        setFileUpload,
        descFile,
        setDescFile,reportList, setReportList,datasTable, setDatasTable
      }}
    >
      {" "}
      {props.children}{" "}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
