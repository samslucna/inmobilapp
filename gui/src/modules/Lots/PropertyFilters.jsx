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
import CircularProg from '@mui/icons-material/RotateRight';
import PlaylistPlay from '@mui/icons-material/PlayForWork';
import PropertyStore from '../../store/PropertyStore';



export default function PropertyFilters({ onFilter, onReset,filters,setFilters, btnConsolidate }) {
  

  // Actualiza el estado local al escribir o seleccionar
  const handleChange = (e) => {

    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    handleApply(e); // Aplica los filtros automáticamente al cambiar cualquier campo
  };

  

  // Dispara los filtros hacia el componente padre o la llamada a la API
  const handleApply = (e) => {
    e.preventDefault();
    if (onFilter) {
      onFilter(filters);
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

      <Box component="form" >
        <Grid container spacing={2}>
          {/* Búsqueda General */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Buscar por ID o N°"
              name="search"
              value={filters?.search}
              onChange={onFilter}
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
              value={filters?.project_id}
              onChange={onFilter}
            />
          </Grid>

          {/* Etapa */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Etapa ID"
              name="stage_id"
              value={filters?.stage_id}
              onChange={onFilter}
            />
          </Grid>

          {/* Manzana / Block */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Manzana"
              name="block_id"
              value={filters?.block_id}
              onChange={onFilter}
            />
          </Grid>

          {/* Tipo de Pago */}
          <Grid item size={{ xs: 12, sm: 6, md: 3 }} >
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              name="status"
              value={filters?.status}
              onChange={onFilter}
            >
              <MenuItem key={0} value="">Todos</MenuItem>
              <MenuItem key={1} value="pagado">Pagado</MenuItem>
              <MenuItem key={2} value="finiquitado">Finiquitado</MenuItem>
              <MenuItem key={3} value="pendiente">Pendiente</MenuItem>
              <MenuItem key={4} value="disponible">Disponible</MenuItem>

            </TextField>
          </Grid>

          {/* Botones de Acción */}
          <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1.5} mt={1}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ClearIcon />}
              onClick={onReset}
            >
              Limpiar
            </Button>
              <Button
              type="button"
              variant="contained"
              sx={{
                color:'white',
                background:'#2895a3'
              }}
              startIcon={<CircularProg />}
              onClick={(e)=>btnConsolidate(e)}
            >
              Consolidar
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={onFilter}
            >
              Aplicar Filtros
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{
                color:'white',
                background:'green'
              }}
              startIcon={<PlaylistPlay />}
              onClick={(e)=>btnConsolidate(e)}
            >
              Xls
            </Button>
                <Button
              type="button"
              variant="contained"
              sx={{
                color:'white',
                background:'#d42e2e'
              }}
              startIcon={<PlaylistPlay />}
              onClick={(e)=>btnConsolidate(e)}
            >
              Pdf
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}