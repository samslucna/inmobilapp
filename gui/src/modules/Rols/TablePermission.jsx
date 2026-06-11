import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { Add } from "@mui/icons-material";
import RolStore from "../../store/RolStore";
import Checkets from "./Components/Ckeckets";

const TablePermission = observer(({ permission }) => {
  const { loading, saving } = RolStore;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando configuración...</Typography>
      </Box>
    );
  }

  if (!permission || permission.length === 0) {
    return (
      <Alert 
        severity="info" 
        icon={<Add />}
        sx={{ m: 2 }}
      >
        <Typography variant="body1">
          No hay módulos configurados para este rol.
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Agrega módulos usando el botón "Agregar módulo" en la columna izquierda.
        </Typography>
      </Alert>
    );
  }

  return (
    <>
      {saving && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Guardando cambios...
        </Alert>
      )}
      
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table aria-label="tabla de permisos">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell width="5%">#</TableCell>
              <TableCell width="30%">Módulo</TableCell>
              <TableCell width="65%">Permisos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permission.map((module, index) => (
              <TableRow key={module.id || module.module || index} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                      {module.module?.charAt(0).toUpperCase() || "?"}
                    </Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {module.module?.charAt(0).toUpperCase() + module.module?.slice(1) || "Unknown"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Checkets 
                    module={module.module} 
                    permission={module}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
});

export default TablePermission;