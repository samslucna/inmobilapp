import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAdd } from "@mui/icons-material";
import TicketStore from "../../store/TicketStore";
import "semantic-ui-css/semantic.min.css";
export default function ModalDocIcon({ color, component, title, data, url }) {
  const { toExport } = TicketStore;
  const [open, setOpen] = useState(false);
  const [urlImp, setUrlImp] = useState("");

  const handleClickOpen = async () => {
    try {
      const pdfUrl = await toExport(
        url + data.id,
        data,
        "Relacion de recibos de cliente",
      );

      setUrlImp(pdfUrl);

      setOpen(true);
    } catch (error) {}
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Reemplaza con tu endpoint de Laravel

      const pdfUrl = await toExport(
        "api/contracts/export/pdf/contractExportTicketsPDF?id=" + data.id,
        "Relacion de recibos de cliente",
        data,
      );
    } catch (error) {
      console.error("Error al abrir pdf", error.response?.data);
      alert("Hubo un error al registrar");
    }
  };

  return (
    <>
      <button className="ui  button">
        <i
          onClick={handleClickOpen}
          id={"view" + data.id}
          className={color}
        ></i>
      </button>

      {urlImp && (
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: { width: "90%", height: "100vh" },
          }}
          maxWidth="lg"
        >
          <DialogContent>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setUrlImp("");
                  handleClose();
                }}
              >
                Cerrar Vista Previa
              </Button>
            </Stack>
            <DialogTitle>{title}</DialogTitle>
            <embed
              type="application/pdf"
              width={"100%"}
              height={"90%"}
              src={urlImp}
              title="contract"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
