import { useState,useEffect } from "react";
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
  Divider,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import {
  FilterList,
  Search,
  Clear,
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
import TicketStore from "../../store/TicketStore";
import ModalDoc from "./ModalDocAll";
import ProjectStore from "../../store/ProjectStore";
import BlocksStore from "../../store/BlocksStore";
import StageStore from "../../store/StageStore";

export default function Filters({
  onFilter,
  onReset,
  filters,
  setFilters,
  btnAction,
  loading = false,
  setMnSearch,
}) {
  const { toExportExcel } = TicketStore;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tempDateFilter, setTempDateFilter] = useState({
    datei: filters?.datei || null,
    datee: filters?.datee || null,
    month: filters?.month || "",
    year: filters?.year || "",
  });
    const [data, setData] = useState({
    projects: [],
    stages: [],
    blocks: [],
  });

  const [selected, setSelected] = useState({
    project: "",
    stage: "",
    block: "",
  });

  // Aplicar filtros
  const handleApply = () => {
    if (onFilter) {
      onFilter(filters);
    }
  };

  // Limpiar filtros
  const handleReset = (e) => {
    e.preventDefault();
    const resetFilters = {
      block_id: "",
      stage_id: "",
      project_id: "",
      search: "",
      clientname: "",
      concept: "",
      status: "activo",
      datei: null,
      datee: null,
      month: "",
      year: "",
    };
    setFilters(resetFilters);
    setTempDateFilter({
      datei: null,
      datee: null,
      month: "",
      year: "",
    });
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

    handleApply();
  };

  // Manejar cambio en mes/año
  const handleSelectChange = async (e) => {
    const { name, value } = e.target;

    setTempDateFilter({
      ...tempDateFilter,
      [name]: value,
    });

    setFilters({
      ...filters,
      [name]: value,
    });
    handleApply();
  };

  // Contar filtros activos
  const getActiveFiltersCount = (e) => {
    let count = 0;
    if (filters?.search) count++;
    if (filters?.clientname) count++;
    if (filters?.concept) count++;
    if (filters?.status) count++;
    if (filters?.datei) count++;
    if (filters?.datee) count++;
    if (filters?.month) count++;
    if (filters?.year) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Generar opciones para meses
  const monthOptions = [
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
  const yearOptions = [
    { value: "", label: "Todos" },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    })),
  ];

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


  useEffect(() => {
      const init = async () => {
        try {
         
            const [rawProjects, rawBlocks, rawStages] = await Promise.all([
              ProjectStore.loadProjects(),
              BlocksStore.getBlocks(),
              StageStore.getStages(),
            ]);
            let projecs = [
              { id: 0, name: "Todos los proyectos" },
              ...rawProjects,
            ];
            let blocks = [{ id: 0, name: "Todas las manzanas" }, ...rawBlocks];
            let stages = [{ id: 0, name: "Todas las etapas" }, ...rawStages];
  
            setData({
              ...data,
              blocks: blocks,
              stages: stages,
              projects: projecs,
            });
  
            const selectOpt = {
              project: projecs[0]?.id,
              stage: stages[0]?.id,
              block: blocks[0]?.id,
            };
  
            setSelected(selectOpt);
          
        } catch (error) {
          console.log(error);
        }
      };
      init();
    }, [])

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
            {/* Proyecto */}
            <Grid item size={{ xs: 12, md: 2 }}>
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
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Etapa */}
            <Grid item size={{ xs: 12, md: 2 }}>
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
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Manzana / Block */}
            <Grid item size={{ xs: 12, md: 2 }}>
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
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Búsqueda General */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="N°"
                name="search"
                value={filters?.search || ""}
                onChange={onFilter}
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

            {/* Cliente */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Cliente"
                name="clientname"
                value={filters?.clientname || ""}
                onChange={onFilter}
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
                onChange={onFilter}
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
                onChange={onFilter}
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
                    {/* Filtro por Mes */}
                    <Grid item size={{ xs: 12, md: 2 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Mes</InputLabel>
                        <Select
                          name="month"
                          value={tempDateFilter.month || ""}
                          onChange={handleSelectChange}
                          label="Mes"
                          startAdornment={
                            <InputAdornment position="start">
                              <CalendarToday fontSize="small" color="action" />
                            </InputAdornment>
                          }
                        >
                          {monthOptions.map((month) => (
                            <MenuItem key={month.value} value={month.value}>
                              {month.label}
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
                          name="year"
                          value={tempDateFilter.year || ""}
                          onChange={handleSelectChange}
                          label="Año"
                        >
                          {yearOptions.map((year) => (
                            <MenuItem key={year.value} value={year.value}>
                              {year.label}
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
                              datei: null,
                              datee: null,
                              month: "",
                              year: "",
                            });
                            setFilters({
                              ...filters,
                              datei: null,
                              datee: null,
                              month: "",
                              year: "",
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
                    onClick={() => {
                      toExportExcel(
                        "/api/tickets/export/xls",
                        "Reporte de recibos",
                        filters,
                      );
                    }}
                    fullWidth={isMobile}
                    size={isMobile ? "small" : "medium"}
                  >
                    Xls
                  </Button>
                  <ModalDoc
                    data={filters}
                    url={"/api/tickets/reportTicketsPdf"}
                    color={"error"}
                    title={"PDF"}
                  />
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
