// store/UserStore.js
import { makeAutoObservable, runInAction } from "mobx";
import {
  getAllBd,
  createBd,
  updateBd,
  deleteBd,
  searchBd,
  getDatasBd,
} from "../api/QueryApi";
import Swal from "sweetalert2";

class UserStore {
  // ========== ESTADO INICIAL ==========
  user = {
    id: null,
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    active: true,
  };

  users = [];
  pagination = {
    currentPage: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: null,
    to: null,
  };

  // Estados de UI
  editing = false;
  editId = null;
  hiddenForm = false;
  loading = false;
  saving = false;
  error = null;
  success = null;
  allowPasswordEdit = false;

  // Filtros y búsqueda
  filters = {
    search: "",
    role_id: null,
    status: null,
    per_page: 10,
  };

  constructor() {
    makeAutoObservable(this);
  }

  // ========== SETTERS ==========
  setUser = (user) => {
    this.user = {
      id: null,
      name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: "",
      active: true,
      ...user,
    };
  };

  setUsers = (users) => {
    this.users = Array.isArray(users) ? [...users] : [];
  };

  setEditId = (id) => {
    this.editId = id;
  };

  setHiddenForm = (hiddenForm) => {
    this.hiddenForm = hiddenForm;
  };

  setEditing = (editing) => {
    this.editing = editing;
  };

  setPagination = (pagination) => {
    this.pagination = {
      currentPage: pagination.current_page || pagination.currentPage || 1,
      last_page: pagination.last_page || 1,
      total: pagination.total || 0,
      per_page: pagination.per_page || 10,
      from: pagination.from || null,
      to: pagination.to || null,
    };
  };

  setLoading = (loading) => {
    this.loading = loading;
  };

  setSaving = (saving) => {
    this.saving = saving;
  };

  setError = (error) => {
    this.error = error;
    if (error) {
      setTimeout(() => {
        if (this.error === error) this.error = null;
      }, 5000);
    }
  };

  setSuccess = (success) => {
    this.success = success;
    if (success) {
      setTimeout(() => {
        if (this.success === success) this.success = null;
      }, 3000);
    }
  };

  setAllowPasswordEdit = (allow) => {
    this.allowPasswordEdit = allow;
  };

  setFilters = (filters) => {
    this.filters = { ...this.filters, ...filters };
  };

  // ========== MÉTODOS PRINCIPALES ==========

