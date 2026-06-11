// TableData.jsx
import { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Chip,
  Box,
  Typography,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Button,
  CircularProgress,
  TableSortLabel,
  alpha,
  useTheme,
  TablePagination,
  Badge as MuiBadge,
} from "@mui/material";
import Swal from "sweetalert2";
import { 
  Edit, 
  Delete, 
  Search, 
  Clear, 
  Refresh,
  CheckCircle,
  Cancel,
  Block,
  PersonAdd,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import userStore from "../../store/UserStore";
import rolStore from "../../store/RolStore";
import authStore from '../../store/AuthStore';
import { styled, alpha as alphaMui } from "@mui/material/styles";

// Badge de estado
const StatusBadge = ({ status }) => {
  const config = {
    1: { label: "Activo", color: "success", icon: <CheckCircle fontSize="small" /> },
    0: { label: "Inactivo", color: "default", icon: <Block fontSize="small" /> },
  };
  
  const current = config[status] || config[0];
  
  return (
    <Chip
      label={current.label}
      color={current.color}
      size="small"
      icon={current.icon}
      sx={{ fontWeight: "medium", minWidth: 80 }}
    />
  );
};

// Componente de filtros
const FiltersBar = ({ filters, onFilterChange, onReset, onRefresh, roles, loading }) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre o email..."
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
                <IconButton size="small" onClick={() => onFilterChange("search", "")} edge="end">
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={6} md={3}>
        <FormControl fullWidth size="small" disabled={loading}>
          <InputLabel>Rol</InputLabel>
          <Select
            value={filters.role_id || ""}
            onChange={(e) => onFilterChange("role_id", e.target.value)}
            label="Rol"
          >
            <MenuItem value="">Todos</MenuItem>
            {roles.map((rol) => (
              <MenuItem key={rol.id} value={rol.id}>
                {rol.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={6} md={2}>
        <FormControl fullWidth size="small" disabled={loading}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filters.status || ""}
            onChange={(e) => onFilterChange("status", e.target.value)}
            label="Estado"
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="1">Activo</MenuItem>
            <MenuItem value="0">Inactivo</MenuItem>
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
          <Tooltip title="Limpiar filtros">
            <IconButton onClick={onReset} size="small" disabled={loading}>
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
    </Grid>
  );
};

const TableData = observer(({ onEdit, onRefresh }) => {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    search: "",
    role_id: "",
    status: "",
  });
  const [loadingAction, setLoadingAction] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const { Can, user: currentUser } = authStore;
  const users = userStore.users || [];
  const roles = rolStore.rols || [];
  const loading = userStore.loading;

  // Cargar datos iniciales
  useEffect(() => {
    userStore.loadUsers();
  }, []);

  // Cargar roles
  useEffect(() => {
    if (roles.length === 0) {
      rolStore.loadRols();
    }
  }, []);

  // Manejar búsqueda con debounce
  const handleSearch = useCallback((value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      userStore.handleFilterChange({ ...filters, search: value });
    }, 500);
    
    setSearchTimeout(timeout);
  }, [filters]);

  // Manejar cambio de filtros
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (key === "search") {
      handleSearch(value);
    } else {
      userStore.handleFilterChange(newFilters);
    }
  };

  // Resetear filtros
  const handleResetFilters = () => {
    const defaultFilters = {
      search: "",
      role_id: "",
      status: "",
    };
    setFilters(defaultFilters);
    userStore.handleFilterChange(defaultFilters);
  };

  // Actualizar datos
  const handleRefresh = () => {
    userStore.loadUsers();
    if (onRefresh) onRefresh();
  };

  // Manejar eliminación de usuario
  const handleDelete = async (user) => {
    // No permitir eliminar el usuario actual
    if (user.id === currentUser?.id) {
      Swal.fire({
        title: "No puedes eliminar tu propio usuario",
        text: "No está permitido eliminar tu propia cuenta.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    
    const result = await Swal.fire({
      title: `¿Eliminar usuario "${user.name}"?`,
      text: "Esta acción no se puede deshacer. El usuario será eliminado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      setLoadingAction(user.id);
      try {
        await userStore.removeUser(user.id);
        Swal.fire({
          title: "Eliminado",
          text: "El usuario ha sido eliminado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        handleRefresh();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el usuario",
          icon: "error",
        });
      } finally {
        setLoadingAction(null);
      }
    }
  };

  // Manejar edición de usuario - IMPORTANTE: Preparar datos para el formulario
  const handleEdit = (user) => {
    // Preparar el usuario con el formato que espera el formulario
    const userForEdit = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role_id: user.role_id || user.rol_id,
      active: user.status === 1,
      status: user.status,
    };
    
    if (onEdit) {
      onEdit(userForEdit);
    }
  };

  // Manejar cambio de estado (activar/desactivar)
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 1 ? 0 : 1;
    const action = newStatus === 1 ? "activar" : "desactivar";
    
    // No permitir desactivar el propio usuario
    if (user.id === currentUser?.id && newStatus === 0) {
      Swal.fire({
        title: "No puedes desactivar tu propio usuario",
        text: "No está permitido desactivar tu propia cuenta.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    
    const result = await Swal.fire({
      title: `¿${action} usuario "${user.name}"?`,
      text: `Estás a punto de ${action} este usuario.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });
    
    if (result.isConfirmed) {
      setLoadingAction(user.id);
      try {
        await userStore.toggleUserStatus(user.id, user.status === 1);
        Swal.fire({
          title: "Actualizado",
          text: `Usuario ${action} correctamente`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        handleRefresh();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `No se pudo ${action} el usuario`,
          icon: "error",
        });
      } finally {
        setLoadingAction(null);
      }
    }
  };

  // Manejar cambio de página
  const handlePageChange = (event, newPage) => {
    userStore.handlePaginationChange(newPage + 1);
  };

  // Manejar cambio de filas por página
  const handleRowsPerPageChange = (event) => {
    const newPerPage = parseInt(event.target.value, 10);
    userStore.filters.per_page = newPerPage;
    userStore.loadUsers(1);
  };

  // Verificar permisos
  const canEdit = (permission) => {
    return Can({ permission });
  };

  // Renderizar carga inicial
  if (loading && users.length === 0) {
    return (
      <Paper sx={{ borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 2 }}>
          <CircularProgress size={40} />
          <Typography color="textSecondary">Cargando usuarios...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
      {/* Barra de filtros */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
        <FiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onRefresh={handleRefresh}
          roles={roles}
          loading={loading}
        />
      </Box>

      {/* Tabla */}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table aria-label="tabla de usuarios">
          <TableHead sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableRow>
              <TableCell width="5%" sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell width="35%" sx={{ fontWeight: "bold" }}>Usuario</TableCell>
              <TableCell width="20%" sx={{ fontWeight: "bold" }}>Rol</TableCell>
              <TableCell width="15%" sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell width="25%" align="center" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No hay usuarios registrados
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Los usuarios aparecerán aquí una vez que los registres
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    "&:hover": {
                      bgcolor: alphaMui(theme.palette.primary.main, 0.04),
                    },
                    transition: "background-color 0.2s",
                    opacity: loadingAction === user.id ? 0.6 : 1,
                  }}
                >
                  <TableCell>{user.id}</TableCell>

                  {/* Columna de Usuario */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: user.status === 1 ? theme.palette.primary.main : theme.palette.grey[500],
                          width: 40,
                          height: 40,
                        }}
                      >
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                          {user.email}
                        </Typography>
                        {user.phone && (
                          <Typography variant="caption" color="textSecondary">
                            {user.phone}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Columna de Rol */}
                  <TableCell>
                    <Chip
                      label={user.role?.name || user.rol_name || "Sin rol"}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ fontWeight: "medium" }}
                    />
                  </TableCell>

                  {/* Columna de Estado */}
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      {/* Editar */}
                      { (
                        <Tooltip title="Editar usuario">
                          <IconButton
                            size="small"
                            sx={{ color: theme.palette.primary.main }}
                            onClick={() => handleEdit(user)}
                            disabled={loadingAction === user.id}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                 

                      {/* Eliminar */}
                      {user.id !== currentUser?.id && (
                        <Tooltip title="Eliminar usuario">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(user)}
                            disabled={loadingAction === user.id}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Indicador de carga */}
                      {loadingAction === user.id && (
                        <CircularProgress size={20} sx={{ ml: 1 }} />
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
      {userStore.pagination && userStore.pagination.total > 0 && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                Mostrando {userStore.users.length > 0 ? ((userStore.pagination.currentPage - 1) * (userStore.pagination.per_page || 10)) + 1 : 0} -{" "}
                {Math.min(
                  userStore.pagination.currentPage * (userStore.pagination.per_page || 10),
                  userStore.pagination.total || 0
                )}{" "}
                de {userStore.pagination.total || 0} usuarios
              </Typography>
            </Grid>
            <Grid item>
              <TablePagination
                component="div"
                count={userStore.pagination.total || 0}
                page={(userStore.pagination.currentPage || 1) - 1}
                onPageChange={handlePageChange}
                rowsPerPage={userStore.pagination.per_page || 10}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage="Filas por página:"
                rowsPerPageOptions={[5, 10, 25, 50]}
                showFirstButton
                showLastButton
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
});

export default TableData;