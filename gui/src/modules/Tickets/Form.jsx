import {
  Button,
  Card,
  Box,
  TextField,
  DialogActions,
  Alert,
  Typography,
  MenuItem,
  Grid,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState, useCallback, useMemo } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { NumericFormat } from "react-number-format";
import InfoIcon from "@mui/icons-material/Info";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

// Stores
import ContractStore from "../../store/ContractStore";
import TicketStore from "../../store/TicketStore";
import useSaveSub from "../../hooks/useSaveSub";
import ticketValidate from "../../validator/ticketValidate";

// Constantes
const PAYMENT_TYPES = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Deposito", label: "Depósito Bancario" },
  { value: "Transferencia", label: "Transferencia Bancaria" },
  { value: "Tarjeta", label: "Tarjeta de Crédito/Débito" },
  { value: "Cheque", label: "Cheque" },
];

const CONCEPT_TYPES = [
  { value: "Enganche", label: "Enganche" },
  { value: "Mensualidad", label: "Mensualidad" },
  { value: "Pago extraordinario", label: "Pago Extraordinario" },
  { value: "Pago total", label: "Pago Total" },
  { value: "Comisión", label: "Comisión" },
  { value: "Otro", label: "Otro" },
];

export default function Form() {
  // Hooks y stores
  const {
    seachQueryData,
    setSearchEdit,
    contract,
    loadContracts,
    setContract,
  } = ContractStore;
  const [datasContract, setDatasContract] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contractDetails, setContractDetails] = useState(null);

  const { state, errors, setState, handleChange, handleSubmit, handleBlur } =
    useSaveSub(TicketStore.ticket, ticketValidate, TicketStore.addTicket);

  const { id, contract_id, date, concept, amount, paytype, ref } = state;

  // Limpiar formulario
  const resetForm = useCallback(() => {
    setState({
      id: null,
      concept: "Mensualidad",
      contract_id: null,
      paytype: "Efectivo",
      ref: "",
      date: dayjs().format("YYYY-MM-DD"),
      amount: "$ 0.00",
    });
    setContract(null);
    setContractDetails(null);
    setSearchTerm("");
  }, [setState, setContract]);

  // Cargar datos iniciales
  useEffect(() => {
    if (!TicketStore.editing) {
      resetForm();
    } else {
      // Si está editando, cargar datos del recibo
      const ticket = TicketStore.ticket;
      setState({
        ...ticket,
        date: ticket.date || dayjs().format("YYYY-MM-DD"),
      });
      if (ticket.contract_id) {
        loadContractDetails(ticket.contract_id);
      }
    }
  }, [TicketStore.editing]);

  // Cargar detalles del contrato
  const loadContractDetails = useCallback(
    async (contractId) => {
      try {
        const contractData = await ContractStore.showContract(
          "contracts",
          contractId,
        );

        setContractDetails(contractData.contract);
        setContract(contractData.data.contract);
      } catch (error) {
        console.error("Error al cargar detalles del contrato:", error);
      }
    },
    [setContract],
  );

  // Búsqueda de contratos con debounce
  const searchContracts = useCallback(
    async (searchValue) => {
      if (!searchValue || searchValue.length < 2) {
        setDatasContract([]);
        return;
      }
      setLoading(true);
      try {
        const results = await seachQueryData("contracts", searchValue);

        setDatasContract(results.data || []);
      } catch (error) {
        console.error("Error en búsqueda de contratos:", error);
        setDatasContract([]);
      } finally {
        setLoading(false);
      }
    },
    [seachQueryData],
  );

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchContracts(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchContracts]);

  // Guardar recibo
  const saveTicket = async (e) => {
    e.preventDefault();

    // Validaciones previas
    if (!contract_id && !TicketStore.editing) {
      Swal.fire({
        title: "Error",
        text: "Por favor selecciona un contrato",
        icon: "warning",
        timer: 2000,
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "¿Desea guardar los cambios?",
        text: "Esta acción registrará un nuevo pago en el sistema.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#d33",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setLoading(true);
        console.log("Guardando recibo con datos:", state);
        // Preparar datos para guardar
        let amountValue = amount;
        if (typeof amount === "string") {
          amountValue = parseFloat(amount.replace(/[$,]/g, ""));
        }
        const ticketData = {
          ...state,
          contract_id: contract?.id || contract_id,
          amount: parseFloat(amountValue || 0),
        };

        setState(ticketData);
        await handleSubmit(e);
        TicketStore.setHiddenForm(false);
        TicketStore.setEditing(false);
        resetForm();
        await loadContracts();

        Swal.fire({
          title: "¡Éxito!",
          text: "El recibo se registró correctamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Resetear formulario después de guardar
        if (!TicketStore.editing) {
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Error al guardar el recibo",
        icon: "error",
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Formatear monto
  const formatAmount = (value) => {
    if (!value) return "$ 0.00";
    const num = parseFloat(value.toString().replace(/[$,]/g, ""));
    if (isNaN(num)) return "$ 0.00";
    return `$ ${num.toFixed(2)}`;
  };

  // Manejar cambio de monto
  const handleAmountChange = (values) => {
    const { value } = values;
    setState({ ...state, amount: value });
  };

  // Manejar selección de contrato
  const handleContractSelect = (event, newValue) => {
    if (newValue) {
      setContract(newValue);
      setState({ ...state, contract_id: newValue.id });

      setSearchTerm("");
      loadContractDetails(newValue.id);
    } else {
      setContract(null);
      setContractDetails(null);
      setState({ ...state, contract_id: null });
    }
  };

  // Renderizar opciones del autocomplete
  const renderContractOption = useCallback((option) => {
    console.log(option);
    if (!option.id) return "";
    return `C-${option?.id} - ${option?.cliente} `;
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Box component="form" onSubmit={saveTicket} noValidate>
          {/* Encabezado */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <ReceiptIcon sx={{ fontSize: 32, color: "primary.main", mr: 1 }} />
            <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
              {TicketStore.editing ? "Editar Recibo" : "Nuevo Recibo"}
            </Typography>
            {contractDetails && (
              <Chip
                label={`Contrato #${contractDetails.id}`}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {/* Selección de Contrato */}
            <Grid item size={{ sm: 12, md: 5 }}>
              <Autocomplete
                value={contract}
                options={datasContract}
                loading={loading}
                getOptionLabel={renderContractOption}
                onChange={handleContractSelect}
                onInputChange={(e, newInputValue) => {
                  setSearchTerm(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar Contrato"
                    placeholder="Escribe para buscar..."
                    fullWidth
                    required
                    error={!!errors.contract_id}
                    helperText={errors.contract_id}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1">
                        C-{option?.id} -{" "}
                        {option?.cliente ||
                          option?.buyer?.name ||
                          "Sin cliente"}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>

            {/* Información del contrato seleccionado */}
            {contractDetails && (
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: "background.default" }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="textSecondary">
                        Cliente
                      </Typography>
                      <Typography variant="body2">
                        {contractDetails.buyer.name ||
                          contractDetails.cliente ||
                          "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="textSecondary">
                        Propiedad
                      </Typography>
                      <Typography variant="body2">
                        {contractDetails.property || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item size={{ sm: 6, md: 3 }}>
                      <Typography variant="caption" color="textSecondary">
                        Anticipo
                      </Typography>
                      <Typography variant="body2">
                        {contractDetails.advance
                          ? `$ ${contractDetails.advance}`
                          : "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item size={{ sm: 12, md: 3 }}>
                      <Typography variant="caption" color="textSecondary">
                        Estado
                      </Typography>
                      <Chip
                        label={contractDetails.status || "N/A"}
                        size="small"
                        color={
                          contractDetails.status === "activo"
                            ? "success"
                            : "default"
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Fecha del pago */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Fecha del Pago"
                value={dayjs(date)}
                onChange={(newValue) => {
                  setState({
                    ...state,
                    date: newValue ? newValue.format("YYYY-MM-DD") : null,
                  });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.date,
                    helperText: errors.date,
                    onBlur: handleBlur,
                  },
                }}
              />
            </Grid>

            {/* Concepto */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Concepto"
                fullWidth
                required
                name="concept"
                value={concept}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.concept}
                helperText={errors.concept}
                SelectProps={{
                  native: false,
                }}
              >
                {CONCEPT_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Monto */}
            <Grid item xs={12} sm={6}>
              <NumericFormat
                customInput={TextField}
                label="Cantidad ($)"
                fullWidth
                required
                name="amount"
                value={amount}
                onValueChange={handleAmountChange}
                onBlur={handleBlur}
                error={!!errors.amount}
                helperText={errors.amount}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
                prefix="$ "
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title="Monto del pago">
                        <InfoIcon color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Forma de Pago */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Forma de Pago"
                fullWidth
                required
                name="paytype"
                value={paytype}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.paytype}
                helperText={errors.paytype}
              >
                {PAYMENT_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Referencia del pago */}
            <Grid item xs={12}>
              <TextField
                label="Referencia del Pago"
                placeholder="Número de depósito, transferencia o cheque"
                type="text"
                fullWidth
                name="ref"
                value={ref}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.ref}
                helperText={errors.ref || "Ej: DEP-12345, CHQ-001"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title="Número de referencia del pago">
                        <InfoIcon color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Información adicional del recibo (solo edición) */}
            {TicketStore.editing && id && (
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="textSecondary">
                  Recibo #: {id} | Creado:{" "}
                  {TicketStore.ticket.created_at || "N/A"}
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Errores generales */}
          {errors.general && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.general}
            </Alert>
          )}

          {/* Botones de acción */}
          <DialogActions sx={{ p: 3, justifyContent: "flex-end", gap: 1 }}>
            <Button
              onClick={() => {
                TicketStore.setHiddenForm(false);
                TicketStore.setEditing(false);
                resetForm();
              }}
              variant="outlined"
              startIcon={<CancelIcon />}
              sx={{ color: "gray", borderColor: "gray" }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{
                bgcolor: "#4CAF50",
                "&:hover": { bgcolor: "#388E3C" },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Guardar Recibo"}
            </Button>
          </DialogActions>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
