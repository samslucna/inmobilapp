import React, { useState, useEffect } from 'react';
import PropertyFilters from './PropertyFilters';
import axios from 'axios';
import TableData from './TableData';
import PropertyStore from '../../store/PropertyStore';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const fetchProperties = async (filters = {}, page = 1) => {
    try {
      
     const response = await PropertyStore.loadProperties(filters,page)
      
      if ((response !== []) && (response !== undefined)) {
        console.log('Respuesta de la API:', response); // Depuración
        setProperties(response);
      }
    } catch (error) {
      console.error('Error al cargar propiedades', error);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchProperties(appliedFilters, pagination.page);
  }, []);

  // Handler que se pasa al botón "Aplicar Filtros"
  const handleFilterSubmit = (newFilters) => {
    setAppliedFilters(newFilters);
    fetchProperties(newFilters, 1); // Reinicia a la página 1 al filtrar
  };

  return (
    <div>
      <PropertyFilters onFilter={handleFilterSubmit} />
      {/* Tu tabla de Material UI (MUI DataGrid o Table) va aquí */}
      <TableData  datas={properties} />
    </div>
  );
}