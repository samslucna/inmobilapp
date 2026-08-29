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
  Stack,
  Divider,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import {
  FilterList,
  Clear,
  Search,
  RotateRight,
  PlayForWork,
  ExpandMore,
  ExpandLess,
  DateRange,
  Today,
  CalendarToday,
  KeyboardReturn,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TicketStore from "../../store/TicketStore";

export default function Filters({
  onFilter,
  onReset,
  filters,
  setFilters,
  btnConsolidate,
  loading = false,
  setMnSearch,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tempDateFilter, setTempDateFilter] = useState({
    fecha_inicio: filters?.fecha_inicio || null,
    fecha_fin: filters?.fecha_fin || null,
    mes: filters?.mes || "",
    año: filters?.año || "",
  });

  // Manejar cambios en los filtros
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

  // Aplicar filtros
  const handleApply = (e) => {
    e.preventDefault();
    if (onFilter) {
      onFilter(filters);
    }
  };

  // Limpiar filtros
  const handleReset = (e) => {
    e.preventDefault();
    const resetFilters = {
      search: "",
      clientname: "",
      concept: "",
      status: "",
      fecha_inicio: null,
      fecha_fin: null,
      mes: "",
      año: "",
    };
    setFilters(resetFilters);
    setTempDateFilter({
      fecha_inicio: null,
      fecha_fin: null,
      mes: "",
      año: "",
    });
    if (onReset) {
      onReset();
    }
  };

  // Manejar cambios en fechas
  const handleDateChange = (name, value) => {
    const newDateFilter = {
      ...tempDateFilter,
      [name]: value,
    };
    setTempDateFilter(newDateFilter);

    // Actualizar los filtros principales
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Manejar cambio en mes/año
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setTempDateFilter({
      ...tempDateFilter,
      [name]: value,
    });
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.search) count++;
    if (filters?.clientname) count++;
    if (filters?.concept) count++;
    if (filters?.status) count++;
    if (filters?.fecha_inicio) count++;
    if (filters?.fecha_fin) count++;
    if (filters?.mes) count++;
    if (filters?.año) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Generar opciones para meses
  const mesesOptions = [
    { value: "", label: "Todos" },
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  // Generar opciones para años (últimos 10 años)
  const currentYear = new Date().getFullYear();
  const añosOptions = [
    { value: "", label: "Todos" },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    })),
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          flexWrap="wrap"
          gap={1}
        >
          <Box display="flex" alignItems="center">
            <FilterList sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" fontWeight="bold">
              Filtros de Búsqueda
            </Typography>
            {activeFiltersCount > 0 && (
              <Chip
                label={`${activeFiltersCount} filtros activos`}
                size="small"
                color="primary"
                sx={{ ml: 2 }}
                onDelete={handleReset}
              />
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              endIcon={showAdvancedFilters ? <ExpandLess /> : <ExpandMore />}
            >
              {isMobile ? "Avanzado" : "Filtros Avanzados"}
            </Button>
          </Box>
        </Box>

        <Box component="form">
          <Grid container spacing={isMobile ? 1.5 : 2}>
            {/* Búsqueda General */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Buscar por N°"
                name="search"
                value={filters?.search || ""}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: filters?.search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setFilters({ ...filters, search: "" });
                        }}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
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
                label="Cliente"
                name="clientname"
                value={filters?.clientname || ""}
                onChange={handleChange}
                InputProps={{
                  endAdornment: filters?.clientname && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setFilters({ ...filters, clientname: "" });
                        }}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Etapa */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Concepto"
                name="concept"
                value={filters?.concept || ""}
                onChange={handleChange}
                InputProps={{
                  endAdornment: filters?.concept && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setFilters({ ...filters, concept: "" });
                        }}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Status */}
            <Grid item size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                name="status"
                value={filters?.status || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </TextField>
            </Grid>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Clear />}
              onClick={handleReset}
              fullWidth={isMobile}
              size={isMobile ? "small" : "medium"}
            >
              Limpiar
            </Button>

            {/* Filtros Avanzados - Fechas */}
            <Grid item size={{ xs: 12, md: 12 }}>
              <Collapse in={showAdvancedFilters}>
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }}>
                    <Chip
                      icon={<DateRange />}
                      label="Filtros por Fecha"
                      size="small"
                      color="primary"
                    />
                  </Divider>

                  <Grid container spacing={isMobile ? 1.5 : 2}>
                    {/* Rango de Fechas */}
                    <Grid item size={{ xs: 12, md: 2 }}>
                      <DatePicker
                        label="Fecha Inicio"
                        value={tempDateFilter.fecha_inicio}
                        onChange={(newValue) =>
                          handleDateChange("fecha_inicio", newValue)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Today fontSize="small" color="action" />
                                </InputAdornment>
                              ),
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item size={{ xs: 12, md: 2 }}>
                      <DatePicker
                        label="Fecha Fin"
                        value={tempDateFilter.fecha_fin}
                        onChange={(newValue) =>
                          handleDateChange("fecha_fin", newValue)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Today fontSize="small" color="action" />
                                </InputAdornment>
                              ),
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Filtro por Mes */}
                    <Grid item size={{ xs: 12, md: 2 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Mes</InputLabel>
                        <Select
                          name="mes"
                          value={tempDateFilter.mes || ""}
                          onChange={handleSelectChange}
                          label="Mes"
                          startAdornment={
                            <InputAdornment position="start">
                              <CalendarToday fontSize="small" color="action" />
                            </InputAdornment>
                          }
                        >
                          {mesesOptions.map((mes) => (
                            <MenuItem key={mes.value} value={mes.value}>
                              {mes.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Filtro por Año */}
                    <Grid item size={{ xs: 12, md: 2 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Año</InputLabel>
                        <Select
                          name="año"
                          value={tempDateFilter.año || ""}
                          onChange={handleSelectChange}
                          label="Año"
                        >
                          {añosOptions.map((año) => (
                            <MenuItem key={año.value} value={año.value}>
                              {año.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Botones de acción para fechas */}
                    <Grid item size={{ xs: 12, md: 2 }}>
                      <Box
                        display="flex"
                        gap={1}
                        flexWrap="wrap"
                        justifyContent={isMobile ? "center" : "flex-start"}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setTempDateFilter({
                              fecha_inicio: null,
                              fecha_fin: null,
                              mes: "",
                              año: "",
                            });
                            setFilters({
                              ...filters,
                              fecha_inicio: null,
                              fecha_fin: null,
                              mes: "",
                              año: "",
                            });
                          }}
                        >
                          Limpiar Fechas
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Grid>

            {/* Separador antes de los botones */}
            <Grid item size={{ xs: 12, md: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Botones de Acción */}
            <Grid item size={{ xs: 12, md: 10 }}>
              <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems="center"
                gap={1.5}
                flexWrap="wrap"
              >
                <Box
                  display="flex"
                  gap={1}
                  flexWrap="wrap"
                  width={isMobile ? "100%" : "auto"}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    startIcon={<FilterList />}
                    onClick={onFilter}
                    fullWidth={isMobile}
                    size={isMobile ? "small" : "medium"}
                    disabled={loading}
                  >
                    {loading ? "Aplicando..." : "Aplicar Filtros"}
                  </Button>
                </Box>

                <Box
                  display="flex"
                  gap={1}
                  flexWrap="wrap"
                  width={isMobile ? "100%" : "auto"}
                >
           {/*        <Button
                    type="button"
                    variant="contained"
                    sx={{
                      color: "white",
                      background: "#2895a3",
                      "&:hover": { background: "#1f7a86" },
                    }}
                    startIcon={<RotateRight />}
                    onClick={btnConsolidate}
                    fullWidth={isMobile}
                    size={isMobile ? "small" : "medium"}
                  >
                    Consolidar
                  </Button> */}
                  <Button
                    type="button"
                    variant="contained"
                    sx={{
                      color: "white",
                      background: "green",
                      "&:hover": { background: "#006400" },
                    }}
                    startIcon={<PlayForWork />}
                    onClick={btnConsolidate}
                    fullWidth={isMobile}
                    size={isMobile ? "small" : "medium"}
                  >
                    Xls
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    sx={{
                      color: "white",
                      background: "#d42e2e",
                      "&:hover": { background: "#b02626" },
                    }}
                    startIcon={<PlayForWork />}
                    onClick={setMnSearch}
                    fullWidth={isMobile}
                    size={isMobile ? "small" : "medium"}
                  >
                    Pdf
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    sx={{
                      color: "white",
                      background: "#3576ca",
                      "&:hover": { background: "#b02626" },
                    }}
                    startIcon={<KeyboardReturn />}
                    onClick={() => setMnSearch("")}
                    fullWidth={isMobile}
                    size={isMobile ? "small" : "medium"}
                  >
                    Atras
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
