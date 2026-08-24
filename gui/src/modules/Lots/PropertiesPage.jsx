import React, { useState, useEffect, useCallback } from "react";
import PropertyFilters from "./PropertyFilters";
import { Stack,Pagination } from "@mui/material";
import axios from "axios";
import TableData from "./TableData";
import PropertyStore from "../../store/PropertyStore";



export default function PropertiesPage() {
  const { loadProperties, handlePaginationChange } = PropertyStore;
  const [filters, setFilters] = useState({
  search: "",
  block_id: "",
  stage_id: "",
  project_id: "",
  status: "",
  date_from: "",
  date_to: "",
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
    const {name,value} = e.target;
    let filter = {...filters,[name]:value}
setFilters(filter);
    const res = await loadProperties(1,filter);
    console.log(res)
    if(res){
      setPaginate(res)
      setData(res.data);
    }
    
  };
  const changePage = async (e) => {
    e.preventDefault();
    
    const {innerText} = e.target;
    const res = await handlePaginationChange(innerText,filters);
    if (res) {
      setData(res.data)
      setPaginate(res);
    }
  };

  // Carga cuando cambian los filtros o la página
  useEffect(() => {
    const init = async () => {
      const dataApi = await loadProperties(1,filters);
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
      <PropertyFilters onFilter={handleFilterSubmit} filters={filters} setFilters={setFilters} />
      <TableData datas={data} />
      <Stack spacing={2} sx={{ padding: 2, alignItems: "center" }}>
        <Pagination
          count={paginate?.last_page}
          page={paginate?.current_page}
          onChange={changePage}
        />
      </Stack>
    </div>
  );
}
