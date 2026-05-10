import { makeAutoObservable } from "mobx";
import {
  getAllBd,
  createBd,
  updateBd,
  deleteBd,
  searchBd,
  getDatasBd,
  setUrImport,
} from "../api/QueryApi";
import Swal from "sweetalert2";
class AgentStore {
  agent = {
    id: null,
    name: "",
    lastnames: "",
    phone: "",
    email: "",
    dni: "",
  };
  urlImp = "";
  agents = [];
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
  setAgent = (Agent) => {
    this.agent = Agent;
  };

  setAgents = (Agents) => {
    this.agents = Agents;
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
    const pagCurrent = await getDatasBd("agents?page=" + page);
    if (pagCurrent) {
      this.setAgents(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loadAgents = async () => {
    try {
      const data = await getAllBd("agents");

      this.setPagination(data);
      this.setAgents(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  addAgent = async (data) => {
    try {
      const resp = await Swal.fire({
        title: "Desea guardar los cambios?",
        text: "Esta acción registra un nuevo Agente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (data.id !== null) {
        await updateBd("agents", this.editId, data);
        Swal.fire({
          title: "Guardado",
          text: "Se guardo correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        this.setAgent({
          id: null,
          name: "",
          lastnames: "",
          phone: "",
          email: "",
          dni: "",
        });
        this.setHiddenForm(false);
        this.setEditing(false);
        this.loadAgents();
      } else {
        if (resp.isConfirmed) {
          await createBd("agents", data);
          Swal.fire({
            title: "Registrado",
            text: "El Agente se registro correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          this.setAgent({
            id: null,
            name: "",
            lastnames: "",
            phone: "",
            email: "",
            dni: "",
          });
          this.setHiddenForm(false);
          this.setEditing(false);
          this.loadAgents();
        }

      }
    } catch (error) {
      Swal.fire({
        title: "Correo",
        text: "Algo salio mal al registrar la información",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  importXlsAgents = async () => {
    try {
      await setUrImport("/api/agents/import", this.urlImp);
      await this.loadAgents();
    } catch (error) {
      console.log(error);
    }
  };

  goEdit = async (agent) => {
    this.setEditing(true);
    this.setEditId(agent.id);
    this.setAgent(agent);
    this.setHiddenForm(true);
    //navigate(`/usuarios/editar/${Agent.id}`);
  };

  removeAgent = async (id) => {
    try {
      await deleteBd("agents", id);
  
      await this.loadAgents();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setAgents([]);
        let seachRender = await searchBd(table, value);
      
        this.setAgents(seachRender);
      } else {
        await this.loadAgents();
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default new AgentStore();
