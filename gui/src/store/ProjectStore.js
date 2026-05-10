import { makeAutoObservable } from "mobx";
import {
  getAllBd,
  createBd,
  updateBd,
  deleteBd,
  searchBd,
  getDatasBd,
  getDataById,
} from "../api/QueryApi";
import Swal from "sweetalert2";

class ProjectStore {
  project = {
    id: null,
    name: "",
    location: "sin especificar",
    latitud: "000.000000",
    longitud: "000.000000",
  };

  projects = [];
  pagination = {};
  editing = false;
  editId = null;
  hiddenForm = false;
  

  constructor() {
    makeAutoObservable(this);
  }

  setProject = (project) => {
    this.project = project;
  };

  setProjects = (projects) => {
    this.projects = projects;
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
    const pagCurrent = await getDatasBd("projects?page=" + page);
    console.log(pagCurrent);
    if (pagCurrent) {
      this.setProjects(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loadProjects = async () => {
    try {
      const data = await getAllBd("projects");
      let Projects = data.data;
      
      delete data.data;
      this.setPagination(data);
      this.setProjects(Projects);
      return Projects
    } catch (error) {
      console.log(error);
    }
  };


  addProject = async (project) => {
  
    try {
      if (this.editing) {
        this.project.id = this.editId;
        await updateBd("projects", this.editId, project);
        this.setEditing(false);
        this.setEditId(null);
        this.setProject({ ...this.project, id: null });
        this.loadProjects();
        this.setHiddenForm(false);
      } else {
        const newProject = await createBd("projects",project);
        this.setEditId(null);
        this.setEditing(false);
        this.loadProjects();
        this.setHiddenForm(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Pryecto",
        text: "Error al registrar proyecto",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  goEdit = async (Project) => {
    Project.rol = Project.rol_id;
    delete Project.rol_id;
    Project.active = Project.status !== 0 ? true : false;
    delete Project.status;
    delete Project.created_at;
    delete Project.updated_at;

    this.setEditing(true);
    this.setEditId(Project.id);
    this.setProject(Project);
    this.setHiddenForm(true);
    //navigate(`/usuarios/editar/${Project.id}`);
  };

  removeProject = async (id) => {
    try {
      await deleteBd("projects", id);
      //let updatedProjects = this.projects.filter((u) => u.id !== id);
      await this.loadProjects();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setProjects([]);
        let seachRender = await searchBd(table, value);
        let Projects = seachRender;
        this.setProjects(Projects);
      } else {
        await this.loadProjects();
      }
    } catch (error) {
      console.log(error);
    }
  };

 
}

export default new ProjectStore();
