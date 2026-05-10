import { makeAutoObservable } from "mobx";
import {
  getAllBd,
  createBd,
  updateBd,
  deleteBd,
  searchBd,
  getDatasBd,getDataById
} from "../api/QueryApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

class StageStore {
  stage = {
    id: null,
    name: "",
    project_id: '0',
  };

  stages = [];
  pagination = {};
  editing = false;
  editId = null;
  hiddenForm = false;
  

  constructor() {
    makeAutoObservable(this);
  }

  setStage = (stage) => {
    this.stage = stage;
  };

  setStages = (stages) => {
    this.stages = stages;
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
    const pagCurrent = await getDatasBd("stages?page=" + page);
    console.log(pagCurrent);
    if (pagCurrent) {
      this.stages(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  getStages = async () => {
    try {
      const data = await getAllBd("stages");
      let Stages = data.data;
      delete data.data;
      this.setPagination(data);
      this.setStages(Stages);
      return Stages;
      
    } catch (error) {
      console.log(error);
    }
  };

    getStagesByProject = async (project_id) => {
    try {
      const data = await getDataById("projects", project_id ,"stages");
      let Stages = data;
      return Stages;
    } catch (error) {
      console.log(error);
    }
  }

  addStage = async (Stage) => {
  
    try {
      if (this.editing) {
        this.setStage({ ...this.stage, id: this.editId });
        await updateBd("stages", this.editId, Stage);
        toast.success("Etapa actualizada correctamente");
        this.setEditing(false);
        this.setEditId(null);
        this.setStage({ ...this.stage, id: null });
        this.getStages();
        this.setHiddenForm(false);
      } else {
        await createBd("stages",Stage);
        toast.success("Etapa creada correctamente");
        this.setEditId(null);
        this.setEditing(false);
        this.getStages();
        this.setHiddenForm(false);
      }
    } catch (error) {
    toast.error("Error al guardar la etapa");
      console.log(error);
    }
  };

  goEdit = async (Stage) => {
  
    this.setEditing(true);
    this.setEditId(Stage.id);
    this.setStage(Stage);
    this.setHiddenForm(true);
  };

  deleteStage = async (id) => {
    try {
      await deleteBd("stages", id);
      //let Stages = this.Stages.filter((u) => u.id !== id);
      await this.getStages();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setStages([]);
        let seachRender = await searchBd(table, value);
     
        this.setStages(seachRender);
      } else {
        this.getStages();
      }
    } catch (error) {
      console.log(error);
    }
  };

 
}

export default new StageStore();
