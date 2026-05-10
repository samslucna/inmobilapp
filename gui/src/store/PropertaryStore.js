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
class PropertaryStore {
  propertary = {
    id: null,
    name: "",
    lastnames: "",
    phone: "",
    email: "",
    dni: "",
  };
  urlImp = "";
  propertaries = [];
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
  setPropertary = (propertary) => {
    this.propertary = propertary;
  };

  setPropertaries = (propertaries) => {
    this.propertaries = propertaries;
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
    const pagCurrent = await getDatasBd("seller?page=" + page);
    if (pagCurrent) {
      this.setPropertaries(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loadPropertaries = async () => {
    try {
      const data = await getAllBd("sellers");

      this.setPagination(data);
      this.setPropertaries(data.data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  addproperty = async (data) => {
    try {
      const resp = await Swal.fire({
        title: "Desea guardar los cambios?",
        text: "Esta acción guardara los cambios",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (data.id !== null) {
        await updateBd("sellers", this.editId, data);
        Swal.fire({
          title: "Guardado",
          text: "Se guardo correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        this.setPropertary({
          id: null,
          name: "",
          lastnames: "",
          phone: "",
          email: "",
          dni: "",
        });
        this.setHiddenForm(false);
        this.setEditing(false);
        this.loadPropertaries();
      } else {
        if (resp.isConfirmed) {
          await createBd("sellers", data);
          Swal.fire({
            title: "Registrado",
            text: "Se registro correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          this.setPropertary({
            id: null,
            name: "",
            lastnames: "",
            phone: "",
            email: "",
            dni: "",
          });
          this.setHiddenForm(false);
          this.setEditing(false);
          this.loadPropertaries();
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Algo salio mal al guardar los cambios",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  importXlsPropertaries = async () => {
    try {
      let imports = await setUrImport("/api/sellers/import", this.urlImp);
      console.log(imports);
      await this.loadPropertaries();
      return imports;
    } catch (error) {
      console.log(error);
    }
  };

  goEdit = async (propertary) => {
    this.setEditing(true);
    this.setEditId(propertary.id);
    this.setPropertary(propertary);
    this.setHiddenForm(true);
    //navigate(`/usuarios/editar/${property.id}`);
  };

  removePropertary = async (id) => {
    try {
      await deleteBd("sellers", id);

      await this.loadPropertaries();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setPropertaries([]);
        let seachRender = await searchBd(table, value);

        this.setPropertaries(seachRender);
      } else {
        await this.loadPropertaries();
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default new PropertaryStore();
