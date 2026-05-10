import React, { useState } from "react";
import { Button, Box, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";
import ClientStore from "../../store/ClientStore";
import Swal from "sweetalert2";

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
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      // Aquí puedes procesar el archivo
      ClientStore.setUrlImp(file);
      console.log("Archivo seleccionado:", file);
    }
  };

  const imporBtn = (e) => {
    e.preventDefault();
    let timerInterval;

    Swal.fire({
      title: "Importando datos!",
      html: "I will close in <b></b> milliseconds.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      try {
        ClientStore.importXlsClients();
        setFileName('')
        ClientStore.setUrlImp("")
        if (result.dismiss === Swal.DismissReason.timer) {
          Swal.fire({
            title: "Importados",
            text: "la informacion se importo correctamente..",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error al importar",
          text: "Verique el orden de las columnas",
          icon: "warning",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };
  const deleteFileHandle = (e) => {
    e.preventDefault();
    if (fileName !== "") {
      setFileName("");
      ClientStore.setUrlImp("");
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        {fileName === "" ? (
          <Button
            component="label"
            variant="contained"
            sx={{ background: "green" }}
            startIcon={<CloudUploadIcon />}
          >
            Subir Xls
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
