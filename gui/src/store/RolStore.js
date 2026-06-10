// store/RolStore.js
import { makeAutoObservable, runInAction } from "mobx";
import {
  getAllBd,
  createBd,
  updateBd,
  deleteBd,
  searchBd,
  getDatasBd,
  setUrImport,
  showDataBd,
  getFilteredBd,
  updateBdRol,
} from "../api/QueryApi";
import Swal from "sweetalert2";

class RolStore {
  rol = {
    id: null,
    name: "",
    guard_name: "web",
  };

  permission = {
    id: null,
    modulo: "modulo",
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  permissions = [];
  originalPermissions = []; // Para guardar copia original y poder revertir
  urlImp = "";
  rols = [];
  pagination = {};
  editing = false;
  editId = null;
  hiddenForm = false;
  loading = true;
  saving = false; // Estado para guardar
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  // ========== SETTERS BÁSICOS ==========
  setUrlImp = (url) => {
    this.urlImp = url;
  };

  setLoading = (load) => {
    this.loading = load;
  };

  setSaving = (saving) => {
    this.saving = saving;
  };

  setError = (error) => {
    this.error = error;
  };

  setRol = (rol) => {
    this.rol = rol;
  };

  setRols = (rols) => {
    this.rols = rols;
  };

  setPermission = (permission) => {
    this.permission = permission;
  };

  // 🔑 MÉTODO CORREGIDO: Actualizar permisos de forma inmutable
  setPermissions = (permissions) => {
    // Asegurar que sea un nuevo array (MobX detectará el cambio)
    this.permissions = Array.isArray(permissions) ? [...permissions] : [];
  };

  // Guardar copia original de permisos (para revertir si hay error)
  setOriginalPermissions = (permissions) => {
    this.originalPermissions = Array.isArray(permissions)
      ? JSON.parse(JSON.stringify(permissions))
      : [];
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

  // ========== MÉTODOS PRINCIPALES ==========
  handlePaginationChange = async (page) => {
    this.setLoading(true);
    try {
      const pagCurrent = await getDatasBd("rols?page=" + page);
      if (pagCurrent && pagCurrent.data) {
        runInAction(() => {
          this.setRols(pagCurrent.data);
          delete pagCurrent.data;
          this.setPagination(pagCurrent);
        });
      }
    } catch (error) {
      console.error("Error en paginación:", error);
    } finally {
      this.setLoading(false);
    }
  };

  loadRols = async () => {
    this.setLoading(true);
    try {
      const data = await getAllBd("roles");
      runInAction(() => {
        if (data && data.data) {
          this.setPagination(data);
          this.setRols(data.data);
        } else if (Array.isArray(data)) {
          this.setRols(data);
        }
      });
    } catch (error) {
      console.error("Error loading roles:", error);
      runInAction(() => {
        this.setError(error.message);
      });
    } finally {
      this.setLoading(false);
    }
  };

  // Cargar permisos de un rol específico
  loadPermissionsByRole = async (roleId) => {
    this.setLoading(true);
    try {
      const response = await getFilteredBd("roles", roleId); // Ajusta según tu API
      if (response && response.permissions) {
        const formattedPermissions = this.rebuildObjectBool(
          response.permissions,
        );
        runInAction(() => {
          this.setPermissions(formattedPermissions || []);
          this.setOriginalPermissions(formattedPermissions || []);
          this.setRol({
            id: response.id,
            name: response.name,
            guard_name: response.guard_name || "web",
          });
        });
        return formattedPermissions;
      }
    } catch (error) {
      console.error("Error loading permissions:", error);
      runInAction(() => {
        this.setError(error.message);
      });
    } finally {
      this.setLoading(false);
    }
  };

  showData = async (table, id) => {
    try {
      const permission = await searchBd("roles", id);
      return permission;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  getPermissionActive = (data) => {
    const permissions = data.permissions;
    const rol = data;
    const getPermissions = this.rebuildObjectBool(permissions);
    runInAction(() => {
      this.setRol({
        id: data.id,
        name: data.name,
        guard_name: data.guard_name || "web",
      });
      this.setPermissions(getPermissions || []);
      this.setOriginalPermissions(getPermissions || []);
    });
    return getPermissions;
  };

  rebuildObjectBool = (permissionArray) => {
    if (!permissionArray || permissionArray.length === 0) return [];

    const permissionString = permissionArray.map((permission) => {
      return permission.name;
    });

    const permissionsFormat = this.procesarMultiplesPermisos(permissionString);
    return permissionsFormat;
  };

  procesarMultiplesPermisos = (permisosArray) => {
    const accionesEstandar = ["create", "read", "update", "delete"];
    const infoModulos = {};
    let idContador = 1;

    permisosArray.forEach((permisoString) => {
      const [nombreModulo, accion] = permisoString.split(".");

      if (!infoModulos[nombreModulo]) {
        infoModulos[nombreModulo] = {
          id: idContador++,
          module: nombreModulo,
          create: false,
          read: false,
          update: false,
          delete: false,
        };
      }

      if (accionesEstandar.includes(accion)) {
        infoModulos[nombreModulo][accion] = true;
      }
    });

    return Object.values(infoModulos);
  };

  // 🔑 MÉTODO CORREGIDO: Actualizar permisos de un rol
  // En RolStore.js
  updateRolePermissions = async (roleData) => {
    this.setSaving(true);
    this.setError(null);

    try {
      console.log("🔄 Store - Enviando actualización:", roleData);

      // Asegurar el formato correcto
      const formattedData = {
        id: roleData.id,
        name: roleData.name,
        permissions: roleData.permissions.map((p) => ({
          module: p.module,
          create:
            p.create === true ||
            p.create === 1 ||
            p.create === "1" ||
            p.create === "true",
          read:
            p.read === true ||
            p.read === 1 ||
            p.read === "1" ||
            p.read === "true",
          update:
            p.update === true ||
            p.update === 1 ||
            p.update === "1" ||
            p.update === "true",
          delete:
            p.delete === true ||
            p.delete === 1 ||
            p.delete === "1" ||
            p.delete === "true",
        })),
      };

      // Usar updateBdRol en lugar de updateBd
      const response = await updateBdRol("roles/update", formattedData);

      console.log("🔄 Store - Respuesta recibida:", response);

      if (response && response.success) {
        // Actualizar permisos con la respuesta del servidor
        if (response.data && response.data.permissions_by_module) {
          runInAction(() => {
            this.setPermissions(response.data.permissions_by_module);
            this.setOriginalPermissions(response.data.permissions_by_module);
          });
        }

        return response;
      } else {
        throw new Error(response?.message || "Error al actualizar");
      }
    } catch (error) {
      console.error("❌ Store - Error:", error);

      runInAction(() => {
        this.setError(error.response?.data?.message || error.message);
      });

      throw error;
    } finally {
      runInAction(() => {
        this.setSaving(false);
      });
    }
  };
  // 🔑 MÉTODO CORREGIDO: Guardar rol (crear o actualizar)
  addRol = async (data) => {
    this.setSaving(true);

    try {
      // Para actualización (tiene ID)
      if (data.id !== null && data.id !== undefined) {
        const response = await updateBdRol("roles/update", data);

        if (response && response.success) {
          Swal.fire({
            title: "Guardado",
            text: "El rol se actualizó correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          runInAction(() => {
            this.setRol({
              id: null,
              name: "",
              guard_name: "web",
            });
            this.setHiddenForm(false);
            this.setEditing(false);
            this.setPermissions([]);
          });

          await this.loadRols();
          return response;
        }
      }
      // Para creación (sin ID)
      else {
        const result = await Swal.fire({
          title: "¿Desea guardar los cambios?",
          text: "Esta acción registrará un nuevo Rol.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, guardar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });

        if (result.isConfirmed) {
          const response = await updateBd("roles", data);

          Swal.fire({
            title: "Registrado",
            text: "El Rol se registró correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          runInAction(() => {
            this.setRol({
              id: null,
              name: "",
              guard_name: "web",
            });
            this.setHiddenForm(false);
            this.setEditing(false);
          });

          await this.loadRols();
          return response;
        }
      }
    } catch (error) {
      console.error("Error en addRol:", error);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Ocurrió un error al guardar",
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

  importXlsrols = async () => {
    try {
      await setUrImport("/api/rols/import", this.urlImp);
      await this.loadRols();
      Swal.fire({
        title: "Importado",
        text: "Roles importados correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Error al importar roles",
        icon: "error",
      });
    }
  };

  goEdit = async (rol) => {
    runInAction(() => {
      this.setEditing(true);
      this.setEditId(rol.id);
      this.setRol(rol);
      this.setHiddenForm(true);
    });

    // Cargar permisos del rol seleccionado
    if (rol.id) {
      await this.loadPermissionsByRole(rol.id);
    }
  };

  removeRol = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar rol?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await deleteBd("rols", id);
        await this.loadRols();

        Swal.fire({
          title: "Eliminado",
          text: "El rol ha sido eliminado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el rol",
          icon: "error",
        });
      }
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setRols([]);
        let searchRender = await searchBd(table, value);
        runInAction(() => {
          this.setRols(searchRender);
        });
      } else {
        await this.loadRols();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Método para limpiar el store
  reset = () => {
    runInAction(() => {
      this.rol = {
        id: null,
        name: "",
        guard_name: "web",
      };
      this.permissions = [];
      this.originalPermissions = [];
      this.editing = false;
      this.editId = null;
      this.hiddenForm = false;
      this.error = null;
    });
  };
}

export default new RolStore();
