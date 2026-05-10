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
class RolStore {
  
  rol = {
    id: null,
    name: "",
    description: "",
  };

  urlImp = "";
  rols = [];
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
  setRol = (rol) => {
    this.rol = rol;
  };

  setRols = (rols) => {
    this.rols = rols;
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
    const pagCurrent = await getDatasBd("rols?page=" + page);
    if (pagCurrent) {
      this.setRols(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loadRols = async () => {
    try {
      const data = await getAllBd("rols");

      this.setPagination(data);
      this.setRols(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  addRol = async (data) => {
    try {
      const resp = await Swal.fire({
        title: "Desea guardar los cambios?",
        text: "Esta acción registra un nuevo Lote.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (data.id !== null) {
        await updateBd("rols", this.editId, data);
        Swal.fire({
          title: "Guardado",
          text: "Se guardo correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        this.setRol({
          id: null,
          name: "",
          description: "",
        });
        this.setHiddenForm(false);
        this.setEditing(false);
        this.loadRols();
      } else {
        if (resp.isConfirmed) {
          await createBd("rols", data);
          Swal.fire({
            title: "Registrado",
            text: "El Rol se registro correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          this.setRol({
            id: null,
            name: "",
            description: ""
          });
          this.setHiddenForm(false);
          this.setEditing(false);
          this.loadRols();
        }

      }
    } catch (error) {
      Swal.fire({
        title: "Correo",
        text: "El correo electronico ya existe",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  importXlsrols = async () => {
    try {
      await setUrImport("/api/rols/import", this.urlImp);
      await this.loadRols();
    } catch (error) {
      console.log(error);
    }
  };

  goEdit = async (rol) => {
    this.setEditing(true);
    this.setEditId(rol.id);
    this.setRol(rol);
    this.setHiddenForm(true);
    //navigate(`/usuarios/editar/${Rol.id}`);
  };

  removeRol = async (id) => {
    try {
      await deleteBd("rols", id);
      await this.loadRols();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setRols([]);
        let seachRender = await searchBd(table, value);
      
        this.setRols(seachRender);
      } else {
        await this.loadRols();
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default new RolStore();