  /**
   * Cargar lista de usuarios con filtros y paginación
   */
  loadUsers = async (page = 1) => {
    this.setLoading(true);
    this.setError(null);

    try {
      const params = new URLSearchParams({
        page: page,
        per_page: this.filters.per_page,
        ...(this.filters.search && { search: this.filters.search }),
        ...(this.filters.role_id && { role_id: this.filters.role_id }),
        ...(this.filters.status !== null &&
          this.filters.status !== "" && { status: this.filters.status }),
      });

      const response = await getAllBd(`users?${params}`);

      runInAction(() => {
        if (response && response.data) {
          this.setUsers(response.data);
          this.setPagination({
            current_page: response.current_page,
            last_page: response.last_page,
            total: response.total,
            per_page: response.per_page,
            from: response.from,
            to: response.to,
          });
        } else if (Array.isArray(response)) {
          this.setUsers(response);
        }
      });

      return response;
    } catch (error) {
      console.error("Error loading users:", error);
      runInAction(() => {
        this.setError(
          error.response?.data?.message || "Error al cargar usuarios",
        );
      });
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  /**
   * Manejar cambio de página
   */
  handlePaginationChange = async (page) => {
    if (page === this.pagination.currentPage) return;
    await this.loadUsers(page);
  };

  /**
   * Manejar cambio de filtros
   */
  handleFilterChange = async (filters) => {
    this.setFilters(filters);
    await this.loadUsers(1);
  };

  /**
   * Resetear filtros
   */
  resetFilters = async () => {
    this.filters = {
      search: "",
      role_id: null,
      status: null,
      per_page: 10,
    };
    await this.loadUsers(1);
  };

  /**
   * Crear o actualizar usuario
   */
  /**
   * Crear o actualizar usuario con protección contra múltiples llamadas
   */
  addUser = async (data) => {
    // Prevenir ejecución múltiple
    if (this.isAddingUser) {
      console.log("Ya hay una operación de guardado en curso, ignorando...");
      return { success: false, message: "Operación en curso" };
    }

    this.isAddingUser = true;
    this.setSaving(true);
    this.setError(null);

    try {
      let response;

      if (data.id != null) {
        const updateData = { ...data };
        if (!updateData.password || updateData.password === "") {
          delete updateData.password;
          delete updateData.password_confirmation;
        }

        response = await updateBd("users", data.id, updateData);

        runInAction(() => {
          this.setEditing(false);
          this.setEditId(null);
          this.resetUserForm();
          this.setHiddenForm(false);
          this.setAllowPasswordEdit(false);
        });

        Swal.fire({
          title: "Actualizado",
          text: "El usuario se actualizó correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        response = await createBd("users", data);

        runInAction(() => {
          this.resetUserForm();
          this.setHiddenForm(false);
        });

        Swal.fire({
          title: "Registrado",
          text: "El usuario se registró correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // Recargar lista de usuarios
      await this.loadUsers(this.pagination.currentPage);

      return response;
    } catch (error) {
      console.error("Error saving user:", error);

      let errorMessage = "Ocurrió un error al guardar el usuario";

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors.email) {
          errorMessage = "El correo electrónico ya está registrado";
        } else if (errors.name) {
          errorMessage = errors.name[0];
        } else if (errors.password) {
          errorMessage = errors.password[0];
        } else if (errors.role_id) {
          errorMessage = "Debe seleccionar un rol válido";
        } else {
          errorMessage = Object.values(errors).flat()[0];
        }
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
      // Resetear flag después de un pequeño delay
      setTimeout(() => {
        this.isAddingUser = false;
      }, 500);
    }
  };

  /**
   * Cambiar estado activo/inactivo con protección
   */
  toggleUserStatus = async (id, currentStatus) => {
    if (this.isTogglingStatus) {
      console.log("Ya hay una operación de cambio de estado en curso");
      return;
    }

    this.isTogglingStatus = true;
    this.setLoading(true);

    try {
      const response = await updateBd("users", id, { active: !currentStatus });

      Swal.fire({
        title: "Actualizado",
        text: `Usuario ${!currentStatus ? "activado" : "desactivado"} correctamente`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      await this.loadUsers(this.pagination.currentPage);

      return response;
    } catch (error) {
      console.error("Error toggling user status:", error);

      Swal.fire({
        title: "Error",
        text: `No se pudo ${!currentStatus ? "activar" : "desactivar"} el usuario`,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });

      throw error;
    } finally {
      this.setLoading(false);
      setTimeout(() => {
        this.isTogglingStatus = false;
      }, 500);
    }
  };

  /**
   * Eliminar usuario con protección
   */
  removeUser = async (id) => {
    if (this.isDeletingUser) {
      console.log("Ya hay una operación de eliminación en curso");
      return;
    }

    this.isDeletingUser = true;
    this.setLoading(true);

    try {
      await deleteBd("users", id);

      Swal.fire({
        title: "Eliminado",
        text: "El usuario ha sido eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      await this.loadUsers(this.pagination.currentPage);
    } catch (error) {
      console.error("Error deleting user:", error);

      let errorMessage = "No se pudo eliminar el usuario";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });

      throw error;
    } finally {
      this.setLoading(false);
      setTimeout(() => {
        this.isDeletingUser = false;
      }, 500);
    }
  };
  /**
   * Ir a editar usuario
   */
  goEdit = async (user) => {
    if (!user) return;

    this.setLoading(true);

    try {
      // Obtener datos completos del usuario si es necesario
      let userData = user;
      if (!user.role_name && user.id) {
        const response = await searchBd("users", user.id);
        userData = response.data || response;
      }

      const formattedUser = {
        id: userData.id,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        password: "",
        password_confirmation: "",
        role_id: userData.role_id || userData.rol_id || "",
        active: userData.status === 1 || userData.active === true,
      };

      runInAction(() => {
        this.setEditing(true);
        this.setEditId(userData.id);
        this.setUser(formattedUser);
        this.setHiddenForm(true);
        this.setAllowPasswordEdit(true);
      });
    } catch (error) {
      console.error("Error loading user for edit:", error);
      this.setError("Error al cargar los datos del usuario");
    } finally {
      this.setLoading(false);
    }
  };

  /**
   * Eliminar usuario
   */

  /**
   * Buscar usuarios
   */
  searchUsers = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      await this.loadUsers();
      return;
    }

    this.setLoading(true);

    try {
      const response = await searchBd("users", searchTerm);

      runInAction(() => {
        const users = response.data || response || [];
        this.setUsers(users);

        // Actualizar paginación para resultados de búsqueda
        this.setPagination({
          current_page: 1,
          last_page: 1,
          total: users.length,
          per_page: users.length,
          from: 1,
          to: users.length,
        });
      });
    } catch (error) {
      console.error("Error searching users:", error);
      this.setError(error.response?.data?.message || "Error en la búsqueda");
    } finally {
      this.setLoading(false);
    }
  };

  /**
   * Resetear formulario de usuario
   */
  resetUserForm = () => {
    this.user = {
      id: null,
      name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: "",
      active: true,
    };
    this.editId = null;
    this.editing = false;
    this.error = null;
  };

  /**
   * Cancelar edición/creación
   */
  cancelForm = () => {
    this.resetUserForm();
    this.setHiddenForm(false);
    this.setEditing(false);
    this.setAllowPasswordEdit(false);
  };

  /**
   * Obtener usuario por ID
   */
  getUserById = async (id) => {
    this.setLoading(true);

    try {
      const response = await searchBd("users", id);
      const user = response.data || response;
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      this.setError("Error al obtener el usuario");
      return null;
    } finally {
      this.setLoading(false);
    }
  };

  // ========== GETTERS (Propiedades computadas) ==========

  get activeUsers() {
    return this.users.filter(
      (user) => user.active === true || user.status === 1,
    );
  }

  get inactiveUsers() {
    return this.users.filter(
      (user) => user.active === false || user.status === 0,
    );
  }

  get totalUsers() {
    return this.users.length;
  }

  get hasUsers() {
    return this.users.length > 0;
  }

  get isLoading() {
    return this.loading || this.saving;
  }

  get canEdit() {
    return this.editing && !this.saving;
  }

  get canCreate() {
    return !this.editing && !this.saving;
  }
}

export default new UserStore();
