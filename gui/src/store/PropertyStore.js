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
  searchBdFilter,
  getFilteredBd,
  setUrlExportXls,
  setUrlExportPdf,
} from "../api/QueryApi";
import Swal from "sweetalert2";
import changeFormat from "../helper/changeFormat";

class PropertyStore {
  property = {
    id: null,
    project_id: null,
    stage_id: null,
    block_id: null,
    name: "",
    description: "",
    m2: 0.0,
    address: "",
    latitude: "",
    longitude: "",
    amount_init: 0.0,
    amount_end: 0.0,
    status: "disponible",
    boundaries: [],
  };

  urlImp = "";
  properties = [];
  projects = []; // Opciones del select de proyectos
  stages = []; // Opciones del select de etapas
  blocks = []; // Opciones del select de bloques

  selectedProject = "";
  selectedStage = "";
  selectedBlock = "";

  isLoading = false;

  pagination = {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: null,
    to: null,
  };

  filters = {
    search: "",
    block_id: "",
    stage_id: "",
    project_id: "",
    paytype: "",
    date_from: "",
    date_to: "",
  };
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
  setProperty = (property) => {
    this.property = property;
  };
  setSelectedProject(id) {
    this.selectedProject = id;
  }

  setSelectedStage(id) {
    this.selectedStage = id;
  }

  setSelectedBlock(id) {
    this.selectedBlock = id;
  }

  setFilters = (filters) => {
    this.filters = { ...this.filters, ...filters };
  };
  setStages(stages) {
    this.stages = stages;
  }
  setBlocks(blocks) {
    this.blocks = blocks;
  }
  setProjects(projects) {
    this.projects = projects;
  }
  setProperties = (properties) => {
    this.properties = properties;
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

  handlePaginationChange = async (value, filters) => {
    let pagCurrent = await this.loadProperties(parseInt(value), filters);
    
    if (pagCurrent) {
      return pagCurrent;
    }
  };
  consolidate = async (e) => {
    e.preventDefault();
    const data = await getDatasBd("properties/consolidate");
    
    const updte =await this.loadProperties(1,{page:1});

    return updateBd
  
  };

  loadProperties = async (page, filters) => {
    try {
      if (page != undefined) {
        let params = new URLSearchParams({
          page: page,
          ...filters,
        });

        const data = await getFilteredBd("properties?", params);

        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  filterProperty = async (filters) => {
    try {
      const data = await searchBdFilter("properties", filters);
      this.setPagination(data);
      this.setProperties(data.data);
      this.setFilter(filters);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  addProperty = async (data) => {
    try {
      const resp = await Swal.fire({
        title: "Desea guardar los cambios?",
        text: "Esta acción registra un nuevo Lote.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "rgb(176, 221, 51)",
        cancelButtonColor: "#3085d6",
      });
      console.log(data)
      data.amount_init = changeFormat.toInt(data.amount_init);
      
      if (resp.isConfirmed) {
        if (data.id !== null) {
          await updateBd("properties", data.id, data);
          if (data.boundaries!== undefined && data.boundaries.length > 0) {
            data.boundaries.forEach((boundary) => {
              boundary.property_id = data.id;
              if (boundary.id !== null) {
                updateBd("boundaries", boundary.id, boundary);
              } else {
                createBd("boundaries", boundary);
              }
            });
          }

          Swal.fire({
            title: "Guardado",
            text: "Se actualizo correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          this.setProperty({
            id: 0,
            project_id: 0,
            stage_id: 0,
            block_id: 0,
            name: "",
            description: "",
            m2: 0.0,
            address: "",
            amount_init: 0.0,
            amount_end: 0.0,
            status: "disponible",
            boundaries: [],
          });
          this.setHiddenForm(false);
          this.setEditing(false);
          this.loadProperties();
        } else {
          console.log(data);

          await createBd("properties", data);

          Swal.fire({
            title: "Registrado",
            text: "El Lote se registro correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          this.setProperty({
            id: null,
            project_id: null,
            stage_id: null,
            block_id: null,
            name: "",
            description: "",
            m2: 0.0,
            address: "",
            amount_init: 0.0,
            amount_end: 0.0,
            status: "disponible",
            boundaries: [],
          });
          this.setHiddenForm(false);
          this.setEditing(false);
          this.loadProperties();
        }
      }
    } catch (error) {
    console.log(error);
      Swal.fire({
        title: "Error",
        text: "error al guardar el lote",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

   toExportExcel = async (url, namedoc, data) => {
      return setUrlExportXls(url, namedoc, data);
    };

      toExport = (url, data) => {
        
        return setUrlExportPdf(url, data);
      };

  importXlsProperties = async () => {
    try {
      const importData = await setUrImport(
        "/api/properties/import",
        this.urlImp,
      );
      await this.loadProperties();
      return importData;
    } catch (error) {
      console.log(error);
    }
  };

  removeProperty = async (id) => {
    try {
      await deleteBd("properties", id);

      await this.loadProperties();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setProperties([]);
        let seachRender = await searchBd(table, value);
        this.setProperties(seachRender);
      } else {
        await this.loadProperties();
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default new PropertyStore();
