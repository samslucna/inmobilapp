import { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import {
  Receipt,
  LocationOn,
  Close,
  Map as MapIcon,
  ExpandMore,
  ExpandLess,
  Event,
  Business,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import changeFormat from "../../helper/changeFormat";

const ViewDetails = observer(({ open, state, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showMap, setShowMap] = useState(false);

  if (!state) return null;

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
      default:
        return "default";
    }
  };

  const hasCoordinates =
    state.latitude &&
    state.longitude &&
    state.latitude !== "00000" &&
    state.longitude !== "00000";

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
            <Typography variant="h6" fontWeight="bold">
              Detalles del Lote #{state.id}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2}>
          {/* Nombre y Ubicación del Proyecto */}
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" color="textSecondary">
              Proyecto / Desarrollo
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {state.project_name || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
            >
              <Business fontSize="inherit" sx={{ mr: 0.5 }} />
              {state.etapa || "Sin Etapa"}
            </Typography>
          </Grid>

          {/* Status del Lote */}
          <Grid item xs={12} sm={4} sx={{ textAlign: { sm: "right" } }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Estatus
            </Typography>
            <Chip
              label={state.status?.toUpperCase() || "N/A"}
              color={getStatusColor(state.status)}
              sx={{ fontWeight: "bold" }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Manzana, Lote y Fecha */}
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Manzana / Lote
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {state.manzana || "0"}
              </Avatar>
              <Typography variant="body1" fontWeight="bold">
                Lote {state.name || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Fecha de Contrato
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}
            >
              <Event fontSize="small" color="action" />
              {state.fecha_contrato ? state.fecha_contrato : "Sin Contrato"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Ubicación GPS
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {state.latitude && state.longitude
                ? `${state.latitude}, ${state.longitude}`
                : "No disponible"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Información Financiera */}
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center" }}>
              <Typography variant="caption" color="textSecondary">
                Monto Inicial (Precio)
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {changeFormat.numberToString(state.amount_init || 0)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center" }}>
              <Typography variant="caption" color="textSecondary">
                Total Pagado
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {changeFormat.numberToString(state.total_pagado || 0)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center" }}>
              <Typography variant="caption" color="textSecondary">
                Saldo Pendiente
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={state.saldo > 0 ? "error.main" : "success.main"}
              >
                {changeFormat.numberToString(state.saldo || 0)}
              </Typography>
            </Paper>
          </Grid>

          {/* BOTÓN Y SECCIÓN DEL MAPA (COLLAPSE) */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              disabled={!hasCoordinates}
              startIcon={<MapIcon />}
              endIcon={showMap ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowMap(!showMap)}
            >
              {hasCoordinates
                ? showMap
                  ? "Ocultar Ubicación en Mapa"
                  : "Ver Ubicación en Mapa"
                : "Ubicación Geográfica No Disponible"}
            </Button>
            <Collapse in={showMap} timeout="auto" unmountOnExit>
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  height: 300,
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <iframe
                  title="Mapa de Ubicación"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${state.latitude},${state.longitude}&z=16&output=embed`}
                  allowFullScreen
                />
              </Paper>
            </Collapse>
          </Grid>
          
           
        </Grid>
      </DialogContent>
 
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="inherit">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ViewDetails;