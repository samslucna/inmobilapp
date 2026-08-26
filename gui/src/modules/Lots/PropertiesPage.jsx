import React, { useState, useEffect, useCallback } from "react";
import PropertyFilters from "./PropertyFilters";
import { Stack, Pagination } from "@mui/material";
import axios from "axios";
import TableData from "./TableData";
import PropertyStore from "../../store/PropertyStore";

export default function PropertiesPage() {
  const { loadProperties, handlePaginationChange, consolidate } = PropertyStore;
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    block_id: "",
    stage_id: "",
    project_id: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: null,
    to: null,
  });
  const [data, setData] = useState([]);

  // Handler para el formulario de filtros
  const handleFilterSubmit = async (e) => {
    try {
      e.preventDefault();
      const { name, value } = e.target;
      let filter = { ...filters, [name]: value };
      filter.page = 1;
      const res = await loadProperties(filter.page, filter);
      if (res) {
        setPaginate(res);
        setFilters(filter);
        setData(res.data);
      }
    } catch (error) {
      console.log(e);
    }
  };
  const changePage = async (e) => {
    e.preventDefault();
    let { innerText } = e.target;
    let filter = { ...filters, page: innerText };

    const res = await loadProperties(innerText, filter);

    if (res) {
      setData(res.data);
      setPaginate(res);
      setFilters(filter);
    }
  };

  const btnConsolidate = async (e) => {
    e.preventDefault();
    consolidate(e);

    const upd = await loadProperties(1, { page: 1 });

    if (upd) {
      setPaginate(upd);
      setData(upd.data);
    }
  };

  const resetFilter = async () => {
    const filterInit = {
      search: "",
      page: 1,
      block_id: "",
      stage_id: "",
      project_id: "",
      status: "",
    };

    const res = await loadProperties(filterInit.page, filterInit);
    setFilters(filterInit);
    setData(res.data);
    setPaginate(res);
  };
  // Carga cuando cambian los filtros o la página
  useEffect(() => {
    const init = async () => {
      const dataApi = await loadProperties(filters.page, filters);
      if (dataApi) {
        setPaginate(dataApi);
        setData(dataApi.data);
      }
    };

    init();
  }, []);

  return (
    <div>
      {/* Tu tabla de Material UI (MUI DataGrid o Table) va aquí */}
      <PropertyFilters
        onFilter={handleFilterSubmit}
        onReset={resetFilter}
        filters={filters}
        setFilters={setFilters}
        btnConsolidate={btnConsolidate}
      />
      <TableData datas={data} />
      <Stack spacing={2} sx={{ padding: 2, alignItems: "center" }}>
        <Pagination
          count={paginate?.last_page}
          page={paginate?.current_page}
          onChange={(e) => changePage(e)}
        />
      </Stack>
    </div>
  );
}
