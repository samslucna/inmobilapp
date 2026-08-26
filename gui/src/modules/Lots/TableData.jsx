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
  Chip,
  Collapse,
  Stack,
  useTheme,
  useMediaQuery,
  Skeleton,
  Pagination,
} from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import { Edit, Delete, Visibility, ExpandMore, ExpandLess, Business, AttachMoney } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import PropertyStore from "../../store/PropertyStore";
import { styled, alpha } from "@mui/material/styles";
import BoundaryStore from "../../store/BoundaryStore";
import changeFormat from "../../helper/changeFormat";
import authStore from "../../store/AuthStore";
import PropertyFilters from "./PropertyFilters";
import ViewDetails from "./ViewDetails";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const TableData = observer(({ datas, changePage, paginate, loading = false }) => {
  const { Can } = authStore;
  const { handlePaginationChange, filters } = PropertyStore;
  const [state, setState] = useState({});
  const [loadView, setLoadView] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Asignar colores dinámicos al Chip según el Status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "disponible":
        return "success";
      case "pendiente":
        return "warning";
      case "pagado":
      case "finiquitado":
        return "info";
      case "cancelado":
        return "error";
      default:
        return "default";
    }
  };

  // Formatear status para mostrar
  
  const formatStatus = (status) => {
    return status?.toUpperCase() || "N/A";
  };

  // Manejar expansión de fila en móviles
  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDelete = async (id) => {
    const resp = await Swal.fire({
      title: "¿Eliminar lote?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (resp.isConfirmed) {
      await PropertyStore.removeProperty(id);

      Swal.fire({
        title: "Eliminado",
        text: "El lote ha sido eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleChange = async (e, value) => {
    e.preventDefault();
    await handlePaginationChange(value);
  };

  const goEdit = async (property) => {
  
    BoundaryStore.setBoundaries(property.boundaries);
    const data = {
      ...property,
      boundaries: BoundaryStore.Boundaries,
    };

    PropertyStore.setEditing(true);
    PropertyStore.setEditId(property.id);
    PropertyStore.setProperty(data);
    PropertyStore.setHiddenForm(true);
  };

  const getView = (e, property) => {
    e.preventDefault();
    setState(property);
    setLoadView(true);
  };

  const closeView = (e) => {
    e.preventDefault();
    setLoadView(false);
  };

  // Esqueleto de carga
  const renderSkeleton = () => {
    const columns = isMobile ? 4 : 8;
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={`skeleton-cell-${colIndex}`}>
            <Skeleton 
              variant="text" 
              width={colIndex === 0 ? 30 : colIndex === 1 ? 80 : 60} 
            />
          </TableCell>
        ))}
        {!isMobile && (
          <TableCell align="right">
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </TableCell>
        )}
      </TableRow>
    ));
  };

  // Filas compactas para móviles
  const renderMobileRow = (property) => {
    const isExpanded = expandedRow === property.id;

    return (
      <>
        {/* Fila principal compacta */}
        <TableRow
          key={`${property.id}-main`}
          hover
          onClick={() => toggleRowExpansion(property.id)}
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <TableCell>
            <Typography variant="caption" fontWeight="bold">
              {property.id}
            </Typography>
          </TableCell>
          <TableCell>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box>
                <Typography variant="body2" fontWeight="bold" noWrap>
                  {property.name}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  {property.m2}
                </Typography>
              </Box>
            </Box>
          </TableCell>
          <TableCell>
            <Chip
              label={formatStatus(property.status)}
              color={getStatusColor(property.status)}
              size="small"
              sx={{ fontSize: "0.65rem" }}
            />
          </TableCell>
          <TableCell align="right">
            <IconButton size="small">
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </TableCell>
        </TableRow>

        {/* Fila expandida con detalles adicionales */}
        <TableRow key={`${property.id}-expanded`}>
          <TableCell colSpan={4} sx={{ p: 0, borderBottom: "none" }}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, backgroundColor: "grey.50" }}>
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      <Business fontSize="inherit" sx={{ mr: 0.5 }} />
                      Proyecto
                    </Typography>
                    <Typography variant="body2">
                      {property?.project_name || "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      Etapa
                    </Typography>
                    <Typography variant="body2">
                      {property?.etapa || "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      Manzana
                    </Typography>
                    <Typography variant="body2">
                      {property.manzana || "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      <AttachMoney fontSize="inherit" sx={{ mr: 0.5 }} />
                      Precio
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {changeFormat.numberToString(property.amount_init)}
                    </Typography>
                  </Box>

                  {/* Acciones en móvil */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      mt: 1,
                      pt: 1,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Can permission={"lotes.read"}>
                      <Tooltip title="Ver">
                        <IconButton
                          size="small"
                          sx={{ color: "#2895a3" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            getView(e, property);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Can>
                    <Can permission={"lotes.update"}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          sx={{ color: "blue" }}
                          onClick={() => {
                            goEdit(property);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Can>
                    <Can permission={"lotes.delete"}>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            handleDelete(property.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Can>
                  </Box>
                </Stack>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  // Fila para desktop/tablet
  const renderDesktopRow = (property) => (
    <TableRow key={property.id} hover>
      <TableCell>{property.id}</TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {property.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {property.m2}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{property.manzana}</TableCell>
      <TableCell>{property?.etapa || "N/A"}</TableCell>
      <TableCell>{property?.project_name || "N/A"}</TableCell>
      <TableCell>
        {changeFormat.numberToString(property.amount_init)}
      </TableCell>
      <TableCell>
        <Chip
          label={formatStatus(property.status)}
          color={getStatusColor(property.status)}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <Can permission={"lotes.read"}>
            <Tooltip title="Ver">
              <IconButton
                size="small"
                sx={{ color: "#2895a3" }}
                onClick={(e) => getView(e, property)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Can>
          <Can permission={"lotes.update"}>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                sx={{ color: "blue" }}
                onClick={() => goEdit(property)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Can>
          <Can permission={"lotes.delete"}>
            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(property.id)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Can>
        </Box>
      </TableCell>
    </TableRow>
  );

  // Componente de paginación
  const renderPagination = () => {
    if (!paginate || paginate.totalPages <= 1) return null;

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 2,
          px: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Pagination
          count={paginate.totalPages}
          page={paginate.currentPage}
          onChange={handleChange}
          color="primary"
          size={isMobile ? "small" : "medium"}
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 1 : 2}
        />
      </Box>
    );
  };

  return (
    <>
      <ViewDetails open={loadView} state={state} onClose={closeView} />
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          boxShadow: 3,
          overflowX: "auto",
          width: "100%",
        }}
      >
        <Table 
          aria-label="tabla de lotes"
          size={isMobile ? "small" : "medium"}
          stickyHeader={!isMobile}
        >
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            {isMobile ? (
              // Encabezado compacto para móvil
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            ) : (
              // Encabezado completo para desktop
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre/Clave</TableCell>
                <TableCell>Manzana</TableCell>
                <TableCell>Etapa</TableCell>
                <TableCell>Proyecto</TableCell>
                <TableCell>$ Precio</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {loading ? (
              renderSkeleton()
            ) : datas && datas.length > 0 ? (
              datas.map((property) =>
                isMobile
                  ? renderMobileRow(property)
                  : renderDesktopRow(property)
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 4 : 8}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography variant="body1" color="textSecondary">
                    No se encontraron lotes
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Paginación */}
        {renderPagination()}
      </TableContainer>
    </>
  );
});

export default TableData;