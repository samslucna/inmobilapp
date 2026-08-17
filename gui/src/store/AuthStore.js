import { makeAutoObservable } from "mobx";
import { loginRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";

class AuthStore {
  isAuthenticated = false;
  token = null;
  user = null;
  permissions = [];
  roles = [];

  setPermissions = (permission) => {
    this.permissions = permission;
  };

  setRoles = (roles) => {
    this.roles = roles;
  };

  setUser = (user) => {
    this.user = user;
  };
  constructor() {
    makeAutoObservable(this);

    // Revisar token en localStorage primero
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    
    if (savedUser !== null) {
      const user = JSON.parse(savedUser);

      this.setPermissions(user.permissions || []);
      this.setRoles(user.roles || []);

      // Revisar token en cookie secundariamente
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      this.setUser(JSON.parse(savedUser));
      if (savedToken && savedUser) {
        this.token = savedToken;

        this.user = JSON.parse(savedUser);
        this.isAuthenticated = true;
      } else if (cookieToken) {
        this.token = cookieToken.split("=")[1];
        this.user = JSON.parse(savedUser);
        this.isAuthenticated = true;
      }
    }else {
      console.log("No hay usuario guardado en localStorage.");
    }
  }

  login = (token, user) => {
    this.isAuthenticated = true;
    this.token = token;

    // Guardar token en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    // Guardar token en cookie
    document.cookie = `token=${token}; path=/;`;
  };

  logout = () => {
    console.log("Cerrando sesión...");
    this.isAuthenticated = false;
    this.token = null;
    this.user = null;

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Eliminar cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  //hasRole = (roles = []) => {
  //  if (!this.user) return false;
  //  return roles.includes(this.user.rol);
  //};
  hasRole = (role) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.roles?.includes(role) || false;
  };

  Can = ({ permission, children }) => {
    if (!authStore.permissions.includes(permission)) {
      return null;
    }

    return children;
  };

  hasPermission = (permission) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user?.permissions?.includes(permission) || false);
    return user?.permissions?.includes(permission) || false;
  };

  handleLogin = async (user) => {
    try {
      const res = await loginRequest(user);
      //console.log(res);
      await this.login(res.token, res.user);
    } catch (e) {
      alert("Credenciales incorrectas");
    }
  };
}

const authStore = new AuthStore();
export default authStore;
