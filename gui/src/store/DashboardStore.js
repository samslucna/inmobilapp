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

class DashboardStore {
  cards = {};

  paymonth = [];

  pagosPorMes = [];

  etapas = [];

  manzanas = [];

  datas = [];

  setDatas = (datas) => {
    this.datas = datas;
  };

  setPayMonth = (datas) => {
    this.paymonth = datas;
  };

  constructor() {
    makeAutoObservable(this);
  }

  async loadDashboard() {
    const response = await getAllBd("dashboard");

    
    this.setDatas(response);

    return response;
  }

  formatMonth = (fecha) => {
    return fecha.map((item) => {
      // Añadimos '-02' para evitar desfases por zonas horarias al crear la fecha
      const fecha = new Date(item.mes + "-02");

      // Extraemos el nombre corto del mes en español (ej: "ene.", "feb.")
      let mesCorto = new Intl.DateTimeFormat("es-ES", {
        month: "short",
      }).format(fecha);

      // Limpiamos el punto que genera algunos navegadores (ej: "ene." -> "ene")
      mesCorto = mesCorto.replace(".", "");

      // Capitalizamos la primera letra (ej: "ene" -> "Ene")
      const mesCapitalizado =
        mesCorto.charAt(0).toUpperCase() + mesCorto.slice(1);

      return {
        mes: mesCapitalizado,
        cantidad: Number(item.cantidad), // Convertimos el texto a número entero
      };
    });
  };
}

export default new DashboardStore();
