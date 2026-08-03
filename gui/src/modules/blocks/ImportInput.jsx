import React, { useState, useRef } from "react";
import { Button, Box, Typography, IconButton, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import { observer } from "mobx-react-lite"; // Importante para reaccionar a cambios en MobX
import { useImportExcel } from "../../hooks/useImportExcel";
import { Toaster } from "react-hot-toast";
import ToastStore from "../../store/ToastStore";
import BlocksStore from "../../store/BlocksStore"; // Asegúrate de importar el store correcto

// Estilo para ocultar el input de forma accesible
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// Envolvemos en observer para que React reaccione a los estados de BlocksStore
const ImportInput = observer(() => {
  const { importExcel, loading } = useImportExcel(); // Asumiendo que tu hook retorna loading
  const [file, setFile] = useState(null); // Guardamos el Objeto File completo
  const inputRef = useRef(null); // Referencia para resetear el input HTML

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedExtensions = /(\.xlsx|\.xls|\.csv)$/i;

    // Validation basada en extensión (más confiable que file.type)
    if (!allowedExtensions.exec(selectedFile.name)) {
      ToastStore.showError(
        "Formato no válido. Solo se permiten archivos Excel (.xlsx, .xls, .csv)"
      );
      resetFileInput();
      return false;
    }

    if (selectedFile.size > maxSize) {
      ToastStore.showError("El archivo no debe exceder los 10MB");
      resetFileInput();
      return false;
    }

    setFile(selectedFile);
    BlocksStore.setUrlImp(selectedFile); // Guardamos el archivo real en el Store
    ToastStore.showSuccess(`Archivo seleccionado: ${selectedFile.name}`);
    return true;
  };

  const imporBtn = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      // ✅ PASAMOS EL OBJETO FILE REAL, NO SOLO EL STRING CON EL NOMBRE
      await importExcel(file, BlocksStore.importXlsBlocks);
      deleteFileHandle(e);
    } catch (error) {
      console.error("Error al importar:", error);
    }
  };

  const resetFileInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Limpia el elemento HTML
    }
  };

  const deleteFileHandle = (e) => {
    if (e) e.preventDefault();
    setFile(null);
    BlocksStore.setUrlImp("");
    resetFileInput();
  };

  return (
    <>
      <Toaster />
      <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2} gap={1.5}>
        {!file ? (
          <Button
            component="label"
            variant="contained"
            color="success"
            startIcon={<CloudUploadIcon />}
          >
            Subir Xls
            <VisuallyHiddenInput
              ref={inputRef}
              type="file"
              accept=".xlsx, .xls, .csv" // Restringe el diálogo de archivos nativo
              onChange={handleFileChange}
            />
          </Button>
        ) : (
          <>
            <Typography variant="body2" color="textSecondary">
              Seleccionado: <strong>{file.name}</strong>
            </Typography>

            <IconButton
              size="small"
              color="error"
              onClick={deleteFileHandle}
              disabled={loading}
            >
              <ClearIcon />
            </IconButton>

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={imporBtn}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            >
              {loading ? "Importando..." : "Importar"}
            </Button>
          </>
        )}
      </Box>
    </>
  );
});

export default ImportInput;