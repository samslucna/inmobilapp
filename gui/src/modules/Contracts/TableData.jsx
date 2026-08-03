// components/ContractTable.jsx
import { useState, Fragment, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Pagination as MuiPagination,
  PaginationItem,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TableSortLabel,
  useTheme,
  useMediaQuery,
  Collapse,
  CardActions,
  alpha,
} from "@mui/material";
import {
  Search,
  Clear,
  Refresh,
  Visibility,
  Edit,
  Delete,
  PictureAsPdf,
  Receipt,
  CheckCircle,
  Cancel,
  Pending,
  Warning,
  FilterList,
  Download,
  Print,
  ExpandMore,
  ExpandLess,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Phone,
  Email,
  LocationOn,
  AttachMoney,
  CalendarToday,
  Person,
  Business,
  Close,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import Swal from "sweetalert2";
import changeFormat from "../../helper/changeFormat";
import ContractStore from "../../store/ContractStore";
import authStore from "../../store/AuthStore";
import usePagination from "../../hooks/usePagination";
import DataTablePagination from "./DataTablePagination";
import ImportInput from "./ImportInput";
import ModalDocIcon from "./ModalDocIcon";
import ModalMuiIcon from "./ModalMuiIcon";
import ModalMuiIconContract from "./ModalMuiIconContract";
import ModalDoc from "./ModalDoc";
import SearchInput from "./SearchInput";
// Componente de estado con chip
const StatusChip = ({ status }) => {
  const theme = useTheme();
  const config = {
    pendiente: {
      label: "Pendiente",
      color: theme.palette.warning.main,
      icon: <Pending fontSize="small" />,
    },
    activo: {
      label: "Activo",
      color: theme.palette.success.main,
      icon: <CheckCircle fontSize="small" />,
    },
    completado: {
      label: "Completado",
      color: theme.palette.info.main,
      icon: <CheckCircle fontSize="small" />,
    },
    cancelado: {
      label: "Cancelado",
      color: theme.palette.error.main,
      icon: <Cancel fontSize="small" />,
    },
  };

  const current = config[status] || {
    label: status,
    color: theme.palette.grey[500],
    icon: null,
  };

  return (
    <Chip
      label={current.label}
      sx={{
        bgcolor: alpha(current.color, 0.1),
        color: current.color,
        fontWeight: "medium",
        minWidth: 100,
      }}
      size="small"
      icon={current.icon}
    />
  );
};

// Componente de tipo de pago
const PayTypeChip = ({ paytype }) => {
  const theme = useTheme();
  const config = {
    Contado: { label: "Contado", color: theme.palette.primary.main },
    Crédito: { label: "Crédito", color: theme.palette.secondary.main },
    Financiamiento: { label: "Financiamiento", color: theme.palette.info.main },
  };

  const current = config[paytype] || {
    label: paytype,
    color: theme.palette.grey[500],
  };

  return (
    <Chip
      label={current.label}
      size="small"
      variant="outlined"
      sx={{
        borderColor: current.color,
        color: current.color,
      }}
    />
  );
};

// Componente de fila para vista móvil (expandible)
const MobileContractRow = ({
  contract,
  onViewDetails,
  onEdit,
  onDelete,
  onViewTickets,
  onGeneratePdf,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { Can } = authStore;
  const theme = useTheme();

  const totalPaid =
    contract.tickets?.reduce((sum, t) => sum + (t.amount || 0), 0) ||
    contract.pagado ||
    0;
  const balance = (contract.property?.amount_init || 0) - totalPaid;

  const statusColor =
    contract.status === "activo"
      ? theme.palette.success.main
      : theme.palette.warning.main;

  return (
    <Card sx={{ mb: 2, borderRadius: 2, overflow: "hidden" }}>
      {/* Cabecera de la tarjeta */}
      <Box
        sx={{
          p: 2,
          bgcolor: alpha(statusColor, 0.08),
          borderLeft: 4,
          borderColor: statusColor,
        }}
      >
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={8}>
            <Typography variant="subtitle1" fontWeight="bold">
              Contrato #{contract.id}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {contract.date}
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "right" }}>
            <StatusChip status={contract.status} />
          </Grid>
        </Grid>
      </Box>

      {/* Contenido principal */}
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Comprador */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {contract.buyer?.name?.charAt(0) || "C"}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {contract.buyer?.name} {contract.buyer?.lastnames}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <Person fontSize="inherit" />
                  Comprador
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Propiedad */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Business fontSize="small" color="action" />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {contract.property?.name || "N/A"}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  <LocationOn
                    fontSize="inherit"
                    sx={{ fontSize: 12, mr: 0.5 }}
                  />
                  {contract.property?.block_id || "Sin ubicación"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Valores */}
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              Valor propiedad
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="success.main">
              {changeFormat.numberToString(contract.property?.amount_init)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              Enganche
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="warning.main">
              {changeFormat.numberToString(contract.advance)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              Pagado
            </Typography>
            <Typography variant="body2" color="info.main">
              {changeFormat.numberToString(totalPaid)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              Saldo
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={balance > 0 ? "error.main" : "success.main"}
            >
              {changeFormat.numberToString(balance)}
            </Typography>
          </Grid>

          {/* Tipo de pago */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <PayTypeChip paytype={contract.paytype} />
              <Typography variant="caption" color="textSecondary">
                Plazo: {contract.plazo} meses
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      {/* Botones de acción */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: "wrap" }}>
        <Tooltip title="Ver detalles">
          <IconButton size="small" onClick={() => onViewDetails(contract)}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Ver recibos">
          <ModalMuiIcon
            data={contract}
            url={"/api/contracts/export/pdf/ticketsPDF?id="}
            color={"error"}
          />
        </Tooltip>

        <Tooltip title="Generar PDF">
          <ModalMuiIconContract
            data={contract}
            url={"/api/contracts/export/pdf/contractExportPDF?id="}
            color={"error"}
          />
        </Tooltip>

        <Can permission={"contratos.update"}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(contract)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        </Can>

        <Can permission={"contratos.delete"}>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(contract)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Can>

        <Tooltip title="Expandir">
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Tooltip>
      </CardActions>

      {/* Información expandida */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Información del Comprador
              </Typography>
              <Typography variant="body2">
                {contract.buyer?.name} {contract.buyer?.lastnames}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Email fontSize="inherit" /> {contract.buyer?.email || "N/A"}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Phone fontSize="inherit" /> {contract.buyer?.phone || "N/A"}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Información del Vendedor
              </Typography>
              <Typography variant="body2">
                {contract.seller?.name} {contract.seller?.lastnames}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                <Email fontSize="inherit" /> {contract.seller?.email || "N/A"}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Información del Agente
              </Typography>
              <Typography variant="body2">
                {contract.agent?.name} {contract.agent?.lastnames}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Comisión: {contract.agent?.commission_rate || "N/A"}%
              </Typography>
            </Box>

            {contract.ref && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Referencia
                  </Typography>
                  <Typography variant="body2">{contract.ref}</Typography>
                </Box>
              </>
            )}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

// Filtros de la tabla (responsivos)
const ContractFilters = ({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  loading,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <ImportInput />
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por contrato, comprador, propiedad..."
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
                  <IconButton
                    size="small"
                    onChange={() => onFilterChange("search", "")}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <ImportInput />
          </Box>
        </Grid>
      </Grid>

      {/* Filtros expandibles */}
      <Collapse in={showFilters}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            {/*     <FormControl fullWidth size="small" disabled={loading}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.status || ""}
                onChange={(e) => onFilterChange("status", e.target.value)}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="completado">Completado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl> */}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/*      <FormControl fullWidth size="small" disabled={loading}>
              <InputLabel>Tipo de pago</InputLabel>
              <Select
                value={filters.paytype || ""}
                onChange={(e) => onFilterChange("paytype", e.target.value)}
                label="Tipo de pago"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Contado">Contado</MenuItem>
                <MenuItem value="Crédito">Crédito</MenuItem>
                <MenuItem value="Financiamiento">Financiamiento</MenuItem>
              </Select>
            </FormControl> */}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/*     <TextField
              fullWidth
              size="small"
              label="Fecha desde"
              type="date"
              value={filters.date_from || ""}
              onChange={(e) => onFilterChange("date_from", e.target.value)}
              InputLabelProps={{ shrink: true }}
            /> */}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Fecha hasta"
              type="date"
              value={filters.date_to || ""}
              onChange={(e) => onFilterChange("date_to", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Collapse>
    </Box>
  );
};

// Modal de detalles del contrato (responsivo)
const ContractDetailsDialog = ({ open, contract, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!contract) return null;

  const totalPaid =
    contract.tickets?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  const balance = (contract.property?.amount_init || 0) - totalPaid;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Receipt color="primary" />
            <Typography variant="h6">
              Detalles del Contrato #{contract.id}
            </Typography>
          </Box>
          {isMobile && (
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Propiedad
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {contract.property?.title || "N/A"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              <LocationOn fontSize="inherit" sx={{ fontSize: 12, mr: 0.5 }} />
              {contract.property?.location || "Sin ubicación"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Comprador
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Avatar sx={{ width: 24, height: 24 }}>
                {contract.buyer?.name?.charAt(0) || "C"}
              </Avatar>
              <Box>
                <Typography variant="body2">
                  {contract.buyer?.name} {contract.buyer?.lastnames}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {contract.buyer?.email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Vendedor
            </Typography>
            <Typography variant="body2">
              {contract.seller?.name} {contract.seller?.lastnames}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Agente
            </Typography>
            <Typography variant="body2">
              {contract.agent?.name} {contract.agent?.lastnames}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Valor Propiedad
            </Typography>
            <Typography variant="h6" color="success.main">
              {changeFormat.numberToString(contract.property?.amount_init)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Enganche
            </Typography>
            <Typography variant="h6" color="warning.main">
              {changeFormat.numberToString(contract.advance)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Pagado
            </Typography>
            <Typography variant="h6" color="info.main">
              {changeFormat.numberToString(totalPaid)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Saldo
            </Typography>
            <Typography
              variant="h6"
              color={balance > 0 ? "error.main" : "success.main"}
            >
              {changeFormat.numberToString(balance)}
            </Typography>
          </Grid>

          {contract.tickets?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Pagos realizados
              </Typography>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ maxHeight: 300, overflow: "auto" }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Concepto</TableCell>
                      <TableCell align="right">Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contract.tickets.map((ticket, idx) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{ticket.date}</TableCell>
                        <TableCell>{ticket.concept}</TableCell>
                        <TableCell align="right">
                          {changeFormat.numberToString(ticket.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        {/* <Button variant="contained" startIcon={<Print />}>
          Imprimir
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

const ContractTable = observer(
  ({ datasTable, onEdit, onRefresh, loading: externalLoading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { Can } = authStore;

    const [filters, setFilters] = useState({
      search: "",
      status: "",
      paytype: "",
      date_from: "",
      date_to: "",
    });
    const [selectedContract, setSelectedContract] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [orderBy, setOrderBy] = useState("id");
    const [order, setOrder] = useState("desc");
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const {
      page,
      rowsPerPage,
      totalCount, 
      totalPages,
      from,
      to,
      handlePageChange,
      handleRowsPerPageChange,
    } = usePagination(ContractStore, ContractStore.loadContracts);

    // Filtrar datos
    const filteredData =
      datasTable?.filter((item) => {
        if (
          filters.search &&
          !item.id.toString().includes(filters.search) &&
          !item.buyer?.name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) &&
          !item.property?.name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
        ) {
          return false;
        }
        if (filters.status && item.status !== filters.status) return false;
        if (filters.paytype && item.paytype !== filters.paytype) return false;
        if (
          filters.date_from &&
          new Date(item.date) < new Date(filters.date_from)
        )
          return false;
        if (filters.date_to && new Date(item.date) > new Date(filters.date_to))
          return false;
        return true;
      }) || [];

    // Ordenar datos
    const sortedData = [...filteredData].sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (orderBy === "buyer_name") {
        aVal = a.buyer?.name;
        bVal = b.buyer?.name;
      }
      if (orderBy === "property_title") {
        aVal = a.property?.title;
        bVal = b.property?.title;
      }
      if (orderBy === "amount") {
        aVal = a.property?.amount_init;
        bVal = b.property?.amount_init;
      }

      if (order === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    const handleFilterChange = (key, value) => {
      let filter = { ...filters, [key]: value };
      //filter.per_page = 10;
      ContractStore.loadContracts(value);
      setFilters(filter);
    };

    const handleResetFilters = () => {
      setFilters({
        search: "",
        status: "",
        paytype: "",
        date_from: "",
        date_to: "",
      });
    };

    const handleSort = (property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

    const handleViewDetails = (contract) => {
      setSelectedContract(contract);
      setDetailsOpen(true);
    };

    const handleEdit = (contract) => {
      if (onEdit) {
        onEdit(contract);
      }
    };

    const handleDelete = async (contract) => {
      const result = await Swal.fire({
        title: "¿Eliminar contrato?",
        text: `Estás a punto de eliminar el contrato #${contract.id}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        setActionLoading(contract.id);
        try {
          await ContractStore.deleteContract(contract.id);
          Swal.fire({
            title: "Eliminado",
            text: "Contrato eliminado correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          if (onRefresh) onRefresh();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el contrato",
            icon: "error",
          });
        } finally {
          setActionLoading(null);
        }
      }
    };

    const handleViewTickets = (contractId) => {
      console.log("Ver tickets del contrato:", contractId);
    };

    const handleGeneratePdf = async (contract) => {
      try {
        Swal.fire({
          title: "Generando PDF",
          text: "Por favor espere...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        await new Promise((resolve) => setTimeout(resolve, 1500));

        Swal.close();
        Swal.fire({
          title: "PDF generado",
          text: "El documento se ha generado correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo generar el PDF",
          icon: "error",
        });
      }
    };

    const isLoading = externalLoading || loading;

    if (isLoading && (!datasTable || datasTable.length === 0)) {
      return (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2 }}>Cargando contratos...</Typography>
        </Paper>
      );
    }

    // Componente de paginación personalizado para móvil
    const MobilePagination = () => {
      const handleMobilePageChange = (event, value) => {
        ContractStore.changePage(value);
      };

      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <MuiPagination
            count={totalPages}
            page={page + 1}
            onChange={handleMobilePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  minWidth: isMobile ? 36 : 40,
                  height: isMobile ? 36 : 40,
                }}
              />
            )}
          />
        </Box>
      );
    };

    return (
      <>
        <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
          {/* Filtros */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <ImportInput  />
            <SearchInput />
          </Box>

          {/* Tabla o Tarjetas */}
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              {/* Vista móvil con tarjetas */}
              {datasTable.length === 0 ? (
                <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                  No hay contratos registrados
                </Typography>
              ) : (
                datasTable.map((contract) => (
                  <MobileContractRow
                    key={contract.id}
                    contract={contract}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewTickets={handleViewTickets}
                    onGeneratePdf={handleGeneratePdf}
                  />
                ))
              )}

              {/* Paginación móvil */}
              {totalPages > 1 && <MobilePagination />}

              {/* Info de registros móvil */}
              <Box
                sx={{
                  textAlign: "center",
                  mt: 2,
                  pt: 2,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  Mostrando {from} - {to} de {totalCount} registros
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              {/* Vista desktop con tabla */}
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table stickyHeader>
                  {/* Cabeceras de tabla... */}

                  <TableHead>
                    <TableRow>
                      <TableCell width="5%">#</TableCell>
                      <TableCell width="12%">Fecha</TableCell>
                      <TableCell width="18%">Comprador</TableCell>
                      <TableCell width="20%">Propiedad</TableCell>
                      <TableCell width="10%">Valor</TableCell>
                      <TableCell width="10%">Estado</TableCell>
                      <TableCell width="10%">Tipo Pago</TableCell>
                      <TableCell width="15%" align="center">
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Datos de la tabla... */}
                    {datasTable &&
                      datasTable.map((contract) => (
                        <TableRow key={contract.id} hover>
                          <TableCell>{contract.id}</TableCell>
                          <TableCell>
                            {changeFormat.toDate(contract.date)}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: theme.palette.primary.main,
                                }}
                              >
                                {contract.buyer?.name?.charAt(0) || "C"}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {contract.buyer?.name}{" "}
                                  {contract.buyer?.lastnames}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {contract.buyer?.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              Lote: {contract.property?.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Manzana: {contract.property?.block_id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="success.main"
                            >
                              {changeFormat.numberToString(
                                contract.property?.amount_init,
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <StatusChip status={contract?.property?.status} />
                          </TableCell>
                          <TableCell>
                            <PayTypeChip paytype={contract?.paytype} />
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                justifyContent: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              <Tooltip title="Ver detalles">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewDetails(contract)}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip mb={5} title="Ver recibos">
                                <ModalMuiIcon
                                  data={contract}
                                  url={
                                    "/api/contracts/export/pdf/ticketsPDF?id="
                                  }
                                  color={"error"}
                                />
                              </Tooltip>

                              <Tooltip title="Generar PDF">
                                <ModalMuiIconContract
                                  data={contract}
                                  url={"/api/contracts/export/pdf/contractExportPDF?id="}
                                  color={"error"}
                                />
                              </Tooltip>

                              <Can permission={"contratos.update"}>
                                <Tooltip title="Editar">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEdit(contract)}
                                    disabled={actionLoading === contract.id}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Can>

                              <Can permission={"contratos.delete"}>
                                <Tooltip title="Eliminar">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(contract)}
                                    disabled={actionLoading === contract.id}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Can>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Paginación desktop */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      Mostrando {from} - {to} de {totalCount} registros
                    </Typography>
                  </Grid>
                  <Grid item>
                    <DataTablePagination
                      totalCount={totalCount}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      from={from}
                      to={to}
                      isLoading={ContractStore.loading}
                    />
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Paper>
        {/* Modal de detalles */}
        <ContractDetailsDialog
          open={detailsOpen}
          contract={selectedContract}
          onClose={() => setDetailsOpen(false)}
        />
      </>
    );
  },
);

export default ContractTable;
