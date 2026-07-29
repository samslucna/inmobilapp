import axios from "./axiosInstance";

export const getAllBd = async (table) => {
  try {
    const { data } = await axios.get(`api/${table}`);

    return data;
  } catch (error) {
    console.log("Error al cargar los datos");
  }
};

export const getFilteredBd = async (table, filters) => {
  try {
    const { data } = await axios.get(`api/${table}`, { params: filters });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getDatasBd = async (table) => {
  try {
    const { data } = await axios.get(`api/${table}`);
    return data;
  } catch (error) {
    console.log("Error al obtener los datos de la api" + error);
  }
};

export const showDataBd = async (table, id) => {
  try {
    const { data } = await axios.get(`api/${table}/${id}`);
    return data;
  } catch (error) {
    console.log("Error al obtener los datos de la api" + error);
  }
};

export const getDataById = async (table, id, sub) => {
  try {
    const { data } = await axios.get(`api/${table}/${id}/${sub}`);
    return data;
  } catch (error) {
    console.log("Error al obtener los datos de la api" + error);
  }
};

export const createBd = async (table, user) => {
  try {
    const { data } = await axios.post(`api/${table}`, user);
    return data;
  } catch (error) {
    console.log("Error al obtener los datos de la api" + error);
  }
};

export const updateBd = async (table, id, user) => {
  try {
    const { data } = await axios.put(`api/${table}/${id}`, user);
    return data;
  } catch (error) {
    console.log("Error al obtener los datos de la api" + error);
  }
};
//export const updateBdRol = async (table, role) => {
//  const { data } = await axios.get(`api/${table}`, { params: role});
//  return data;
//};

// En QueryApi.js
export const updateBdRol = async (endpoint, data) => {
  try {
    console.log("📡 API - Enviando a:", endpoint);
    console.log("📡 API - Datos:", data);

    const response = await axios.put(`/api/${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
          ?.content,
      },
    });

    console.log("📡 API - Respuesta:", response.data);

    return response.data;
  } catch (error) {
    console.error("📡 API - Error:", error.response?.data || error);
    throw error;
  }
};

export const deleteBd = async (table, id) => {
  try {
    await axios.delete(`api/${table}/${id}`);
  } catch (error) {
    console.log("Error al obtener los datos de la api" + error);
  }
};

export const searchBd = async (table, query) => {
  try {
    const { data } = await axios.post(`api/${table}/search`, { q: query });

    return data;
  } catch (error) {
    console.log("Error al obtener los datos de la api" + error);
  }
};

export const searchBdFilter = async (table, filters) => {
  try {
    const { data } = await axios.get(`api/${table}`, { params: filters });

    return data;
  } catch (error) {
    console.log("Error al obtener los datos de la api" + error);
  }
};

export const searchDatas = async (table, name) => {
  try {
    return await axios.get("/api/" + table + "/search?q=" + name);
  } catch (error) {
    console.log("Error al obtener los datos de la api" + error);
  }
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
  try {
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
  } catch (error) {
    console.log("Error al acceder a la api: " + error);
  }
};

export const setUrlExportXls = async (url, namedoc, data) => {
  try {
    let exp = await axios.get(url, {
      params: data,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
  } catch (error) {
    console.log("Error al recuperar datos de la api:" + error);
  }
};

export const setUrlExportPdf = async (url, data) => {
  try {
    let exp = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/pdf",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      responseType: "blob",
    });

    return URL.createObjectURL(exp.data);
  } catch (error) {
    console.log("Error al recuperar los datos de la api:" + error);
  }
};
