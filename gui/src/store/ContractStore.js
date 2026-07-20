// store/ContractStore.js
import { makeAutoObservable, runInAction } from "mobx";
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
  // Estado del formulario
  contract = {
    id: null,
    buyer_id: "",
    seller_id: "",
    agent_id: "",
    property_id: "",
    plazo: "",
    advance: "",
    paytype: "Contado",
    ref: "",
    status: "pendiente",
    date: new Date().toISOString().split("T")[0],
  };

  // Lista de contratos
  contracts = [];

  // Estados de UI
  editing = false;
  editId = null;
  hiddenForm = false;
  loading = false;
  saving = false;
  error = null;

  // Paginación
  pagination = {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: null,
    to: null,
  };

  // Filtros
  filters = {
    search: "",
    status: "",
    paytype: "",
    date_from: "",
    date_to: "",
  };

  // Estadísticas
  statistics = {
    total: 0,
    pendiente: 0,
    activo: 0,
    completado: 0,
    cancelado: 0,
    total_amount: 0,
    monthly_contracts: [],
  };

  // Búsqueda
  searchInpt = {
    cliente: "text",
    propietario: "text",
    agente: "text",
    lote: "text",
  };

  queryTable = [];
  query = "";
  searchEdit = null;
  urlImp = "";
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // ========== SETTERS ==========
  setContract = (contract) => {
    this.contract = {
      id: null,
      buyer_id: "",
      seller_id: "",
      agent_id: "",
      property_id: "",
      plazo: "",
      advance: "",
      paytype: "Contado",
      ref: "",
      status: "pendiente",
      date: new Date().toISOString().split("T")[0],
      ...contract,
    };
  };

  setContracts = (contracts) => {
    this.contracts = Array.isArray(contracts) ? [...contracts] : [];
  };

  setEditing = (editing) => {
    this.editing = editing;
  };

  setEditId = (id) => {
    this.editId = id;
  };

  setHiddenForm = (hiddenForm) => {
    this.hiddenForm = hiddenForm;
  };

  setLoading = (loading) => {
    this.loading = loading;
  };

  setSaving = (saving) => {
    this.saving = saving;
  };

  setError = (error) => {
    this.error = error;
  };

  setPagination = (pagination) => {
    this.pagination = {
      current_page: pagination.current_page || pagination.currentPage || 1,
      last_page: pagination.last_page || pagination.lastPage || 1,
      total: pagination.total || 0,
      per_page: pagination.per_page || pagination.perPage || 10,
      from: pagination.from || null,
      to: pagination.to || null,
    };
  };

  setFilters = (filters) => {
    this.filters = { ...this.filters, ...filters };
  };

  setStatistics = (statistics) => {
    this.statistics = { ...this.statistics, ...statistics };
  };

  setQuery = (q) => {
    this.query = q;
  };

  setSearchInput = (q) => {
    this.searchInpt = { ...this.searchInpt, ...q };
  };

  setSearchEdit = (search) => {
    this.searchEdit = search;
  };

  setQueryTable = (qt) => {
    this.queryTable = qt;
  };

  setUrlImp = (url) => {
    this.urlImp = url;
  };

  setSelectedProject = (id) => {
    this.selectedProject = id;
  };

  setSelectedStage = (id) => {
    this.selectedStage = id;
  };

  setSelectedBlock = (id) => {
    this.selectedBlock = id;
  };

  // ========== ACCIONES PRINCIPALES ==========

  /**
   * Cargar lista de contratos con filtros y paginación
   */
  loadContracts = async (page = 1) => {
    this.setLoading(true);
    this.setError(null);

    try {
      const params = new URLSearchParams({
        page: page,
        per_page: this.pagination.per_page,
      });

      const response = await getAllBd(`contracts?${params}`);

      runInAction(() => {
        if (response && response.data) {
          this.setContracts(response.data);
          this.setPagination({
            current_page: response.current_page,
            last_page: response.last_page,
            total: response.total,
            per_page: response.per_page,
            from: response.from,
            to: response.to,
          });
        }
      });

      return response;
    } catch (error) {
      console.error("Error loading contracts:", error);
      runInAction(() => {
        this.setError(
          error.response?.data?.message || "Error al cargar contratos",
        );
      });
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  /**
   * Búsqueda con debounce
   */
  setSearchTerm = (term) => {
    // Limpiar timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Actualizar el filtro inmediatamente
    this.filters.search = term;

    // Debounce para la búsqueda (esperar 500ms después de que el usuario deje de escribir)
    this.searchTimeout = setTimeout(() => {
      this.loadContracts(1);
    }, 500);
  };

  /**
   * Limpiar búsqueda
   */
  clearSearch = () => {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.filters.search = "";
    this.loadContracts(1);
  };

  /**
   * Cambiar filtro por estado
   */
  setStatusFilter = (status) => {
    this.filters.status = status;
    this.loadContracts(1);
  };

  /**
   * Cambiar filtro por tipo de pago
   */
  setPaytypeFilter = (paytype) => {
    this.filters.paytype = paytype;
    this.loadContracts(1);
  };

  /**
   * Cambiar filtro por fechas
   */
  setDateFilter = (dateFrom, dateTo) => {
    this.filters.date_from = dateFrom;
    this.filters.date_to = dateTo;
    this.loadContracts(1);
  };

  /**
   * Limpiar todos los filtros
   */
  clearAllFilters = () => {
    this.filters = {
      search: "",
      status: "",
      paytype: "",
      date_from: "",
      date_to: "",
    };
    this.loadContracts(1);
  };

  /**
   * Cambiar página
   */
  changePage = async (page) => {
    if (page === this.pagination.current_page) return;
    await this.loadContracts(page);
  };

  /**
   * Cambiar número de registros por página
   */
  changePerPage = async (perPage) => {
    this.pagination.per_page = perPage;
    await this.loadContracts(1);
  };

  /**
   * Cargar estadísticas
   */

  loadStatistics = async () => {
    try {
      const response = await getAllBd("contracts/statistics");

      runInAction(() => {
        if (response && response.data) {
          this.setStatistics(response.data);
        }
      });

      return response;
    } catch (error) {
      console.error("Error loading statistics:", error);
      return null;
    }
  };

  /**
   * Mostrar contrato específico
   */
  showContract = async (table, id) => {
    try {
      const response = await showDataBd(table, id);
      if (response && response.data) {
        this.setContract(response.data.contract || response.data);
        return response;
      }
      return null;
    } catch (error) {
      console.error("Error showing contract:", error);
      return null;
    }
  };

  /**
   * Crear o actualizar contrato
   */
  addContract = async (data) => {
    this.setSaving(true);
    this.setError(null);

    try {
      // Formatear datos
      const formattedData = {
        ...data,
        advance: changeFormat.toInt(data.advance),
      };

      let response;

      if (data.id !== null) {
        // Actualizar contrato existentes
        response = await updateBd("contracts", data.id, formattedData);

        runInAction(() => {
          this.setEditing(false);
          this.setEditId(null);
          this.resetForm();
          this.setHiddenForm(false);
        });

        Swal.fire({
          title: "Actualizado",
          text: "Contrato actualizado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Crear nuevo contrato
        response = await createBd("contracts", formattedData);

        runInAction(() => {
          this.resetForm();
          this.setHiddenForm(false);
        });

        Swal.fire({
          title: "Registrado",
          text: "Contrato registrado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // Recargar datos
      await this.loadContracts(this.pagination.current_page);
      await this.loadStatistics();

      return response;
    } catch (error) {
      console.error("Error saving contract:", error);

      let errorMessage = "Error al guardar el contrato";

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat()[0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      runInAction(() => {
        this.setError(errorMessage);
      });

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });

      throw error;
    } finally {
      runInAction(() => {
        this.setSaving(false);
      });
    }
  };

  /**
   * Eliminar contrato
   */
  deleteContract = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar contrato?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      this.setLoading(true);

      try {
        await deleteBd("contracts", id);

        Swal.fire({
          title: "Eliminado",
          text: "Contrato eliminado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        await this.loadContracts(this.pagination.current_page);
        await this.loadStatistics();
      } catch (error) {
        console.error("Error deleting contract:", error);

        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el contrato",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        this.setLoading(false);
      }
    }
  };

  /**
   * Manejar cambio de página
   */
  handlePaginationChange = async (page) => {
    if (page === this.pagination.current_page) return;
    await this.loadContracts(page);
  };

  /**
   * Manejar cambio de filtros
   */
  handleFilterChange = async (filters) => {
    console.log(filters);
    this.setFilters(filters);

    await this.loadContracts(1);
  };

  /**
   * Resetear filtros
   */
  resetFilters = async () => {
    this.filters = {
      search: "",
      status: "",
      paytype: "",
      date_from: "",
      date_to: "",
    };
    await this.loadContracts(1);
  };

  /**
   * Ir a editar contrato
   */
  goEdit = async (contract) => {
    if (!contract) return;

    this.setLoading(true);

    try {
      // Obtener datos completos del contrato
      const response = await this.showContract("contracts", contract.id);

      if (response && response.data) {
        const contractData = response.data.contract || response.data;

        const formattedContract = {
          id: contractData.id,
          buyer_id: contractData.buyer_id,
          seller_id: contractData.seller_id,
          agent_id: contractData.agent_id,
          property_id: contractData.property_id,
          plazo: contractData.plazo,
          advance: contractData.advance,
          paytype: contractData.paytype,
          ref: contractData.ref || "",
          status: contractData.status,
          date: contractData.date,
        };

        runInAction(() => {
          this.setEditing(true);
          this.setEditId(contractData.id);
          this.setContract(formattedContract);
          this.setHiddenForm(true);
        });
      }
    } catch (error) {
      console.error("Error loading contract for edit:", error);
      this.setError("Error al cargar los datos del contrato");
    } finally {
      this.setLoading(false);
    }
  };

  /**
   * Resetear formulario
   */
  resetForm = () => {
    this.contract = {
      id: null,
      buyer_id: "",
      seller_id: "",
      agent_id: "",
      property_id: "",
      plazo: "",
      advance: "",
      paytype: "Contado",
      ref: "",
      status: "pendiente",
      date: new Date().toISOString().split("T")[0],
    };
    this.editing = false;
    this.editId = null;
    this.error = null;
  };

  /**
   * Cancelar edición/creación
   */
  cancelForm = () => {
    this.resetForm();
    this.setHiddenForm(false);
    this.setEditing(false);
  };

  /**
   * Exportar contratos
   */
  exportContracts = async () => {
    try {
      const params = new URLSearchParams({
        ...(this.filters.search && { search: this.filters.search }),
        ...(this.filters.status && { status: this.filters.status }),
        ...(this.filters.paytype && { paytype: this.filters.paytype }),
      });

      const response = await getAllBd(`contracts/export?${params}`);

      // Crear y descargar archivo JSON
      const dataStr = JSON.stringify(response, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileDefaultName = `contracts_${new Date().toISOString()}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      Swal.fire({
        title: "Exportado",
        text: "Contratos exportados correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      return response;
    } catch (error) {
      console.error("Error exporting contracts:", error);
      Swal.fire({
        title: "Error",
        text: "Error al exportar contratos",
        icon: "error",
      });
      throw error;
    }
  };

  /**
   * Buscar contratos
   */
  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    this.setFilters({ search: value });
    await this.loadContracts(1);
  };

  /**
   * Búsqueda avanzada
   */
  seachQueryData = async (table, name) => {
    this.setQueryTable([]);
    let searchRender = await searchBd(table, name);
    return searchRender;
  };

  /**
   * Seleccionar datos de búsqueda
   */
  setData = async (e, data, fn) => {
    e.preventDefault();
    const { id } = e.target;

    switch (id) {
      case "lote":
        fn(data);
        this.setQueryTable([]);
        this.setSearchInput({ ...this.searchInpt, lote: "hidden" });
        break;
      case "agente":
        fn(data);
        this.setQueryTable([]);
        this.setSearchInput({ ...this.searchInpt, agente: "hidden" });
        break;
      case "propietario":
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

  /**
   * Exportar a PDF
   */
  toExport = (url, nameDoc, data) => {
    return setUrlExportPdf(url, nameDoc, data);
  };

  /**
   * Importar contratos desde Excel
   */
  importXlsContracts = async () => {
    try {
      const importData = await setUrImport(
        "/api/contracts/import",
        this.urlImp,
      );
      await this.loadContracts();
      await this.loadStatistics();

      Swal.fire({
        title: "Importado",
        text: "Contratos importados correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      return importData;
    } catch (error) {
      console.error("Error importing contracts:", error);
      Swal.fire({
        title: "Error",
        text: "Error al importar contratos",
        icon: "error",
      });
      throw error;
    }
  };

  // ========== GETTERS ==========

  get activeContracts() {
    return this.contracts.filter((c) => c.status === "activo");
  }

  get pendingContracts() {
    return this.contracts.filter((c) => c.status === "pendiente");
  }

  get completedContracts() {
    return this.contracts.filter((c) => c.status === "completado");
  }

  get cancelledContracts() {
    return this.contracts.filter((c) => c.status === "cancelado");
  }

  get totalAmount() {
    return this.contracts.reduce(
      (sum, c) => sum + (c.property?.amount_init || 0),
      0,
    );
  }

  get getIsLoading() {
    return this.loading || this.saving;
  }

  get canEdit() {
    return this.editing && !this.saving;
  }

  get canCreate() {
    return !this.editing && !this.saving;
  }

  get hasContracts() {
    return this.contracts.length > 0;
  }
}

export default new ContractStore();
