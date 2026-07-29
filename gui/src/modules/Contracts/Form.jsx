// components/ContractForm.jsx
import { useState, useEffect, useCallback, forwardRef } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  AppBar,
  Toolbar,
  Slide,
} from "@mui/material";
import {
  Save,
  Cancel,
  Person,
  Business,
  AttachMoney,
  Close as CloseIcon,
  Warning,
  Info,
  CheckCircle,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import ContractStore from "../../store/ContractStore";
import PropertyStore from "../../store/PropertyStore";
import ClientStore from "../../store/ClientStore";
import AgentStore from "../../store/AgentStore";
import propertariestore from "../../store/PropertaryStore";
import changeFormat from "../../helper/changeFormat";
import Autocomplete from "@mui/material/Autocomplete";

// Transition para el modal
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ContractForm = observer(({ open, onClose, onSuccess, contract }) => {
  const { seachQueryData, setSearchEdit, setContract } = ContractStore;
  const { client, setClient, clients, setClients } = ClientStore;
  const { propertary, setPropertary, propertaries, setPropertaries } =
    propertariestore;
  const { properties, setProperties, property, setProperty } = PropertyStore;
  const { agent, setAgent, agents, setAgents } = AgentStore;

  // Estados del formulario
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  // Determinar si es edición
  const isEditing = contract && contract.id !== null;

  // Cargar datos iniciales cuando se abre el modal
  useEffect(() => {
    if (open) {
      loadInitialData();
      if (isEditing) {
        loadContractData();
      } else {
        resetForm();
      }
    }
  }, [open, isEditing]);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      const loteDisponible = await PropertyStore.loadProperties();
      await propertariestore.loadPropertaries();
      await AgentStore.loadAgents();
      await ClientStore.loadClients();
      setProperties(loteDisponible.filter((p) => p.status === "disponible"));
    } catch (error) {
      console.error("Error loading data:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los datos necesarios",
        icon: "error",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const loadContractData = () => {
    if (contract) {
      setProperty(contract.property);
      setAgent(contract.agent);
      setPropertary(contract.seller);
      setClient(contract.buyer || {});
    }
  };

  // Validar campo individual
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "buyer_id":
        if (!value) error = "Seleccione un comprador";

        break;
      case "seller_id":
        if (!value) error = "Seleccione un vendedor";
        break;
      case "agent_id":
        if (!value) error = "Seleccione un agente";
        break;
      case "property_id":
        if (!value) error = "Seleccione una propiedad";
        break;
      case "plazo":
        if (!value || value < 1) error = "Plazo debe ser mayor a 0";
        else if (value > 360) error = "Plazo no puede exceder 360 meses";
        break;
      case "advance":
        if (!value && value !== 0) error = "Enganche es requerido";
        else if (value < 0) error = "Enganche debe ser mayor o igual a 0";
        else if (property && value > property.amount_init) {
          error = "Enganche no puede exceder el valor de la propiedad";
        }
        break;
      case "date":
        if (!value) error = "Fecha requerida";
        break;
      default:
        break;
    }

    return error;
  };

  // Manejar selección de propiedad
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const error = validateField(name, value);

    try {
      switch (name) {
        case "advance":
          let advance = { ...contract, advance: changeFormat.inputMoney(e) };

          setContract(advance);
          break;
        case "date":
          let format = changeFormat.toDate(value);

          setContract({ ...contract, date: format });
          break;
        case "status":
          setContract({ ...contract, status: value });
          break;

        case "ref":
          setContract({ ...contract, ref: value });
          break;
        case "plazo":
          setContract({ ...contract, plazo: value });
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Calcular saldo restante
  const calculateBalance = () => {
    if (!property) return 0;
    const advance = changeFormat.toInt(contract.advance) || 0;
    console.log(parseFloat(advance));
    return property.amount_init - parseFloat(advance);
  };

  // Validar todo el formulario
  const validateForm = () => {
    const fieldsToValidate = ["plazo", "advance", "date"];

    let isValid = true;
    const newErrors = {};

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, contract[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  // Guardar contrato
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor complete todos los campos requeridos correctamente",
        icon: "warning",
        customClass: {
          container: "mi-swal-superpuesto", // Clase personalizada
        },
        didOpen: () => {
          // Asegura que el contenedor tenga un z-index mayor
          document.querySelector(".mi-swal-superpuesto").style.zIndex = "20000";
        },
        backdrop: `rgba(0,0,0,0.4)`, // Opcional: personalizar el fondo
      });
      return;
    }

    // Confirmar antes de guardar
    const result = await Swal.fire({
      title: isEditing ? "¿Confirmar actualización?" : "¿Confirmar contrato?",
      html: `
        <div style="text-align: left;">
          <p><strong>Propiedad:</strong> ${property?.name || "N/A"}</p>
          <p><strong>Valor:</strong> ${changeFormat.numberToString(property?.amount_init)}</p>
          <p><strong>Enganche:</strong> ${contract.advance}</p>
          <p><strong>Saldo:</strong> ${changeFormat.numberToString(calculateBalance())}</p>
          <p><strong>Plazo:</strong> ${contract.plazo} meses</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isEditing ? "Sí, actualizar" : "Sí, registrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      customClass: {
        container: "mi-swal-superpuesto", // Clase personalizada
      },
      didOpen: () => {
        // Asegura que el contenedor tenga un z-index mayor
        document.querySelector(".mi-swal-superpuesto").style.zIndex = "20000";
      },
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      contract.buyer_id = client.id;
      contract.property_id = property.id;
      contract.seller_id = propertary.id;
      contract.agent_id = agent.id;
      await ContractStore.addContract(contract);

      Swal.fire({
        title: isEditing ? "¡Contrato actualizado!" : "¡Contrato registrado!",
        text: isEditing
          ? "El contrato ha sido actualizado exitosamente"
          : "El contrato ha sido creado exitosamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error saving contract:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar formulario
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Cancelar y cerrar
  const handleCancel = () => {
    Swal.fire({
      title: "¿Cancelar?",
      text: "Los datos ingresados se perderán",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
      customClass: {
        container: "mi-swal-superpuesto", // Clase personalizada
      },
      didOpen: () => {
        // Asegura que el contenedor tenga un z-index mayor
        document.querySelector(".mi-swal-superpuesto").style.zIndex = "20000";
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleClose();
      }
    });
  };

  // Resetear formulario
  const resetForm = () => {
    setContract({
      buyer_id: "",
      seller_id: "",
      agent_id: "",
      property_id: "",
      plazo: "",
      advance: "",
      paytype: "Efectivo",
      ref: "",
      status: "pendiente",
      date: format(new Date(), "yyyy-MM-dd"),
    });
    setClient(null);
    setAgent(null);
    setPropertary(null);
    setProperty(null);
    setErrors({});
  };

  const searchBy = async (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;

    setSearchEdit(name);

    let error = "";

    if (value !== "" && value !== undefined) {
      switch (name) {
        case "srchproperty":
          setProperties([]);
          let lotes = await seachQueryData("properties", value);
          let lotesdisponibles = lotes.filter((p) => p.status === "disponible");
          setProperties(lotesdisponibles);
          return (error = "Seleccione una propiedad");
          break;
        case "srchagent":
          setAgents([]);
          const agentes = await seachQueryData("agents", value);

          if (!value) error = "Seleccione un agente";
          setAgents(agentes);
          break;
        case "srchseller":
          setPropertaries([]);
          let propietarios = await seachQueryData("sellers", value);
          if (!value) error = "Seleccione un vendedor";
          setPropertaries(propietarios);
          break;

        case "srchclient":
          setClients([]);
          let clientes = await seachQueryData("buyers", value);
          
          setClients(clientes.data);
          if (!value) error = "Seleccione un comprador";
          break;
        default:
          break;
      }
    }
  };

  if (loadingData) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 4,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography>Cargando datos necesarios...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: "primary.main", color: "white" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Business />
            <Typography variant="h6">
              {isEditing ? "Editar Contrato" : "Nuevo Contrato de Compra-Venta"}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCancel}
            sx={{ color: "white" }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <form onSubmit={handleSubmit} id="contract-form">
          <Grid container spacing={3}>
            {/* Comprador */}
            <Grid item size={6}>
              <FormControl fullWidth error={!!errors.client_id} required>
                <Autocomplete
                  sx={{ marginBottom: 2 }}
                  key={"Cliente"}
                  options={clients}
                  value={client}
                  getOptionLabel={(option) => {
                    try {
                      return (
                        option?.id +
                        ".- " +
                        option?.name +
                        " " +
                        option?.lastnames
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  onChange={(e, newValue) => {
                    if (e.currentTarget !== undefined) {
                      // Muestra el valor seleccionado

                      setClient(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={searchBy}
                      name={"srchclient"}
                      label="Cliente"
                      fullWidth
                    />
                  )}
                />
                {errors.client_id && (
                  <FormHelperText>{errors.client_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item size={6}>
              <FormControl fullWidth error={!!errors.buyer_id} required>
                <Autocomplete
                  sx={{ marginBottom: 2 }}
                  key={"propietario"}
                  options={propertaries}
                  value={propertary}
                  getOptionLabel={(option) => {
                    try {
                      return (
                        option?.id +
                        ".- " +
                        option?.name +
                        " " +
                        option?.lastnames
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  onChange={(e, newValue) => {
                    if (e.currentTarget !== undefined) {
                      // Muestra el valor seleccionado
                      setPropertary(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={searchBy}
                      name={"srchseller"}
                      label="Dueño/Vendedor"
                      fullWidth
                    />
                  )}
                />
                {errors.buyer_id && (
                  <FormHelperText>{errors.buyer_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Propiedad */}
            <Grid item size={6}>
              <FormControl fullWidth error={!!errors.property_id} required>
                <Autocomplete
                  sx={{ marginBottom: 2 }}
                  key={"propiedades"}
                  options={properties}
                  value={property}
                  getOptionLabel={(option) => {
                    try {
                      return (
                        option?.id +
                        ".- " +
                        option?.name +
                        " -" +
                        " " +
                        changeFormat.numberToString(option?.amount_init)
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  onChange={(e, newValue) => {
                    if (e.currentTarget !== undefined) {
                      setProperty(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={searchBy}
                      name={"srchclient"}
                      label="Lote"
                      fullWidth
                    />
                  )}
                />

                {errors.property_id && (
                  <FormHelperText>{errors.property_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Agente */}
            <Grid item size={6}>
              <FormControl fullWidth error={!!errors.agent_id} required>
                <Autocomplete
                  sx={{ marginBottom: 2 }}
                  key={"agente"}
                  options={agents}
                  value={agent}
                  getOptionLabel={(option) => {
                    try {
                      return (
                        option?.id +
                        ".- " +
                        option?.name +
                        " " +
                        option?.lastnames
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  onChange={(e, newValue) => {
                    if (e.currentTarget !== undefined) {
                      // Muestra el valor seleccionado

                      setAgent(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={searchBy}
                      name={"srchclient"}
                      label="Agente"
                      fullWidth
                    />
                  )}
                /> 

                {errors.agent_id && (
                  <FormHelperText>{errors.agent_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Fecha */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Fecha del contrato"
                value={contract.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Enganche */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="text"
                name="advance"
                label="Enganche"
                value={contract.advance}
                onChange={handleChange}
                error={!!errors.advance}
                helperText={errors.advance}
                required
              />
            </Grid>

            {/* Tipo de pago */}
            <Grid item size={3}>
              <FormControl fullWidth>
                <InputLabel>Forma de pago</InputLabel>
                <Select
                  name="paytype"
                  value={contract.paytype}
                  onChange={handleChange}
                  label="Tipo de pago"
                >
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                  <MenuItem value="Deposito">Deposito</MenuItem>
                  <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Plazo */}
            <Grid item size={{ sm: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                name="plazo"
                label="Plazo (meses)"
                value={contract.plazo}
                onChange={handleChange}
                error={!!errors.plazo}
                helperText={errors.plazo}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">meses</InputAdornment>
                  ),
                }}
                required
              />
            </Grid>

            {/* Referencia */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="ref"
                label="Referencia"
                value={contract.ref}
                onChange={handleChange}
                placeholder="Número de referencia o folio"
              />
            </Grid>

            {/* Estado */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={contract.status}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="completado">Completado</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Resumen */}
            {property && contract.advance && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Resumen del Contrato
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Valor de la propiedad
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {changeFormat.numberToString(property.amount_init)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Enganche
                      </Typography>
                      <Typography variant="h6" color="warning.main">
                        {contract.advance}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Saldo a financiar
                      </Typography>
                      <Typography
                        variant="h6"
                        color={
                          calculateBalance() > 0 ? "error.main" : "success.main"
                        }
                      >
                        {changeFormat.numberToString(calculateBalance())}
                      </Typography>
                    </Grid>

                    {calculateBalance() < 0 && (
                      <Grid item xs={12}>
                        <Alert severity="warning" icon={<Warning />}>
                          El enganche excede el valor de la propiedad
                        </Alert>
                      </Grid>
                    )}

                    {calculateBalance() > 0 && contract.plazo > 0 && (
                      <Grid item xs={12}>
                        <Alert severity="info" icon={<Info />}>
                          Pago mensual aproximado:{" "}
                          <strong>
                            {changeFormat.numberToString(
                              calculateBalance() / contract.plazo,
                            )}
                          </strong>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 2 }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          startIcon={<Cancel />}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="contract-form"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
        >
          {loading
            ? "Procesando..."
            : isEditing
              ? "Actualizar Contrato"
              : "Registrar Contrato"}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ContractForm;
