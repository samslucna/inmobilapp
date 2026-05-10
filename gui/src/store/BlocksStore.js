import { makeAutoObservable } from "mobx";
import {
  getAllBd,
  createBd,
  updateBd,
  deleteBd,
  searchBd,
  getDatasBd,
  getDataById
} from "../api/QueryApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

class BlockStore {
  block = {
    id: null,
    name: "",
    project_id: '0',
  };

  blocks = [];
  pagination = {};
  editing = false;
  editId = null;
  hiddenForm = false;
  

  constructor() {
    makeAutoObservable(this);
  }

  setBlock = (block) => {
    this.block = block;
  };

  setBlocks = (blocks) => {
    this.blocks = blocks;
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
      this.setBlocks(pagCurrent.data);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  getBlocks = async () => {
    try {
      const data = await getAllBd("blocks");
      let blocks = data.data;
      delete data.data;
      this.setPagination(data);
      this.setBlocks(blocks);
      return blocks
    } catch (error) {
      console.log(error);
    }
  };

  getBlocksByStage = async (stage_id) => {
    try {
      const data = await getDataById("stages", stage_id, "blocks");
      let blocks = data;
      return blocks;
    } catch (error) {
      console.log(error);
    }
  };


  addBlock = async (block) => {
  
    try {
      if (this.editing) {
        this.setBlock({ ...this.block, id: this.editId });
        await updateBd("blocks", this.editId, block);
        toast.success("Manzana actualizada correctamente");
        this.setEditing(false);
        this.setEditId(null);
        this.setBlock({ ...this.block, id: null });
        this.getBlocks();
        this.setHiddenForm(false);
      } else {
        await createBd("blocks",block);
        toast.success("Manzana creada correctamente");
        this.setEditId(null);
        this.setEditing(false);
        this.getBlocks();
        this.setHiddenForm(false);
      }
    } catch (error) {
    toast.error("Error al guardar la manzana");
      console.log(error);
    }
  };

  goEdit = async (block) => {
    
    this.setEditing(true);
    this.setEditId(block.id);
    this.setBlock(block);
    this.setHiddenForm(true);
  };

  deleteBlock = async (id) => {
    try {
      await deleteBd("blocks", id);
      //let Blocks = this.Blocks.filter((u) => u.id !== id);
      await this.getBlocks();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setBlocks([]);
        let seachRender = await searchBd(table, value);
     
        this.setBlocks(seachRender);
      } else {
        this.getBlocks();
      }
    } catch (error) {
      console.log(error);
    }
  };

 
}

export default new BlockStore();
