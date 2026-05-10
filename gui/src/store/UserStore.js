import { makeAutoObservable } from "mobx";
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
  user = {
    id: null,
    name: "",
    phone: "",
    email: "",
    password: "",
    rol: 0,
    active: false,
  };
  users = [];
  pagination = {};
  editing = false;
  editId = null;
  hiddenForm = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (user) => {
    this.user = user;
  };

  setUsers = (users) => {
    this.users = users;
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
    const pagCurrent = await getDatasBd("users?page=" + page);

    if (pagCurrent) {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      let users = pagCurrent.data.filter((u) => u.id !== savedUser["id"]);
      this.setUsers(users);
      delete pagCurrent.data;
      this.setPagination(pagCurrent);
    }
  };

  loadUsers = async () => {
    try {
      const data = await getAllBd("users");

      const savedUser = JSON.parse(localStorage.getItem("user"));

      let users = data.data.filter((u) => u.id !== savedUser["id"]);
      delete data.data;
      this.setPagination(data);
      this.setUsers(users);
    } catch (error) {
      console.log(error);
    }
  };

  addUser = async (data) => {
    try {
      if (this.editing) {
        this.user.id = this.editId;
        await updateBd("users", this.editId, data);
        this.setEditing(false);
        this.setEditId(null);
        this.setUser({ ...this.user, id: null });
        this.loadUsers();
         this.setHiddenForm(false);
      } else {
        const newUser = await createBd("users", data);
        this.setEditId(null);
        this.setEditing(false);
        this.loadUsers();
        this.setHiddenForm(false);
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

  goEdit = async (user) => {
    user.rol = user.rol_id;
    delete user.rol_id;
    user.active = user.status !== 0 ? true : false;
    delete user.status;
    delete user.created_at
    delete user.updated_at
    
    this.setEditing(true);
    this.setEditId(user.id);
    this.setUser(user);
    this.setHiddenForm(true);
    //navigate(`/usuarios/editar/${user.id}`);
  };

  removeUser = async (id) => {
    try {
      await deleteBd("users", id);
      //let updatedUsers = this.users.filter((u) => u.id !== id);
      await this.loadUsers();
    } catch (error) {
      console.log(error);
    }
  };

  searchByTable = async (e, table) => {
    e.preventDefault();
    const { value } = e.target;

    try {
      if (value !== "") {
        this.setUsers([]);
        let seachRender = await searchBd(table, value);
        const savedUser = JSON.parse(localStorage.getItem("user"));
        let users = seachRender.filter((u) => u.id !== savedUser["id"]);
        this.setUsers(users);
      } else {
        await this.loadUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  saveUser = async (e, fn) => {
    e.preventDefault();

    const resp = await Swal.fire({
      title: "¿Desea Guardar los cambios?",
      text: "Esta acción Almacena la informacion.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Guardare",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (resp.isConfirmed) {
      //await handleSubmit(e);
      await fn(e);
      Swal.fire({
        title: "Guardado",
        text: "La informacion se guardo correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
}

export default new UserStore();
