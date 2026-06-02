import { makeAutoObservable } from "mobx";
import {
  getAllBd,
  createBd,
  updateBd,
  deleteBd,
  searchBd,
  getDatasBd,
  setUrImport,
  searchDatas,
  setUrlExportPdf,
  setUrlExportXls,
  showDataBd,
  getFilteredBd,
} from "../api/QueryApi";
import Swal from "sweetalert2";
import changeFormat from "../helper/changeFormat";

class ReportStore {
  report = {
    id: null,
    project_id: 0,
    stage_id: 0,
    block_id: 0,
  };

  rangeDate = {
    date_init: "",
    date_end: "",
  };

  checkboxes = {
    disponible: 1,
    apartado: 1,
    vendido: 1,
  };

  reports = [];
  searchEdit = null;

  searchInpt = {
    cliente: "text",
    propietario: "text",
    agente: "text",
    lote: "text",
  };

  filter = {
    project_id: 0,
    stage_id: 0,
    block_id: 0,
    dates: {
      date_init: "",
      date_end: "",
    },
    status: {
      disponible: 1,
      apartado: 1,
      vendido: 1,
    },
  };

  urlImp = "";

  isLoading = false;

  pagination = {};
  editing = false;
  editId = null;
  hiddenForm = false;
  loading = true;

  constructor() {
    makeAutoObservable(this);
  }

  setRangeDate = (range) => {
    this.rangeDate = range;
  };
  setUrlImp = (url) => {
    this.urlImp = url;
  };

  setCheckboxes = (data) => {
    this.checkboxes = data;
  };

  setLoading = (load) => {
    this.loading = load;
  };

  setReport = (Report) => {
    this.report = Report;
  };

  setSearchInput = (q) => {
    this.searchInpt = q;
  };

  setSearchEdit = (search) => {
    this.searchEdit = search;
  };

  setReports = (Reports) => {
    this.reports = Reports;
  };

  setEditId = (id) => {
    this.editId = id;
  };
  setHiddenForm(hf) {
    this.hiddenForm = hf;
  }

  setEditing = (editing) => {
    this.editing = editing;
  };

  updateRangeDate = (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;

    switch (name) {
      case "date_init":

        this.rangeDate.date_init = value!== '' ? new Date(value) : '';
        this.setRangeDate(this.rangeDate);
        break;
      case "date_end":
        this.rangeDate.date_end = value!== '' ? new Date(value) : '';
        this.setRangeDate(this.rangeDate);
        break;
    }
  };

  setPagination = (pagination) => {
    this.pagination = pagination;
  };
  setFilter = (filter) => {
    this.filter = filter;
  };

  handlePaginationChange = async (page) => {
  
    const pagCurrent = await getFilteredBd(
      "properties/filterProperties?page=" + page.target.textContent,this.filter
    );
    if (pagCurrent.data) {
      
      this.setReports(pagCurrent.data.data);
      delete pagCurrent.data.data;
      this.setPagination(pagCurrent.data);
    }
  };



  filterByLots = async (filters) => {
    
    try {
  
      const data = await getFilteredBd("properties/filterProperties", filters);
      this.setPagination(data.data);
      this.setReports(data.data.data);
      this.setFilter(filters);
      
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  toExport = (url, data) => {
    console.log(data);
    return setUrlExportPdf(url, data);
  };

  toExportExcel = async (url, namedoc, data) => {
    return setUrlExportXls(url, namedoc, data);
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setReports([]);
        let seachRender = await searchBd(table, value);
        console.log(seachRender[0]);
        if (seachRender[0] !== null) {
          this.setReports(seachRender);
        }
      } else {
        await this.loadReports();
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default new ReportStore();
