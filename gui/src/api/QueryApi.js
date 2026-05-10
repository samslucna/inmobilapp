import axios from "./axiosInstance";

export const getAllBd = async (table) => {
  const { data } = await axios.get(`api/${table}`);
  return data;
};

export const getDatasBd = async (table) => {
  const { data } = await axios.get(`api/${table}`);
  return data;
};

export const showDataBd = async (table,id) => {
  const { data } = await axios.get(`api/${table}/${id}`);
  return data;
};

export const getDataById = async (table, id, sub) => {
  const { data } = await axios.get(`api/${table}/${id}/${sub}`);
  return data;
};

export const createBd = async (table, user) => {
  const { data } = await axios.post(`api/${table}`, user);
  return data;
};

export const updateBd = async (table, id, user) => {
  const { data } = await axios.put(`api/${table}/${id}`, user);
  return data;
};

export const deleteBd = async (table, id) => {
  await axios.delete(`api/${table}/${id}`);
};

export const searchBd = async (table, query) => {
  const { data } = await axios.get(`api/${table}/search?q=${query}`);

  return data;
};

export const searchDatas = async (table, name) => {
  return await axios.get("/api/" + table + "/search?q=" + name);
};

export const setUrImport = async (url, file) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("_token", token);
    formData.append("file", file);
    const metadata = JSON.stringify({ _token: token });
    const blob = new Blob([metadata], { type: "application/json" });
    formData.append("metadata", blob);
    const resul = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Disposition": "attachment",
      },
    });

    return resul;
  } catch (error) {
    console.log(error);
  }
};

export const setUrlExport = async (url, namedoc) => {
  let exp = await axios.get(url, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment",
    },
    responseType: "blob",
  });

  const urlExp = URL.createObjectURL(exp.data);
  console.log(urlExp);
  const link = document.createElement("a");
  link.href = urlExp;
  link.setAttribute("download", "" + namedoc + ".xlsx");
  document.body.appendChild(link);
  link.click();

  return exp;
};

export const setUrlExportPdf = async (url, data) => {
  let exp = await axios.get(url, {
    headers: {
      "Content-Type": "application/pdf",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    responseType: "blob",
  });

  return URL.createObjectURL(exp.data);

  
};
