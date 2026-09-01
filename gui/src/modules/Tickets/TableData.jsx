import { useState, Fragment } from "react";
import { observer } from "mobx-react-lite";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
  CardActions,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";

import TicketStore from "../../store/TicketStore";
import PropertyStore from "../../store/PropertyStore";
import PropertaryStore from "../../store/PropertaryStore";
import ContractStore from "../../store/ContractStore";
import authStore from "../../store/AuthStore";
import changeFormat from "../../helper/changeFormat";
import usePagination from "../../hooks/usePagination";
import ModalDocIcon from "./ModalDocIcon";

const TableData = observer(({ setPaginate,setData,filters,datasTable, loading: externalLoading }) => {
  const { Can } = authStore;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    const resp = await Swal.fire({
      title: "¿Está por eliminar este recibo?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.grey[500],
    });

    if (resp.isConfirmed) {
      await TicketStore.removeTicket(id);
      const load = await TicketStore.loadTickets(1, filters);

      setData(load.data)
      setPaginate(load)
      Swal.fire({
        title: "Eliminado",
        text: "El recibo ha sido eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const goEdit = async (ticket) => {
    const contract = await ContractStore.showContract(
      "contracts",
      ticket.contract_id,
    );

    if (ticket.nticket === null) {
      ticket.nticket = 0;
    }
    console.log(ticket);
    ContractStore.setContract(contract.contract);

    TicketStore.setEditing(true);
    TicketStore.setEditId(ticket.id);
    TicketStore.setTicket(ticket);
    TicketStore.setHiddenForm(true);
  };

  const {
    page,
    rowsPerPage,
    totalCount,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination(TicketStore, TicketStore.loadTickets);

  const isLoading = externalLoading || loading;

  const getStatusChip = (status) => {
    const statusLower = status?.toLowerCase() || "";
    let color = "default";

    if (["pagado", "activo", "completado"].includes(statusLower)) {
      color = "success";
    } else if (["pendiente", "proceso"].includes(statusLower)) {
      color = "warning";
    } else if (["cancelado", "eliminado"].includes(statusLower)) {
      color = "error";
    }

    return (
      <Chip
        label={status?.toUpperCase() || "N/A"}
        color={color}
        size="small"
        sx={{ fontWeight: "bold" }}
      />
    );
  };

  if (isLoading && (!datasTable || datasTable.length === 0)) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Cargando recibos...
        </Typography>
      </Paper>
    );
  }

  const hasData = Array.isArray(datasTable) && datasTable.length > 0;

  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden", borderRadius: 2, boxShadow: 2 }}
    >
      {/* VISTA DESKTOP: TABLA MATERIAL UI */}
      {!isMobile ? (
        <TableContainer sx={{ maxHeight: 650 }}>
          <Table stickyHeader aria-label="tabla de recibos">
            <TableHead>
              <TableRow>
                <TableCell fontWeight="bold">ID</TableCell>
                <TableCell fontWeight="bold">Fecha</TableCell>
                <TableCell fontWeight="bold">Numero</TableCell>
                <TableCell fontWeight="bold">Cliente</TableCell>
                <TableCell fontWeight="bold">Concepto</TableCell>
                <TableCell fontWeight="bold">Pago</TableCell>
                <TableCell align="right" fontWeight="bold">
                  Monto ($)
                </TableCell>
                <TableCell align="center" fontWeight="bold">
                  Estatus
                </TableCell>
                <TableCell align="center" fontWeight="bold">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hasData ? (
                datasTable.map((data, i) => {
                  const clientName = data?.contract?.buyer
                    ? `${data.contract.buyer.name || ""} ${data.contract.buyer.lastnames || ""}`.trim()
                    : "N/A";

                  return (
                    <TableRow hover key={data.id || i}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          #{data?.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{data?.date}</TableCell>
                      <TableCell>{data?.nticket}</TableCell>
                      <TableCell>{clientName}</TableCell>
                      <TableCell>{data?.concept}</TableCell>
                      <TableCell>{data?.paytype}</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="success.main"
                        >
                          {changeFormat.numberToString(data?.amount || 0)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        {getStatusChip(data?.status)}
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Can permission={"recibos.delete"}>
                            <Tooltip title="Eliminar recibo">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(data.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Can>

                          <Can permission={"recibos.update"}>
                            <Tooltip title="Editar recibo">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => goEdit(data)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Can>

                          <ModalDocIcon
                            data={data}
                            url={"/api/tickets/export/pdf/ticket?id="}
                            color={"primary"}
                            title={"Recibo #" + data.id}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No se encontraron recibos registrados.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        /* VISTA MÓVIL: TARJETAS RESPONSIVAS */
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {hasData ? (
            datasTable.map((data, i) => {
              const clientName = data?.contract?.buyer
                ? `${data.contract.buyer.name || ""} ${data.contract.buyer.lastnames || ""}`.trim()
                : "N/A";

              return (
                <Card
                  key={data.id || i}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <ReceiptIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight="bold">
                          Recibo #{data.id}
                        </Typography>
                      </Box>
                      {getStatusChip(data.status)}
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="body2" color="text.secondary">
                      <strong>Cliente:</strong> {clientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fecha:</strong> {data.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Concepto:</strong> {data.concept}
                    </Typography>
                     <Typography variant="body2" color="text.secondary">
                      <strong>Pago:</strong> {data?.paytype}
                    </Typography>

                    <Box
                      mt={1}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="caption" color="text.secondary">
                        Monto Total:
                      </Typography>
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight="bold"
                      >
                        {changeFormat.numberToString(data.amount || 0)}
                      </Typography>
                    </Box>
                  </CardContent>

                  <Divider />

                  <CardActions
                    sx={{ justifyContent: "flex-end", bg: "grey.50" }}
                  >
                    <Can permission={"recibos.delete"}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(data.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Can>
                    <Can permission={"recibos.update"}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => goEdit(data)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Can>

                    <ModalDocIcon
                      data={data}
                      url={"/api/tickets/export/pdf/ticket?id="}
                      color={"primary"}
                      title={"Recibo #" + data.id}
                    />
                  </CardActions>
                </Card>
              );
            })
          ) : (
            <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
              No se encontraron recibos registrados.
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
});

export default TableData;
