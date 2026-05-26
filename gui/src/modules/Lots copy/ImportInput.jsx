import React, { useState } from "react";
import { Button, Box, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";
import PropertyStore from "../../store/PropertyStore";
import { useImportExcel } from "../../hooks/useImportExcel";
import { Toaster } from "react-hot-toast";
import ToastStore from "../../store/ToastStore";

// Estilo para ocultar el input real pero mantenerlo funcional
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

const ImportInput = () => {
    const { importExcel } = useImportExcel();
 
    const [fileName, setFileName] = useState("");

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        validateAndSetFile(file);
      }
    };
  
    const imporBtn = async (e) => {
      try {
        await importExcel(fileName, PropertyStore.importXlsProperties);
        deleteFileHandle(e)
    
      } catch (error) {
        console.log(error);
      }
    };
  
    const validateAndSetFile = (file) => {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
  
      const maxSize = 10 * 1024 * 1024; // 10MB
  
      if (
        !validTypes.includes(file.type) &&
        !file.name.match(/\.(xlsx|xls|csv)$/)
      ) {
        ToastStore.showError(
          "Formato no válido. Solo se permiten archivos Excel (.xlsx, .xls, .csv)",
        );
        return false;
      }
  
      if (file.size > maxSize) {
        ToastStore.showError("El archivo no debe exceder los 10MB");
        return false;
      }
  
      setFileName(file.name);
      // Aquí puedes procesar el archivo
      PropertyStore.setUrlImp(file);
      ToastStore.showSuccess(`Archivo seleccionado: ${file.name}`);
      return true;
    };
  
    const deleteFileHandle = (e) => {
      e.preventDefault();
      if (fileName !== "") {
        setFileName("");
        PropertyStore.setUrlImp("");
      }
    };

  return (
    <>
    <Toaster />
      <Box display="flex" justifyContent="flex-end" mb={2}>
        {fileName === "" ? (
          <Button
            component="label"
            variant="contained"
            sx={{ background: "green" }}
            startIcon={<CloudUploadIcon />}
          >
            Cargar archivo Xls
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange}
              // accept="image/*" // Opcional: para limitar el tipo de archivos
            />
          </Button>
        ) : null}

        {fileName && (
          <>
            <Typography variant="body2" mt={2} mb={2} color="textSecondary">
              Seleccionado: <strong>{fileName}</strong>
            </Typography>
            <IconButton
              sx={{ marginLeft: 2, color: "red" }}
              onClick={(e) => deleteFileHandle(e)}
            >
              <ClearIcon />
            </IconButton>
            <Button
              variant="small"
              onClick={(e) => imporBtn(e)}
              sx={{ marginLeft: 2, background: "gray" }}
              endIcon={<CloudUploadIcon />}
            >
              Importar
            </Button>
          </>
        )}
      </Box>
    </>
  );
};

export default ImportInput;
