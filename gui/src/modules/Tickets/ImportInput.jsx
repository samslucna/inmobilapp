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

const ImportInput = ({ btnMnSearch, btnMn }) => {
  const { importExcel } = useImportExcel();

  const [fileName, setFileName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    if (e.target.id === "searchClient") {
      btnMn(e);
    } else {
      btnMnSearch(e);
    }
    setAnchorEl(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const imporBtn = async (e) => {
    try {
      await importExcel(fileName, PropertyStore.importXlsProperties);
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
              <Button
                id="main"
                sx={{ background: "#3d5b92", color: "white" }}
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                Buscar
              </Button>

              <Menu
                id="fade-menu"
                slotProps={{
                  list: {
                    "aria-labelledby": "fade-button",
                  },
                }}
                slots={{ transition: Fade }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem id="seachbydate" onClick={handleClose}>
                  Por fecha
                </MenuItem>
                <MenuItem id="searchClient" onClick={handleClose}>
                  Cliente
                </MenuItem>
              </Menu>
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
