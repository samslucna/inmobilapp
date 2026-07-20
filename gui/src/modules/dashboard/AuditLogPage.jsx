// pages/AuditLogsPage.jsx
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { DeleteSweep, Download } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import AuditLogTable from "./components/AuditLogTable";
import auditLogStore from "../../store/AuditLogStore";
import Swal from "sweetalert2";

const AuditLogsPage = observer(() => {
  const handleClearOld = async () => {
    const result = await Swal.fire({
      title: "Limpiar registros antiguos",
      text: "¿Cuántos días de registros deseas mantener?",
      input: "number",
      inputValue: 90,
      inputAttributes: {
        min: 1,
        max: 365,
      },
      showCancelButton: true,
      confirmButtonText: "Limpiar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed && result.value) {
      try {
        await auditLogStore.clearOldLogs(result.value);
        Swal.fire({
          title: "Completado",
          text: "Registros antiguos eliminados correctamente",
          icon: "success",
          timer: 1500,
        });
        auditLogStore.loadLogs();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudieron eliminar los registros",
          icon: "error",
        });
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          📋 Bitácora de Actividades
        </Typography>
        <Stack direction="row" spacing={2}>
     <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => auditLogStore.exportLogs(auditLogStore.filters)}
          >
            Exportar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweep />}
            onClick={handleClearOld}
          >
            Limpiar antiguos
          </Button>
        </Stack>
      </Box>
      
      <AuditLogTable />
    </Container>
  );
});

export default AuditLogsPage;