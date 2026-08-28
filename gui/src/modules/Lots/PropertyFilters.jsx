import React, { useState } from "react";

import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Chip,
  Collapse,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import CircularProg from "@mui/icons-material/RotateRight";
import PlaylistPlay from "@mui/icons-material/PlayForWork";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PropertyStore from "../../store/PropertyStore";
import ModalDoc from "./ModalDoc";


export default function PropertyFilters({
  onFilter,
  onReset,
  filters,
  setFilters,
  btnConsolidate,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Actualiza el estado local al escribir o seleccionar
  const handleChange = (e) => {
    e.preventDefault();
    try {
      const { name, value } = e.target;
      setFilters({
        ...filters,
        [name]: value,
      });
      handleApply(e); // Aplica los filtros automáticamente al cambiar cualquier campo
    } catch (error) {
      console.log(e);
    }
  };

  // Dispara los filtros hacia el componente padre o la llamada a la API
  const handleApply = (e) => {
    try {
      e.preventDefault();
      if (onFilter) {
        onFilter(filters);
      }
    } catch (error) {
      console.log(e);
    }
  };

  // Limpiar todos los filtros
  const handleReset = (e) => {
    e.preventDefault();
    const resetFilters = {
      search: "",
      project_id: "",
      stage_id: "",
      block_id: "",
      status: "",
    };
    setFilters(resetFilters);
    if (onReset) {
      onReset();
    }
  };

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.search) count++;
    if (filters?.project_id) count++;
    if (filters?.stage_id) count++;
    if (filters?.block_id) count++;
    if (filters?.status) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Limpiar filtro individual
  const clearFilter = (fieldName) => {
    try {
      setFilters({
        ...filters,
        [fieldName]: "",
      });
      // Aplicar filtros después de limpiar
      if (onFilter) {
        onFilter({
          ...filters,
          [fieldName]: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        flexWrap="wrap"
        gap={1}
      >
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
          <FilterListIcon sx={{ color: "primary.main" }} />
          <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">
            Filtros de Búsqueda
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} activo${activeFiltersCount > 1 ? "s" : ""}`}
              size="small"
              color="primary"
              onDelete={handleReset}
            />
          )}
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          endIcon={
            showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />
          }
          sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
        >
          {isMobile ? "Avanzado" : "Filtros Avanzados"}
        </Button>
      </Box>

      <Box component="form">
        <Grid container spacing={isMobile ? 1.5 : 2}>
          {/* Búsqueda General */}
          <Grid item size={{xs:12, md:2}}>
            <TextField
              fullWidth
              size="small"
              label="Buscar por ID o N°"
              name="search"
              value={filters?.search || ""}
              onChange={onFilter}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: filters?.search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => clearFilter("search")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Proyecto */}
          <Grid item size={{xs:12, md:2}}>
            <TextField
              fullWidth
              size="small"
              label="Proyecto ID"
              name="project_id"
              value={filters?.project_id || ""}
              onChange={onFilter}
              InputProps={{
                endAdornment: filters?.project_id && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => clearFilter("project_id")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Etapa */}
          <Grid item size={{xs:12, md:2}}>
            <TextField
              fullWidth
              size="small"
              label="Etapa ID"
              name="stage_id"
              value={filters?.stage_id || ""}
              onChange={onFilter}
              InputProps={{
                endAdornment: filters?.stage_id && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => clearFilter("stage_id")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Manzana / Block */}
          <Grid item size={{xs:12, md:2}}>
            <TextField
              fullWidth
              size="small"
              label="Manzana"
              name="block_id"
              value={filters?.block_id || ""}
              onChange={onFilter}
              InputProps={{
                endAdornment: filters?.block_id && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => clearFilter("block_id")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Status */}
          <Grid item size={{xs:12, md:2}}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              name="status"
              value={filters?.status || ""}
              onChange={onFilter}
              InputProps={{
                endAdornment: filters?.status && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => clearFilter("status")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pagado">Pagado</MenuItem>
              <MenuItem value="finiquitado">Finiquitado</MenuItem>
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="disponible">Disponible</MenuItem>
            </TextField>
          </Grid>

          {/* Filtros Avanzados (opcional) */}
          <Grid item xs={12}>
            <Collapse in={showAdvancedFilters}>
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }}>
                  <Chip
                    icon={<DateRangeIcon />}
                    label="Filtros Avanzados"
                    size="small"
                    color="primary"
                  />
                </Divider>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Aquí puedes agregar más filtros según tus necesidades
                </Typography>
              </Box>
            </Collapse>
          </Grid>

          {/* Separador antes de los botones */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Botones de Acción */}
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="center"
              gap={isMobile ? 1 : 1.5}
              flexWrap="wrap"
            >
              <Box
                display="flex"
                gap={1}
                flexWrap="wrap"
                width={isMobile ? "100%" : "auto"}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<ClearIcon />}
                  onClick={handleReset}
                  fullWidth={isMobile}
                  size={isMobile ? "small" : "medium"}
                >
                  Limpiar
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  startIcon={<FilterListIcon />}
                  onClick={onFilter}
                  fullWidth={isMobile}
                  size={isMobile ? "small" : "medium"}
                >
                  Aplicar Filtros
                </Button>
              </Box>

              <Box
                display="flex"
                gap={1}
                flexWrap="wrap"
                width={isMobile ? "100%" : "auto"}
                justifyContent={isMobile ? "center" : "flex-end"}
              >
                <Button
                  type="button"
                  variant="contained"
                  sx={{
                    color: "white",
                    background: "#2895a3",
                    "&:hover": { background: "#1f7a86" },
                  }}
                  startIcon={<CircularProg />}
                  onClick={btnConsolidate}
                  fullWidth={isMobile}
                  size={isMobile ? "small" : "medium"}
                >
                  Consolidar
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  sx={{
                    color: "white",
                    background: "green",
                    "&:hover": { background: "#006400" },
                  }}
                  startIcon={<PlaylistPlay />}
                  onClick={() =>
                    PropertyStore.toExportExcel(
                      "/api/properties/reportPropertiesXls",
                      "Reporte de propiedades",
                      filters,
                    )
                  }
                  fullWidth={isMobile}
                  size={isMobile ? "small" : "medium"}
                >
                  Xls
                </Button>
                  <ModalDoc
                        data={filters}
                        url={"/api/properties/reportPropertiesPdf"}
                        color={"error"}
                        title={"PDF"}
                  />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
