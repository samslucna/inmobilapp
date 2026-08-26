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
  Stack,
  Card,
  CardContent,
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
  AttachMoney,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import changeFormat from "../../helper/changeFormat";

const ViewDetails = observer(({ open, state, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
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

  // Obtener ícono según el status
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "disponible":
        return <CheckCircle fontSize="small" />;
      case "pendiente":
        return <Warning fontSize="small" />;
      case "pagado":
      case "finiquitado":
        return <AttachMoney fontSize="small" />;
      default:
        return null;
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
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Receipt color="primary" />
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">
              Detalles del Lote #{state.id}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size={isMobile ? "small" : "medium"}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent 
        dividers 
        sx={{ 
          p: { xs: 1.5, sm: 2, md: 3 },
          overflowY: "auto",
        }}
      >
        <Grid container spacing={isMobile ? 1.5 : 2}>
          {/* Nombre y Ubicación del Proyecto */}
          <Grid item xs={12} sm={8}>
            <Typography variant="caption" color="textSecondary" display="block">
              Proyecto / Desarrollo
            </Typography>
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" color="primary">
              {state.project_name || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                mt: 0.5,
                fontSize: { xs: "0.75rem", sm: "0.875rem" }
              }}
            >
              <Business fontSize="inherit" sx={{ mr: 0.5 }} />
              {state.etapa || "Sin Etapa"}
            </Typography>
          </Grid>

          {/* Status del Lote */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                alignItems: { xs: "center", sm: "flex-end" },
                justifyContent: { xs: "space-between", sm: "flex-start" },
                mt: { xs: 0, sm: 0 },
              }}
            >
              <Typography variant="caption" color="textSecondary" display="block">
                Estatus
              </Typography>
              <Chip
                label={state.status?.toUpperCase() || "N/A"}
                color={getStatusColor(state.status)}
                icon={getStatusIcon(state.status)}
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  fontWeight: "bold",
                  mt: { xs: 0, sm: 0.5 },
                  "& .MuiChip-label": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }
                  }
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />
          </Grid>

          {/* Manzana, Lote y Fecha */}
          <Grid item xs={6} sm={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Manzana / Lote
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Avatar
                sx={{
                  width: { xs: 24, sm: 28, md: 32 },
                  height: { xs: 24, sm: 28, md: 32 },
                  bgcolor: "primary.main",
                  fontSize: { xs: 12, sm: 13, md: 14 },
                  fontWeight: "bold",
                }}
              >
                {state.manzana || "0"}
              </Avatar>
              <Typography variant="body2" fontWeight="bold">
                Lote {state.name || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Fecha de Contrato
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 0.5, 
                mt: 0.5,
                fontSize: { xs: "0.75rem", sm: "0.875rem" }
              }}
            >
              <Event fontSize="small" color="action" />
              {state.fecha_contrato ? state.fecha_contrato : "Sin Contrato"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Ubicación GPS
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 0.5,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                wordBreak: "break-all",
              }}
            >
              {state.latitude && state.longitude
                ? `${state.latitude}, ${state.longitude}`
                : "No disponible"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />
          </Grid>

          {/* Información Financiera */}
          <Grid item xs={12}>
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={isMobile ? 1 : 2}
            >
              <Card variant="outlined" sx={{ flex: 1 }}>
                <CardContent sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  "&:last-child": { pb: { xs: 1.5, sm: 2 } } 
                }}>
                  <Typography variant="caption" color="textSecondary" display="block" align="center">
                    Monto Inicial
                  </Typography>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    fontWeight="bold" 
                    align="center"
                    sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                  >
                    {changeFormat.numberToString(state.amount_init || 0)}
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ flex: 1 }}>
                <CardContent sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  "&:last-child": { pb: { xs: 1.5, sm: 2 } } 
                }}>
                  <Typography variant="caption" color="textSecondary" display="block" align="center">
                    Total Pagado
                  </Typography>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    fontWeight="bold" 
                    color="success.main"
                    align="center"
                    sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                  >
                    {changeFormat.numberToString(state.total_pagado || 0)}
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ flex: 1 }}>
                <CardContent sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  "&:last-child": { pb: { xs: 1.5, sm: 2 } } 
                }}>
                  <Typography variant="caption" color="textSecondary" display="block" align="center">
                    Saldo Pendiente
                  </Typography>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    fontWeight="bold" 
                    color={state.saldo > 0 ? "error.main" : "success.main"}
                    align="center"
                    sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                  >
                    {changeFormat.numberToString(state.saldo || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* BOTÓN Y SECCIÓN DEL MAPA (COLLAPSE) */}
          <Grid item xs={12} sx={{ mt: { xs: 1, sm: 2 } }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              disabled={!hasCoordinates}
              startIcon={<MapIcon />}
              endIcon={showMap ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowMap(!showMap)}
              size={isMobile ? "small" : "medium"}
              sx={{
                py: { xs: 1, sm: 1.5 },
                "& .MuiButton-startIcon": {
                  mr: { xs: 0.5, sm: 1 }
                }
              }}
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
                  height: { xs: 200, sm: 250, md: 300 },
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
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
                  loading="lazy"
                />
              </Paper>
            </Collapse>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 1 : 0,
      }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          color="inherit"
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ViewDetails;