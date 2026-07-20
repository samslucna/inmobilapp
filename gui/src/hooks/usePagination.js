// hooks/usePagination.js
import { useState, useEffect, useCallback } from "react";

const usePagination = (store, loadFunction) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(store.pagination?.per_page || 10);
  const [totalCount, setTotalCount] = useState(store.pagination?.total || 0);
  const [totalPages, setTotalPages] = useState(store.pagination?.last_page || 1);

  // Sincronizar con el store
  useEffect(() => {
    setTotalCount(store.pagination?.total || 0);
    setTotalPages(store.pagination?.last_page || 1);
    const currentPage = store.pagination?.current_page || 1;
    setPage(currentPage - 1);
  }, [store.pagination]);

  // Cambiar página
  const handlePageChange = useCallback((event, newPage) => {
  
    const newPageNumber = newPage + 1;
    setPage(newPage);
    if (loadFunction) {
      loadFunction(newPageNumber);
    } else {
      store.changePage(newPageNumber);
    }
  }, [loadFunction, store]);

  // Cambiar filas por página
  const handleRowsPerPageChange = useCallback((event) => {
    event.preventDefault();
    const newPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newPerPage);
    setPage(0);
    if (store.changePerPage) {
      store.changePerPage(newPerPage);
    }
  }, [store]);

  // Calcular índices
  const from = store.pagination?.from || (page * rowsPerPage + 1);
  const to = store.pagination?.to || Math.min((page + 1) * rowsPerPage, totalCount);

  return {
    page,
    rowsPerPage,
    totalCount,
    totalPages,
    from,
    to,
    handlePageChange,
    handleRowsPerPageChange,
  };
};

export default usePagination;