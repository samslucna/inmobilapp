import { makeAutoObservable } from "mobx";
import {
  getAllBd,
  createBd,
  updateBd,
  deleteBd,
  searchBd,
  getDatasBd,
  setUrImport,
  getDataById,
} from "../api/QueryApi";
import Swal from "sweetalert2";

class BoundaryStore {
  boundary = {
    id: null,
    name: "",
    description: "",
    m2: 0.0,
    property_id: null,
  };

  urlImp = "";
  Boundaries = [];
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
  setBoundary = (boundary) => {
    this.boundary = boundary;
  };

  setBoundaries = (boundaries) => {
    this.Boundaries = boundaries;
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
    const pagCurrent = await getDatasBd("Boundaries?page=" + page);
    if (pagCurrent) {
      this.setBoundaries(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loaBoundaries = async () => {
    try {
      const data = await getAllBd("Boundaries");

      this.setPagination(data);
      this.setBoundaries(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  loadAux = async () => {
    try {
      this.setBoundaries(this.Boundaries);
    } catch (error) {
      console.log(error);
    }
  };

  addBoundary = async (data) => {
    try {
      if (data.id !== null) {
        await updateBd("boundaries", this.editId, data);
        this.setBoundary({
          id: null,
          property_id: null,
          name: "",
          description: "",
          m2: 0.0,
        });
        this.setHiddenForm(false);
        this.setEditing(false);
      } else {
        await createBd("boundaries", data);

        this.setBoundary({
          id: null,
          project_id: null,
          name: "",
          description: "",
          m2: 0.0,
        });
        this.setHiddenForm(false);
        this.setEditing(false);
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

  getBoundaryByProperty = async (property_id) => {
    try {
      const data = await getDataById("properties", property_id, "boundaries");
      let boundaries = data;
      this.setBoundaries(data);
      return boundaries;
    } catch (error) {
      console.log(error);
    }
  };
  addListBoundary = async (boundary) => {
    this.setBoundaries([...this.Boundaries, boundary]);
    this.setHiddenForm(false);
    this.setEditing(false);
  };

  removeListBoundary = (id) => {
    const newList = this.Boundaries.filter(
      (boundary) => parseInt(boundary.index) !== parseInt(id),
    );
    console.log(newList);
    return newList;
  };

  impBoundaries = async () => {
    try {
      await setUrImport("/api/Boundaries/import", this.urlImp);
      await this.loaBoundaries();
    } catch (error) {
      console.log(error);
    }
  };

  goEdit = async (Boundary) => {
    console.log(Boundary);
    this.setEditing(true);
    this.setEditId(Boundary.id);
    this.setBoundary(Boundary);
    this.setHiddenForm(true);
    //navigate(`/usuarios/editar/${Boundary.id}`);
  };

  removeBoundary = async (id) => {
    try {
      await deleteBd("boundaries", id);

    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setBoundaries([]);
        let seachRender = await searchBd(table, value);

        this.setBoundaries(seachRender);
      } else {
        await this.loaBoundaries();
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default new BoundaryStore();
