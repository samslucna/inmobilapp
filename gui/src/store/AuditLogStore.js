// store/AuditLogStore.js
import { makeAutoObservable, runInAction } from "mobx";
import { getAllBd, deleteBd, searchBd, getFilteredBd } from "../api/QueryApi";
import Swal from "sweetalert2";

class AuditLogStore {
  logs = [];
  pagination = {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 5,
    from: null,
    to: null,
  };
  loading = false;
  filters = {
    search: "",
    event: "",
    module: "",
    date_from: "",
    date_to: "",
    severity: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setLogs = (logs) => {
    this.logs = logs;
  };

  setPagination = (pagination) => {
    this.pagination = { ...this.pagination, ...pagination };
  };

  setLoading = (loading) => {
    this.loading = loading;
  };

  setFilters = (filters) => {
    this.filters = { ...this.filters, ...filters };
  };

  setPerPage = (perPage) => {
    this.pagination.per_page = perPage;
  };

  loadLogs = async (page = 1) => {
    this.setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: page,
        per_page: this.pagination.per_page,
        ...(this.filters.search && { search: this.filters.search }),
        ...(this.filters.event && { event: this.filters.event }),
        ...(this.filters.module && { module: this.filters.module }),
        ...(this.filters.date_from && { date_from: this.filters.date_from }),
        ...(this.filters.date_to && { date_to: this.filters.date_to }),
        ...(this.filters.severity && { severity: this.filters.severity }),
      });
      
      const response = await getFilteredBd(`audit/logs?${params}`);
      console.log(response);
      runInAction(() => {
        this.setLogs(response.data || []);
        this.setPagination({
          current_page: response.current_page,
          last_page: response.last_page,
          total: response.total,
          per_page: response.per_page,
          from: response.from,
          to: response.to,
        });
      });
      
      return response;
    } catch (error) {
      console.error("Error loading audit logs:", error);
      runInAction(() => {
        this.logs = [];
      });
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  deleteLog = async (id) => {
    this.setLoading(true);
    
    try {
      const response = await deleteBd("audit/logs", id);
      return response;
    } catch (error) {
      console.error("Error deleting log:", error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  exportLogs = async (filters) => {
    try {
      const params = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(filters.event && { event: filters.event }),
        ...(filters.module && { module: filters.module }),
        ...(filters.date_from && { date_from: filters.date_from }),
        ...(filters.date_to && { date_to: filters.date_to }),
        ...(filters.severity && { severity: filters.severity }),
      });
      
      const response = await getAllBd(`audit/logs/export?${params}`);
      
      // Crear y descargar archivo JSON
      const dataStr = JSON.stringify(response, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `audit_logs_${new Date().toISOString()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return response;
    } catch (error) {
      console.error("Error exporting logs:", error);
      throw error;
    }
  };

  clearOldLogs = async (days) => {
    this.setLoading(true);
    
    try {
      const response = await deleteBd(`audit/logs/clear-old?days=${days}`);
      return response;
    } catch (error) {
      console.error("Error clearing old logs:", error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  };
}

export default new AuditLogStore();