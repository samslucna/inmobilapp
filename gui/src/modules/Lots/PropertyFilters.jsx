import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
  Box,
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

const initialFilters = {
  search: '',
  block_id: '',
  stage_id: '',
  project_id: '',
  paytype: '',
  date_from: '',
  date_to: '',
};

export default function PropertyFilters({ onFilter, onReset }) {
  const [filters, setFilters] = useState(initialFilters);

  // Actualiza el estado local al escribir o seleccionar
  const handleChange = (e) => {

    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Dispara los filtros hacia el componente padre o la llamada a la API
  const handleApply = (e) => {
    e.preventDefault();
    if (onFilter) {
      onFilter(filters);
    }
  };

  // Limpia los filtros
  const handleClear = () => {
    setFilters(initialFilters);
    if (onReset) {
      onReset(initialFilters);
    } else if (onFilter) {
      onFilter(initialFilters);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">
          Filtros de Búsqueda
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleApply}>
        <Grid container spacing={2}>
          {/* Búsqueda General */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Buscar por ID o N°"
              name="search"
              value={filters.search}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Proyecto */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Proyecto ID"
              name="project_id"
              value={filters.project_id}
              onChange={handleChange}
            />
          </Grid>

          {/* Etapa */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Etapa ID"
              name="stage_id"
              value={filters.stage_id}
              onChange={handleChange}
            />
          </Grid>

          {/* Manzana / Block */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Manzana (Block ID)"
              name="block_id"
              value={filters.block_id}
              onChange={handleChange}
            />
          </Grid>

          {/* Tipo de Pago */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Tipo de Pago"
              name="paytype"
              value={filters.paytype}
              onChange={handleChange}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="contado">Contado</MenuItem>
              <MenuItem value="credito">Crédito</MenuItem>
            </TextField>
          </Grid>

          {/* Fecha Desde */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Desde"
              name="date_from"
              value={filters.date_from}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Fecha Hasta */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Hasta"
              name="date_to"
              value={filters.date_to}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Botones de Acción */}
          <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1.5} mt={1}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ClearIcon />}
              onClick={handleClear}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<FilterListIcon />}
            >
              Aplicar Filtros
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}