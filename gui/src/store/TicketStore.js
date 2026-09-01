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
} from "../api/QueryApi";
import Swal from "sweetalert2";
import changeFormat from "../helper/changeFormat";

class TicketStore {
  ticket = {
    id: null,
    nticket:'',
    concept: "Mensualidad",
    contract_id: null,
    paytype: "efectivo",
    ref: "Sin referencia",
    date: "",
    amount: "$ 0.00",
  };
  tickets = [];
  searchEdit = null;

  searchInpt = {
    cliente: "text",
    propietario: "text",
    agente: "text",
    lote: "text",
  };

  urlImp = "";
  // Estados de UI
  editing = false;
  editId = null;
  hiddenForm = false;
  loading = false;
  saving = false;
  error = null;
  isLoading = false;

  pagination = {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 5,
    from: null,
    to: null,
  };

  filters = {
      search: "",
      clientname: "",
      concept: "",
      status: "",
      datei: null,
      datee: null,
      month: "",
      year: "",
    }

  rangeDate = {
    date_init: "",
    date_end: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setRangeDate = (range) => {
    this.rangeDate = range;
  };
  setUrlImp = (url) => {
    this.urlImp = url;
  };

  setLoading = (load) => {
    this.loading = load;
  };

  setError = (error) => {
    this.error = error;
  };
  setTicket = (Ticket) => {
    this.ticket = Ticket;
  };

  setSearchInput = (q) => {
    this.searchInpt = q;
  };

  setSearchEdit = (search) => {
    this.searchEdit = search;
  };

  setTickets = (Tickets) => {
    this.tickets = Tickets;
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
        this.rangeDate.date_init = new Date(value);
        this.setRangeDate(this.rangeDate);
        break;
      case "date_end":
        this.rangeDate.date_end = new Date(value);
        this.setRangeDate(this.rangeDate);
        break;
    }
  };

  setPagination = (pagination) => {
    this.pagination = {
      current_page: pagination.current_page || pagination.currentPage || 1,
      last_page: pagination.last_page || pagination.lastPage || 1,
      total: pagination.total || 0,
      per_page: pagination.per_page || pagination.perPage || 5,
      from: pagination.from || null,
      to: pagination.to || null,
    };
  };

  handlePaginationChange = async (page) => {
    const pagCurrent = await getDatasBd("tickets?page=" + page);
    if (pagCurrent) {
      console.log(pagCurrent);
      this.setTickets(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  /**
   * Cambiar número de registros por página
   */
  changePerPage = async (perPage) => {
    this.pagination.per_page = perPage;
    await this.loadTickets(1);
  };


  /**
   * Cargar lista de contratos con filtros y paginación
   */
  loadTickets = async (page = 1, filters) => {
    this.setLoading(true);
    this.setError(null);

    try {
      if (page != undefined) {
        let params = new URLSearchParams({
          page: page,
          ...filters,
        });
        const data = await getFilteredBd("tickets?", params);
        return data;
      }
    } catch (error) {
      console.error("Error loading recibos:", error);
      runInAction(() => {
        this.setError(
          error.response?.data?.message || "Error al cargar recibos",
        );
      });
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  showContract = async (table, id) => {
    let seachRender = await showDataBd(table, id);
    console.log(seachRender.data);
    return seachRender.data;
  };

  addTicket = async (data) => {
    data.amount = changeFormat.toInt(data.amount);
    data.ref = data.ref === "" ? "Sin referencia" : data.ref;

    if (data.id !== null) {
      const resup =await updateBd("tickets", data.id, data);

      if(resup){
        return resup;
      }

    } else {
      
      console.log(data);
      const res = await createBd("tickets", data);

      if(res){
        return res;
      }
      
    }
  };


  importXlsTickets = async () => {
    try {
      const importData = await setUrImport("/api/tickets/import", this.urlImp);
      await this.loadTickets();
      return importData;
    } catch (error) {
      console.log(error);
    }
  };

  toExport = (url, nameDoc, data) => {
    return setUrlExportPdf(url, nameDoc, data);
  };

  toExportExcel = async (url, namedoc, data) => {
    return setUrlExportXls(url, namedoc, data);
  };

  removeTicket = async (id) => {
    try {
      await deleteBd("tickets", id);

      await this.loadTickets();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;
    this.setLoading(true);
    this.setError(null);
    try {
      if (value !== "") {
        this.setTickets([]);
        let seachRender = await searchBd(table, value);

        runInAction(() => {
          if (seachRender && seachRender.data) {
            this.setTickets(seachRender.data);
            this.setPagination({
              current_page: seachRender.current_page,
              last_page: seachRender.last_page,
              total: seachRender.total,
              per_page: seachRender.per_page,
              from: seachRender.from,
              to: seachRender.to,
            });
          }
        });
        this.setLoading(false);
      } else {
        await this.loadTickets();
      }
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  };
}

export default new TicketStore();
