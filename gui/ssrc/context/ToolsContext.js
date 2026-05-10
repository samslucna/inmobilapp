import React, { createContext, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.css";
import apiClient from "../services/api";

export const ToolsContext = createContext();

const ToolsProvider = (props) => {
  const [pagination, setPagination] = useState({
    limit: 15,
    current: 1,
    total: 0,
  });

  const [token, setToken] = useState(null);

  const [currentPag, setCurrentPag] = useState(1);
  const [datasTable, setDatasTable] = useState([]);
  const [datasAuxTable, setDatasAuxTable] = useState([]);
  const [pagNum, setPagNum] = useState(0);
  const [queryTable, setQueryTable] = useState([]);

  const setCookieXcsrf = async (data) => {
    let xcsf = await apiClient.get("/api/token");

    let xc = xcsf.data;

    data._token = xc;

    return data;
  };

  const delete_cookie = (name) => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  const paginator = (e, table) => {
    e.preventDefault();

    updateTable();

    const { id } = e.target;
    loadTable("/api/" + table + "?page=" + parseInt(id));

    let ob = pagination;
    ob.current = parseInt(id);
    //console.log(ob);
    setPagination(ob);

    //setCurrentPag(id);
  };

  const renderPagination = (numpag, table) => {
    let dataret = [];

    for (let i = 0; i < numpag; i++) {
      dataret.push(i + 1);
    }
    return dataret.map((inp) => {
      return (
        <button
          key={inp}
          onClick={(e) => {
            paginator(e, table);
          }}
          className="ui button"
          id={inp}
        >
          {" "}
          {inp}
        </button>
      );
    });
  };

  const loadTable = (table) => {
    return readDatas(table).then(async (res) => {
      let result = await res.data;
      let lim = pagination.limit;

      setPagination({
        limit: lim,
        current: 1,
        total: result.last_page,
      });

      await setDatasTable(result.data);
    });
  };

  const updateTable = () => {
    setDatasTable([]);
    setDatasTable(datasTable);
  };

  const getCookieXcsrf = async (nameCookie) => {
    let xcsfCookie = "";
    let pos, end;
    let search = nameCookie + "=";
    if (document.cookie.length > 0) {
      pos = document.cookie.indexOf(search);

      if (pos !== -1) {
        pos += search.length;
        end = document.cookie.indexOf(";", pos);
        if (end === -1) {
          end = document.cookie.length;
        }
        xcsfCookie = unescape(document.cookie.substring(pos, end));
      }
    }

    return xcsfCookie;
  };

  const searchPaginate = (data, table) => {
    try {
      let response = apiClient.post(table, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log(response);
      return response;
    } catch {
      console.log("Esta trabajando solo en front");
    }
  };

  const readDatas = (table) => {
    try {
      const usr = JSON.parse(localStorage.getItem("user"));
      return apiClient.get(table, {
        headers: {
          Authorization: `Bearer ${usr.data.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": usr.data.token,
        },
      });
    } catch {
      console.log("Esta trabajando solo en front");
    }
  };

  const deleteData = async (table, data) => {
    const usr = JSON.parse(localStorage.getItem("user"));
    data._token = usr.data.token;
    let response = await apiClient.delete(table, {
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${usr.data.token}`,
        Accept: "application/json",
        "X-CSRF-TOKEN": usr.data.token,
      },
    });
    return response.data;
  };

  const setUrlExport = async (url, namedoc) => {
    const usr = JSON.parse(localStorage.getItem("user"));
    let exp = await apiClient.get(url, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        Authorization: `Bearer ${usr.data.token}`,
        "Content-Disposition": "attachment",
      },
      responseType: "blob",
    });

    const urlExp = URL.createObjectURL(exp.data);
    //console.log(url)
    const link = document.createElement("a");
    link.href = urlExp;
    link.setAttribute("download", "" + namedoc + ".xlsx");
    document.body.appendChild(link);
    link.click();

    return exp;
  };

  const setUrlExportData = async (url, namedoc, data) => {
    const usr = JSON.parse(localStorage.getItem("user"));
    let exp = await apiClient.get(url, {
      params: data,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        Authorization: `Bearer ${usr.data.token}`,
        "Content-Disposition": "attachment",
      },
      responseType: "blob",
    });

    const urlExp = URL.createObjectURL(exp.data);
    //console.log(url)
    const link = document.createElement("a");
    link.href = urlExp;
    link.setAttribute("download", "" + namedoc + ".xlsx");
    document.body.appendChild(link);
    link.click();

    return exp;
  };

  const setUrlExportPdf = async (url, data) => {
    const usr = JSON.parse(localStorage.getItem("user"));
    let exp = await apiClient.get(url, {
      headers: {
        "Content-Type": "application/pdf",
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${usr.data.token}`,
        "X-Custom-CSS": "h1 { color: blue; font-weight: bold; }",
      },
      responseType: "blob",
    });

    const urlExp = URL.createObjectURL(exp.data);

    return urlExp;
  };

  const showData = async (url, data) => {
    const usr = JSON.parse(localStorage.getItem("user"));
    let exp = await apiClient.get(url, {
      params: data,
      headers: {
        "Content-Type": "application/pdf",
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${usr.data.token}`,
      },
    });

    return exp.data;
  };

  const toExport = (url, typeDoc, cod, nameDoc, data) => {
    if (typeDoc === "xls") {
      switch (cod) {
        case "all":
          console.log("all");
          return setUrlExport(url, nameDoc);

        case "acountclient":
          return setUrlExportData(url, nameDoc, data);
        default:
          break;
      }
    } else if (typeDoc === "pdf") {
      switch (cod) {
        case "contract":
          return setUrlExportPdf(url, nameDoc, data);
        
        case "ticket":
          return setUrlExportPdf(url, nameDoc, data);

        default:
          break;
      }
    }
  };

  const setUrImport = async (url, path) => {
    try {
      const usr = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      formData.append("_token", usr.data.token);
      formData.append("file", path);
      const metadata = JSON.stringify({ _token: usr.data.token });
      const blob = new Blob([metadata], { type: "application/json" });
      formData.append("metadata", blob);
      return await apiClient.post(url, formData, {
        headers: {
          Authorization: `Bearer ${usr.data.token}`,
          "Content-Disposition": "attachment",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const uploaderFiles = async (url, path, data) => {
    try {
      const usr = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      formData.append("_token", usr.data.token);
      formData.append("name", data.name);
      formData.append("datas", data.description);
      formData.append("fileurl", path);
      const metadata = JSON.stringify({ _token: usr.data.token });
      const blob = new Blob([metadata], { type: "application/json" });
      formData.append("metadata", blob);
      return await apiClient.post(url, formData, {
        headers: {
          Authorization: `Bearer ${usr.data.token}`,
          "Content-Disposition": "attachment",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const searchBy = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        setDatasTable([]);
        let seachRender = await searchDatas(table, value);
        //console.log(seachRender);
        await setDatasTable(seachRender.data);
      } else {
        await loadTable("/api/" + table + "?page=1");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showAllSubData = async (table, data) => {
    try {
      if (data !== undefined) {
        let readData = await showData("/api/" + table + "/" + data.id, data);
       
        return readData;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveDatas = async (table, data) => {
    const usr = JSON.parse(localStorage.getItem("user"));
    data._token = usr.data.token;
    let response = await apiClient.post(table, data, {
      headers: {
        Authorization: `Bearer ${usr.data.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": usr.data.token,
      },
    });

    return response;
  };

  const updateDatas = async (table, data) => {
    const usr = JSON.parse(localStorage.getItem("user"));
    data._token = usr.data.token;

    let response = await apiClient.put(table, data, {
      headers: {
        Authorization: `Bearer ${usr.data.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": usr.data.token,
      },
    });

    return response.data;
  };

  const formatNumber = (n) => {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const inputNumber = (e) => {
    const { value } = e.target;

    let valInput = value;

    if (valInput === "") {
      return;
    }

    let originalLn = value.length;

    let caret_pos = e.target.selectionStart;

    if (valInput.indexOf(".") >= 0) {
      const decimalPos = valInput.indexOf(".");

      let leftSide = valInput.substring(0, decimalPos);
      let rightSide = valInput.substring(decimalPos);

      leftSide = formatNumber(leftSide);
      rightSide = formatNumber(rightSide);

      if (e.type === "blur") {
        rightSide += "00";
      }

      rightSide = rightSide.substring(0, 2);

      valInput = "$" + leftSide + "." + rightSide;
    } else {
      valInput = formatNumber(valInput);
      valInput = "$" + valInput;

      if (e.type === "blur") {
        valInput += ".00";
      }
    }
    let updateLn = valInput.length;
    caret_pos = updateLn - originalLn + caret_pos;

    e.target.setSelectionRange(caret_pos, caret_pos);

    return valInput;
  };

  const toInt = (n) => {
    n = n.toString();

    console.log(n);
    if (n !== undefined && n !== "") {
      return parseFloat(n.replace(/,/g, "").replace("$", "")).toFixed(2);
    } else {
      return n;
    }
  };

  const numberToString = (numb) => {
    numb = parseFloat(numb).toFixed(2);
    let valInput = numb.toString();

    if (valInput === "") {
      return;
    }

    if (valInput.indexOf(".") >= 0) {
      const decimalPos = valInput.indexOf(".");

      let leftSide = valInput.substring(0, decimalPos);
      let rightSide = valInput.substring(decimalPos);

      leftSide = formatNumber(leftSide);
      rightSide = formatNumber(rightSide);

      rightSide += "00";

      rightSide = rightSide.substring(0, 2);

      valInput = "$" + leftSide + "." + rightSide;
    } else {
      valInput = formatNumber(valInput);
      valInput = "$" + valInput;

      valInput += ".00";
    }

    return valInput;
  };

  const inptmoney = (e, result) => {
    const { value } = e.target || result;

    let valInput = value;

    if (valInput === "") {
      return;
    }

    let originalLn = value.length;

    let caret_pos = e.target.selectionStart;

    if (valInput.indexOf(".") >= 0) {
      const decimalPos = valInput.indexOf(".");

      let leftSide = valInput.substring(0, decimalPos);
      let rightSide = valInput.substring(decimalPos);

      leftSide = formatNumber(leftSide);
      rightSide = formatNumber(rightSide);

      if (e.type === "blur") {
        rightSide += "00";
      }

      rightSide = rightSide.substring(0, 2);

      valInput = "$" + leftSide + "." + rightSide;
    } else {
      valInput = formatNumber(valInput);
      valInput = "$" + valInput;

      if (e.blur === "blur") {
        valInput += ".00";
      }
    }
    /*   setPpData({
        ...ppData,
        [name]: valInput
    }) */

    let updateLn = valInput.length;
    caret_pos = updateLn - originalLn + caret_pos;

    e.target.setSelectionRange(caret_pos, caret_pos);
  };

  const selectAlert = async (name, msg) => {
    switch (name) {
      case "loginok":
        return Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: "success",
          title: msg,
        });
      case "loginfail":
        return Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: "error",
          title: msg,
        });
      case "confirmsave":
        return console.log("yes");
      case "confirmfail":
        return console.log("yes");
      case "spin":
        return console.log("yes");
      case "confirmfailq":
        return console.log("yes");
      default:
        return console.log("yes");
    }
  };

  const renderDate = (date) => {
    date = new Date(date);

    let datemnt = date.getMonth();
    let dateday = date.getDate();
    datemnt = datemnt.toString();
    dateday = dateday.toString();

    if (datemnt.length !== 1) {
      if (dateday.length !== 1) {
        return (
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate()
        );
      } else {
        return (
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          ("0" + date.getDate())
        );
      }
    } else {
      if (dateday.length !== 1) {
        return (
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)) +
          "-" +
          date.getDate()
        );
      } else {
        return (
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)) +
          "-" +
          ("0" + date.getDate())
        );
      }
    }
  };

  const toDouble = (strnum) => {
    let aux = strnum.toString();
    return aux.replace("$", "").replace(",", "");
  };

  const searchDatas = async (table, data) => {
    const usr = JSON.parse(localStorage.getItem("user"));

    return await apiClient.get(
      "/api/" + table + "/search?name=" + data.toString(),
      {
        headers: {
          Authorization: `Bearer ${usr.data.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": usr.data.token,
        },
      }
    );
  };

  return (
    <ToolsContext.Provider
      value={{
        showAllSubData,
        setUrImport,
        loadTable,
        updateTable,
        renderPagination,
        delete_cookie,
        renderDate,
        toDouble,
        queryTable,
        setQueryTable,
        searchBy,
        toExport,
        searchDatas,
        searchPaginate,
        currentPag,
        setCurrentPag,
        pagNum,
        setPagNum,
        pagination,
        setPagination,
        selectAlert,
        token,
        datasTable,
        datasAuxTable,
        toInt,
        formatNumber,
        inputNumber,
        numberToString,
        setDatasTable,
        setDatasAuxTable,
        uploaderFiles,
        readDatas,
        deleteData,
        saveDatas,
        updateDatas,
        setCookieXcsrf,
        setUrlExport,
        inptmoney,
        getCookieXcsrf,
        setToken,
        setUrlExportData,
      }}
    >
      {" "}
      {props.children}{" "}
    </ToolsContext.Provider>
  );
};

export default ToolsProvider;
