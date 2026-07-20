import { makeAutoObservable, runInAction } from "mobx";
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
  searchBdFilter,
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

  filters = {
    search: "",
    status: "",
    paytype: "",
    date_from: "",
    date_to: "",
  };

  urlImp = "";

  isLoading = false;

  pagination = {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 5,
    from: null,
    to: null,
  };

  editing = false;
  editId = null;
  hiddenForm = false;
  loading = true;
  error = null;
  constructor() {
    makeAutoObservable(this);
  }

  setFilters = (filters) => {
    this.filters = { ...this.filters, ...filters };
  };

  setRangeDate = (range) => {
    this.rangeDate = range;
  };
  setUrlImp = (url) => {
    this.urlImp = url;
  };

  setError = (error) => {
    this.error = error;
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
        this.rangeDate.date_init = value !== "" ? new Date(value) : "";
        this.setRangeDate(this.rangeDate);
        break;
      case "date_end":
        this.rangeDate.date_end = value !== "" ? new Date(value) : "";
        this.setRangeDate(this.rangeDate);
        break;
    }
  };

  setPagination = (pagination) => {
    this.pagination = {
      current_page: pagination.current_page || pagination.currentPage || 1,
      last_page: pagination.last_page || pagination.lastPage || 1,
      total: pagination.total || 0,
      per_page: pagination.per_page || pagination.perPage || 10,
      from: pagination.from || null,
      to: pagination.to || null,
    };
  };
  setFilter = (filter) => {
    this.filter = filter;
  };

  handlePaginationChange = async (page) => {
    const pagCurrent = await getFilteredBd(
      "properties/filterProperties?page=" + page.target.textContent,
      this.filter,
    );

    
    if (pagCurrent.data) {
      this.setReports(pagCurrent.data.data);
      delete pagCurrent.data.data;
      this.setPagination(pagCurrent.data);
    }
  };

  // handlePaginationChange = async (page) => {
  //  if (page === this.pagination.current_page) return;
  //  await this.loadContracts(page);
  //};


   handlePaginationChangeContract = async (page) => {
    const pagCurrent = await getFilteredBd(
      "contracts?page=" + page.target.textContent,
      this.filter,
    );
    
    if (pagCurrent.data) {
      this.setReports(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loadData = async (page = 1, table) => {
    try {
      console.log(this.filters);
      const params = new URLSearchParams({
        page: page,
        per_page: this.pagination.per_page,
        date_from: this.filters.date_from,
        date_to: this.filters.date_to,
        agent_id: this.filters.agent_id,
      });

      const response = await getAllBd(`${table}?${params}`);
      console.log("response", response);
      runInAction(() => {
        if (response && response.data) {
          this.setReports(response.data);
          this.setPagination({
            current_page: response.current_page,
            last_page: response.last_page,
            total: response.total,
            per_page: response.per_page,
            from: response.from,
            to: response.to,
          });
        }
      });

      return response;
    } catch (error) {
      console.error("Error loading contracts:", error);
      runInAction(() => {
        this.setError(
          error.response?.data?.message || "Error al cargar los datos",
        );
      });
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  handlePagination = async (page) => {
    const pagCurrent = await getFilteredBd(
      "properties/filterProperties?page=" + page.target.textContent,
      this.filter,
    );
    console.log(pagCurrent);
    console.log(pagCurrent);
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

  filterByAgents = async (filters) => {
    try {
      const data = await searchBdFilter("contracts", filters);
      this.setPagination(data);
      this.setReports(data.data);
      this.setFilter(filters);
      return data;
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
