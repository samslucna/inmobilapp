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
  showDataBd,
} from "../api/QueryApi";
import Swal from "sweetalert2";
import changeFormat from "../helper/changeFormat";

class TicketStore {
  ticket = {
    id: null,
    concept: "Mensualidad",
    contract_id: null,
    paytype: 'Efectivo',
    ref: "",
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

  isLoading = false;

  pagination = {};
  editing = false;
  editId = null;
  hiddenForm = false;
  loading = true;

  constructor() {
    makeAutoObservable(this);
  }

  setUrlImp = (url) => {
    this.urlImp = url;
  };

  setLoading = (load) => {
    this.loading = load;
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

  setPagination = (pagination) => {
    this.pagination = pagination;
  };

  handlePaginationChange = async (page) => {
    const pagCurrent = await getDatasBd("tickets?page=" + page);
    if (pagCurrent) {
      //console.log(pagCurrent.data)
      this.setTickets(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loadTickets = async () => {
    try {
      const data = await getAllBd("tickets");
      this.setPagination(data);
      this.setTickets(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  showContract = async (table, id) => {
    let seachRender = await showDataBd(table, id);
    console.log(seachRender.data);
    return seachRender.data;
  };

  addTicket = async (data) => {
    data.amount = changeFormat.toInt(data.amount);

    if (data.id !== null) {
      await updateBd("tickets", this.editId, data);
      this.setHiddenForm(false);
      this.setEditing(false);
      this.loadTickets();
    } else {
      await createBd("tickets", data);
      this.setHiddenForm(false);
      this.setEditing(false);
      this.loadTickets();
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

  removeTickets = async (id) => {
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

    try {
      if (value !== "") {
        this.setTickets([]);
        let seachRender = await searchBd(table, value);

        this.setTickets(seachRender);
      } else {
        await this.loadTickets();
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default new TicketStore();
