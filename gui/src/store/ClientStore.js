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
class ClientStore {
  client = {
    id: null,
    name: "",
    lastnames: "",
    phone: "",
    email: "",
    dni: "",
  };
  urlImp = "";
  clients = [];
  pagination = {};
  roles = ["Admin", "Gerente", "Contador", "Agente", "Cliente"];
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
  setClient = (client) => {
    
    this.client = client;
  };

  setClients = (clients) => {
    this.clients = clients;
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
    const pagCurrent = await getDatasBd("buyers?page=" + page);
    if (pagCurrent) {
      this.setClients(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loadClients = async () => {
    try {
      const data = await getAllBd("buyers");

      this.setPagination(data);
      this.setClients(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  addClient = async (data) => {
    try {
      const resp = await Swal.fire({
        title: "Desea guardar los cambios?",
        text: "Esta acción guarda los datos del cliente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (data.id !== null) {
        await updateBd("buyers", data.id, data);
        Swal.fire({
          title: "Guardado",
          text: "La informacion se guardo correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        this.setClient({
          id: null,
          name: "",
          lastnames: "",
          phone: "",
          email: "",
          dni: "",
        });
        this.setHiddenForm(false);
        this.setEditing(false);
        this.loadClients();
      } else {
        if (resp.isConfirmed) {
          await createBd("buyers", data);
          Swal.fire({
            title: "Registrado",
            text: "El cliente se registro correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          this.setClient({
            id: null,
            name: "",
            lastnames: "",
            phone: "",
            email: "",
            dni: "",
          });
          this.setHiddenForm(false);
          this.setEditing(false);
          this.loadClients();
        }

        this.setHiddenForm(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Correo",
        text: "Algo salio Mal",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  importXlsClients = async () => {
    try {
      
      let imports = await setUrImport("/api/buyers/import", this.urlImp);
    
      await this.loadClients();
      return imports;
    } catch (error) {
      console.log(error);
    }
  };

  goEdit = async (client) => {
    this.setEditing(true);
    this.setEditId(client.id);
    this.setClient(client);
    this.setHiddenForm(true);
    //navigate(`/usuarios/editar/${client.id}`);
  };

  removeClient = async (id) => {
    try {
      await deleteBd("buyers", id);
      //let updatedclients = this.clients.filter((u) => u.id !== id);

      await this.loadClients();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setClients([]);
        let seachRender = await searchBd(table, value);
       
        this.setClients(seachRender);
      } else {
        await this.loadClients();
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default new ClientStore();
