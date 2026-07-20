import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";
import { useImportExcel } from "../../hooks/useImportExcel";
import { Toaster } from "react-hot-toast";
import ToastStore from "../../store/ToastStore";
import TicketStore from "../../store/TicketStore";

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

const ImportInput = ({ btnMnSearch, btnMn }) => {
  const { importExcel } = useImportExcel();

  const [fileName, setFileName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const imporBtn = async (e) => {
    try {
      await importExcel(fileName, TicketStore.importXlsTickets);
      deleteFileHandle(e);
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
    TicketStore.setUrlImp(file);
    ToastStore.showSuccess(`Archivo seleccionado: ${file.name}`);
    return true;
  };

  const deleteFileHandle = (e) => {
    e.preventDefault();
    if (fileName !== "") {
      setFileName("");
      TicketStore.setUrlImp("");
    }
  };

  return (
    <>
      <Toaster />
      <Box display="flex" justifyContent="flex-end" mb={2}>
        {fileName === "" ? (
          <div className="import-btn-container">
            <ButtonGroup
              variant="outlined"
              aria-label="outlined button group"
              sx={{ mb: 2 }}
            >
              <Button
                component="label"
                variant="contained"
                sx={{ background: "#3d9241", color: "white" }}
                startIcon={<CloudUploadIcon />}
              >
                Importar
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileChange}
                  // accept="image/*" // Opcional: para limitar el tipo de archivos
                />
              </Button>
            </ButtonGroup>
          </div>
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
