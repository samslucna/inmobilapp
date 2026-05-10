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

class ContractStore {
  contract = {
    id: null,
    buyer_id: "",
    seller_id: "",
    agent_id: "",
    property_id: "",
    plazo: "",
    paytype: "",
    ref: "",
    date: "",
    advance: "$ 0.00",
  };
  constracts = [];
  searchEdit = null;

  searchInpt = {
    cliente: "text",
    propietario: "text",
    agente: "text",
    lote: "text",
  };

  queryTable = [];

  urlImp = "";

  query = "";

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

  setContract = (contract) => {
    this.contract = contract;
  };

  setSelectedProject(id) {
    this.selectedProject = id;
  }

  setQuery = (q) => {
    this.query = q;
  };

  setSelectedStage(id) {
    this.selectedStage = id;
  }

  setSelectedBlock(id) {
    this.selectedBlock = id;
  }
  setSearchInput = (q) => {
    this.searchInpt = q;
  };

  setSearchEdit = (search) => {
    this.searchEdit = search;
  };

  setQueryTable = (qt) => {
    this.queryTable = qt;
  };

  setContracts = (contracts) => {
    this.constracts = contracts;
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
    const pagCurrent = await getDatasBd("contracts?page=" + page);
    if (pagCurrent) {
      //console.log(pagCurrent.data)
      this.setContracts(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loadContracts = async () => {
    try {
      const data = await getAllBd("contracts");
      //console.log(data)
      this.setPagination(data);
      this.setContracts(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  showContract = async (table, id) => {
    this.setContract({ ...this.contract, id: id });
    let seachRender = await showDataBd(table, id);
    return seachRender;
  };

  addContract = async (data) => {
    try {
      data.advance = changeFormat.toInt(data.advance);

      if (data.id !== null) {
    
        await updateBd("contracts", this.editId, data);
        this.setHiddenForm(false);
        this.setEditing(false);
        this.loadContracts();
      } else {
        await createBd("contracts", data);

        this.setHiddenForm(false);
        this.setEditing(false);
        this.loadContracts();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "error al guardar el lote",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  importXlsContracts = async () => {
    try {
      const importData = await setUrImport(
        "/api/contracts/import",
        this.urlImp,
      );
      await this.loadContracts();
      return importData;
    } catch (error) {
      console.log(error);
    }
  };

  removeContracts = async (id) => {
    try {
      await deleteBd("contracts", id);

      await this.loadContracts();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setContracts([]);
        let seachRender = await searchBd(table, value);

        this.setContracts(seachRender);
      } else {
        await this.loadContracts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  seachQueryData = async (table, name) => {
    this.setQueryTable([]);
    let seachRender = await searchBd(table, name);
    return seachRender;
  };

  setData = async (e, data, fn) => {
    e.preventDefault();
    const { id } = e.target;

    switch (id) {
      case "lote":
        console.log(data);
        fn(data);
        this.setQueryTable([]);
        this.setSearchInput({ ...this.searchInpt, lote: "hidden" });
        break;

      case "agente":
        console.log(data);
        fn(data);
        this.setQueryTable([]);
        this.setSearchInput({ ...this.searchInpt, agente: "hidden" });
        break;

      case "propietario":
        console.log(data);
        fn(data);
        this.setQueryTable([]);
        this.setSearchInput({ ...this.searchInpt, propietario: "hidden" });
        break;

      case "cliente":
        fn(data);
        this.setQueryTable([]);
        this.setSearchInput({ ...this.searchInpt, cliente: "hidden" });
        break;

      default:
        break;
    }
  };

  toExport = (url, nameDoc, data) => {
    return setUrlExportPdf(url, nameDoc, data);
  };
}

export default new ContractStore();
