import { makeAutoObservable } from "mobx";
import { loginRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
class AuthStore {
  isAuthenticated = false;
  token = null;
  user = null;

  constructor() {
    makeAutoObservable(this);

    // Revisar token en localStorage primero
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    // Revisar token en cookie secundariamente
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (savedToken && savedUser) {
      this.token = savedToken;
      this.user = JSON.parse(savedUser);
      this.isAuthenticated = true;
    } else if (cookieToken) {
      this.token = cookieToken.split("=")[1];
      this.user = JSON.parse(savedUser);
      this.isAuthenticated = true;
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

  hasRole = (roles = []) => {
    if (!this.user) return false;
    return roles.includes(this.user.rol);
  };

  handleLogin = async (user) => {
    try {
      const res = await loginRequest(user);
      await authStore.login(res.token,res.user);
    } catch (e) {
      alert("Credenciales incorrectas");
    }
  };
}

const authStore = new AuthStore();
export default authStore;
