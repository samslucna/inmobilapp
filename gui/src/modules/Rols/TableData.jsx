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
  Box,
  Typography,
  Tooltip,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";
import Swal from "sweetalert2";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import RolStore from "../../store/RolStore";
import TablePermission from "./TablePermission";
import { useState, useEffect } from "react";

const TableData = observer(({ datas }) => {
  const [selectedRolId, setSelectedRolId] = useState(null);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [error, setError] = useState(null);

  // Limpiar selección cuando cambian los datos
  useEffect(() => {
    if (!datas || datas.length === 0) {
      setSelectedRolId(null);
      RolStore.setPermissions([]);
    }
  }, [datas]);

  const handleDelete = async (id, name) => {
    const resp = await Swal.fire({
      title: `¿Eliminar rol "${name}"?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (resp.isConfirmed) {
      try {
        await RolStore.removeRol(id);
        
        // Si el rol eliminado era el seleccionado, limpiar permisos
        if (selectedRolId === id) {
          setSelectedRolId(null);
          RolStore.setPermissions([]);
        }
        
        Swal.fire({
          title: "Eliminado",
          text: "El rol ha sido eliminado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el rol",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  };

  const handleChange = (e, value) => {
    RolStore.handlePaginationChange(value);
  };

  const getPermissions = async (rol) => {
    if (!rol || !rol.id) return;
    
    // Si ya está seleccionado el mismo rol, no hacer nada
    if (selectedRolId === rol.id) return;
    
    setLoadingPermissions(true);
    setError(null);
    setSelectedRolId(rol.id);
    
    try {
      // Limpiar permisos anteriores mientras carga
      RolStore.setPermissions([]);
      
      // Obtener permisos del rol seleccionado
      let rebuild = RolStore.getPermissionActive(rol);
      
      // Si rebuild es null o undefined, inicializar como array vacío
      if (!rebuild) {
        rebuild = [];
      }
      
      // Actualizar permisos en el store
      RolStore.setPermissions(rebuild);
      
      // También actualizar el rol actual en el store
      RolStore.setRol({
        id: rol.id,
        name: rol.name,
        guard_name: rol.guard_name || "web"
      });
      
    } catch (error) {
      console.error("Error cargando permisos:", error);
      setError("Error al cargar los permisos del rol");
      RolStore.setPermissions([]);
    } finally {
      setLoadingPermissions(false);
    }
  };

  // Verificar si un rol está activo (seleccionado)
  const isRolSelected = (rolId) => selectedRolId === rolId;

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <Grid container spacing={2}>
        {/* Columna de lista de roles */}
        <Grid size={{ sm: 12, md: 5 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Lista de Roles
            </Typography>
          </Box>
          
          <Table aria-label="tabla de roles">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell width="10%">ID</TableCell>
                <TableCell width="60%">Nombre</TableCell>
                <TableCell width="30%" align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datas && datas.length > 0 ? (
                datas.map((rol) => (
                  <TableRow
                    key={rol?.id}
                    onClick={() => getPermissions(rol)}
                    hover
                    sx={{
                      cursor: "pointer",
                      backgroundColor: isRolSelected(rol?.id) ? "action.selected" : "inherit",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>{rol?.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: isRolSelected(rol?.id) ? "primary.main" : "grey.500" }}>
                          {rol?.name?.charAt(0)?.toUpperCase() || "R"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: isRolSelected(rol?.id) ? "bold" : "normal" }}
                          >
                            {rol?.name}
                          </Typography>
                          {isRolSelected(rol?.id) && (
                            <Chip
                              label="Seleccionado"
                              size="small"
                              color="primary"
                              sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar rol">
                        <IconButton
                          sx={{ color: "blue" }}
                          onClick={(e) => {
                            e.stopPropagation(); // Evitar que se dispare el onClick de la fila
                            RolStore.goEdit(rol);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar rol">
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation(); // Evitar que se dispare el onClick de la fila
                            handleDelete(rol?.id, rol?.name);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      No hay roles disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Paginación */}
          {RolStore.pagination?.last_page > 1 && (
            <Stack spacing={2} sx={{ padding: 2, alignItems: "center" }}>
              <Pagination
                count={RolStore.pagination.last_page}
                page={RolStore.pagination.currentPage || 1}
                onChange={handleChange}
                color="primary"
                size="large"
              />
            </Stack>
          )}
        </Grid>
        
        {/* Columna de permisos */}
        <Grid size={{ sm: 12, md: 7 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Configuración de Permisos
              {selectedRolId && (
                <Chip
                  label={`Rol ID: ${selectedRolId}`}
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
          </Box>
          
          {loadingPermissions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Cargando permisos...</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : !selectedRolId ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Visibility sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography color="textSecondary">
                Selecciona un rol de la lista para ver y editar sus permisos
              </Typography>
            </Box>
          ) : (
            <TablePermission permission={RolStore.permissions} />
          )}
        </Grid>
      </Grid>
    </TableContainer>
  );
});

export default TableData;