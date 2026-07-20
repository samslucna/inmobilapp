// components/AuditLogTable.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Button,
  CircularProgress,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Avatar,
  alpha,
  useTheme,
  TableSortLabel,
} from "@mui/material";
import {
  Search,
  Clear,
  Refresh,
  Visibility,
  Delete,
  Download,
  Info,
  Person,
  Schedule,
  EventNote,
  CheckCircle,
  Cancel,
  Edit,
  Add,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Swal from "sweetalert2";
import auditLogStore from "../../../store/AuditLogStore";
import authStore from '../../../store/AuthStore';

// Componente de badge según evento
const EventBadge = ({ event }) => {
  const config = {
    created: { label: 'Creación', color: 'success', icon: <Add fontSize="small" /> },
    updated: { label: 'Actualización', color: 'info', icon: <Edit fontSize="small" /> },
    deleted: { label: 'Eliminación', color: 'error', icon: <DeleteIcon fontSize="small" /> },
    login: { label: 'Login', color: 'primary', icon: <Person fontSize="small" /> },
    logout: { label: 'Logout', color: 'secondary', icon: <Person fontSize="small" /> },
    export: { label: 'Exportación', color: 'warning', icon: <Download fontSize="small" /> },
    import: { label: 'Importación', color: 'warning', icon: <Download fontSize="small" /> },
    view: { label: 'Visualización', color: 'default', icon: <Visibility fontSize="small" /> },
    error: { label: 'Error', color: 'error', icon: <Cancel fontSize="small" /> },
    warning: { label: 'Advertencia', color: 'warning', icon: <Info fontSize="small" /> },
    access_denied: { label: 'Acceso Denegado', color: 'error', icon: <Cancel fontSize="small" /> },
  };

  const current = config[event] || { label: event, color: 'default', icon: null };

  return (
    <Chip
      label={current.label}
      color={current.color}
      size="small"
      icon={current.icon}
      sx={{ fontWeight: 'medium', minWidth: 100 }}
    />
  );
};

// Componente de badge según severidad
const SeverityBadge = ({ severity }) => {
  const config = {
    info: { label: 'Info', color: 'info' },
    warning: { label: 'Advertencia', color: 'warning' },
    error: { label: 'Error', color: 'error' },
    critical: { label: 'Crítico', color: 'error' },
  };

  const current = config[severity] || { label: severity, color: 'default' };

  return (
    <Chip
      label={current.label}
      color={current.color}
      size="small"
      variant="outlined"
    />
  );
};

// Filtros de auditoría
const AuditFilters = ({ filters, onFilterChange, onReset, onRefresh, loading }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item size={{ xs: 12, md: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por usuario, acción, módulo..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onFilterChange("search", "")}>
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item size={{ xs: 6, lg: 3 }}>
          <FormControl fullWidth size="small" disabled={loading}>
            <InputLabel>Evento</InputLabel>
            <Select
              value={filters.event || ""}
              onChange={(e) => onFilterChange("event", e.target.value)}
              label="Evento"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="created">Creación</MenuItem>
              <MenuItem value="updated">Actualización</MenuItem>
              <MenuItem value="deleted">Eliminación</MenuItem>
              <MenuItem value="login">Login</MenuItem>
              <MenuItem value="logout">Logout</MenuItem>
              <MenuItem value="export">Exportación</MenuItem>
              <MenuItem value="import">Importación</MenuItem>
              <MenuItem value="view">Visualización</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="warning">Advertencia</MenuItem>
              <MenuItem value="access_denied">Acceso Denegado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item size={{ xs: 6, lg: 2 }}>
          <FormControl fullWidth size="small" disabled={loading}>
            <InputLabel>Módulo</InputLabel>
            <Select
              value={filters.module || ""}
              onChange={(e) => onFilterChange("module", e.target.value)}
              label="Módulo"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="auth">Autenticación</MenuItem>
              <MenuItem value="users">Usuarios</MenuItem>
              <MenuItem value="roles">Roles</MenuItem>
              <MenuItem value="tickets">Tickets</MenuItem>
              <MenuItem value="contracts">Contratos</MenuItem>
              <MenuItem value="properties">Propiedades</MenuItem>
              <MenuItem value="security">Seguridad</MenuItem>
              <MenuItem value="exports">Exportaciones</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Tooltip title="Actualizar">
              <IconButton onClick={onRefresh} size="small" disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Ocultar filtros" : "Filtros avanzados"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Fecha desde"
              type="date"
              value={filters.date_from || ""}
              onChange={(e) => onFilterChange("date_from", e.target.value)}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item size={{ xs: 12, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Fecha hasta"
              type="date"
              value={filters.date_to || ""}
              onChange={(e) => onFilterChange("date_to", e.target.value)}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item size={{ xs: 12, lg: 4 }}>
            <FormControl fullWidth size="small" disabled={loading}>
              <InputLabel>Severidad</InputLabel>
              <Select
                value={filters.severity || ""}
                onChange={(e) => onFilterChange("severity", e.target.value)}
                label="Severidad"
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item size={{ xs: 12, lg: 4 }}>
            <Button
              variant="text"
              size="small"
              onClick={onReset}
              startIcon={<Clear />}
            >
              Limpiar todos los filtros
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

// Modal de detalles del log
const LogDetailsDialog = ({ open, log, onClose }) => {
  if (!log) return null;

  const changes = log.properties?.old || log.properties?.attributes ? {
    old: log.properties?.old,
    new: log.properties?.attributes,
  } : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventBadge event={log.event} />
          <Typography variant="h6">Detalles del evento</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Descripción
            </Typography>
            <Typography variant="body1">{log.description}</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Usuario
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Avatar sx={{ width: 24, height: 24 }}>
                  {log.causer?.name?.charAt(0) || 'S'}
                </Avatar>
                <Typography>{log.causer?.name || 'Sistema'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography>{log.causer?.email || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                IP
              </Typography>
              <Typography>{log.properties?.ip || log.user_ip || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Fecha
              </Typography>
              <Typography>
                {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Módulo
              </Typography>
              <Chip label={log.log_name || log.module} size="small" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Severidad
              </Typography>
              <SeverityBadge severity={log.properties?.severity || 'info'} />
            </Grid>
          </Grid>

          {log.subject_type && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Registro afectado
              </Typography>
              <Typography>
                {log.subject_type.split('\\').pop()} #{log.subject_id}
              </Typography>
            </Box>
          )}

          {changes && (changes.old || changes.new) && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Cambios detectados
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                <Grid container spacing={2}>
                  {Object.keys(changes.new || {}).map((key) => (
                    <Grid item xs={12} key={key}>
                      <Typography variant="caption" color="textSecondary">
                        {key}:
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Chip
                          label={changes.old?.[key] || 'NULL'}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                        <Typography>→</Typography>
                        <Chip
                          label={changes.new?.[key] || 'NULL'}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
          )}

          {log.properties && Object.keys(log.properties).length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Metadatos adicionales
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5", maxHeight: 200, overflow: "auto" }}>
                <pre style={{ margin: 0, fontSize: 12 }}>
                  {JSON.stringify(log.properties, null, 2)}
                </pre>
              </Paper>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

const AuditLogTable = observer(() => {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    search: "",
    event: "",
    module: "",
    date_from: "",
    date_to: "",
    severity: "",
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderBy, setOrderBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const { Can } = authStore;
  const logs = auditLogStore.logs || [];
  const pagination = auditLogStore.pagination;
  const loading = auditLogStore.loading;

  // Cargar logs al montar
  useEffect(() => {
    auditLogStore.loadLogs();
  }, []);

  // Manejar cambio de filtros con debounce
  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Aplicar filtros después de 500ms
    const timeout = setTimeout(() => {
      auditLogStore.setFilters(newFilters);
      auditLogStore.loadLogs(1);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [filters]);

  // Resetear filtros
  const handleResetFilters = () => {
    const defaultFilters = {
      search: "",
      event: "",
      module: "",
      date_from: "",
      date_to: "",
      severity: "",
    };
    setFilters(defaultFilters);
    auditLogStore.setFilters(defaultFilters);
    auditLogStore.loadLogs(1);
  };

  // Actualizar datos
  const handleRefresh = () => {
    auditLogStore.loadLogs();
  };

  // Manejar cambio de página
  const handlePageChange = (event, newPage) => {
    auditLogStore.loadLogs(newPage + 1);
  };

  // Manejar cambio de filas por página
  const handleRowsPerPageChange = (event) => {
    const newPerPage = parseInt(event.target.value, 10);
    auditLogStore.setPerPage(newPerPage);
    auditLogStore.loadLogs(1);
  };

  // Ver detalles del log
  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  // Eliminar log
  const handleDelete = async (log) => {
    const result = await Swal.fire({
      title: "¿Eliminar registro?",
      text: "Esta acción no se puede deshacer. El registro será eliminado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await auditLogStore.deleteLog(log.id);
        Swal.fire({
          title: "Eliminado",
          text: "Registro eliminado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        handleRefresh();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el registro",
          icon: "error",
        });
      }
    }
  };

  // Exportar logs
  const handleExport = async () => {
    try {
      const result = await Swal.fire({
        title: "Exportar registros",
        text: "¿Deseas exportar los registros filtrados?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, exportar",
      });

      if (result.isConfirmed) {
        await auditLogStore.exportLogs(filters);
        Swal.fire({
          title: "Exportado",
          text: "Registros exportados correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al exportar registros",
        icon: "error",
      });
    }
  };

  // Renderizar carga inicial
  if (loading && logs.length === 0) {
    return (
      <Paper sx={{ borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 2 }}>
          <CircularProgress size={40} />
          <Typography color="textSecondary">Cargando bitácora...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
        {/* Barra de filtros */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <AuditFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            onRefresh={handleRefresh}
            loading={loading}
          />
        </Box>

        {/* Tabla */}
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table aria-label="tabla de auditoría">
            <TableHead sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableRow>
                <TableCell width="5%">ID</TableCell>
                <TableCell width="15%">Fecha/Hora</TableCell>
                <TableCell width="20%">Usuario</TableCell>
                <TableCell width="10%">Evento</TableCell>
                <TableCell width="10%">Módulo</TableCell>
                <TableCell width="25%">Descripción</TableCell>
                <TableCell width="10%">Severidad</TableCell>
                <TableCell width="10%" align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        No hay registros de actividad
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Los eventos del sistema aparecerán aquí
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>
                      <Tooltip title={format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}>
                        <span>
                          {format(new Date(log.created_at), "dd/MM/yyyy HH:mm")}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                          {log.causer?.name?.charAt(0) || 'S'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {log.causer?.name || 'Sistema'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {log.causer?.email || ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <EventBadge event={log.event} />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={log.log_name || log.module} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={log.description}>
                        <Typography variant="body2" sx={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {log.description.length > 50 
                            ? `${log.description.substring(0, 50)}...` 
                            : log.description}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={log.properties?.severity || 'info'} />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" onClick={() => handleViewDetails(log)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {Can("audit.delete") && (
                          <Tooltip title="Eliminar registro">
                            <IconButton size="small" color="error" onClick={() => handleDelete(log)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        {pagination && pagination.total > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  Mostrando {pagination.from || 0} - {pagination.to || 0} de {pagination.total || 0} registros
                </Typography>
              </Grid>
              <Grid item>
                <TablePagination
                  component="div"
                  count={pagination.total || 0}
                  page={(pagination.current_page || 1) - 1}
                  onPageChange={handlePageChange}
                  rowsPerPage={pagination.per_page || 10}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  labelRowsPerPage="Filas por página:"
                  rowsPerPageOptions={[5,10, 25, 50, 100]}
                  showFirstButton
                  showLastButton
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Modal de detalles */}
      <LogDetailsDialog
        open={detailsOpen}
        log={selectedLog}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
});

export default AuditLogTable;