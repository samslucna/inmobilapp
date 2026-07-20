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
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  PictureAsPdf,
} from "@mui/icons-material";
import TicketStore from "../../store/TicketStore";

export default function ModalMuiIconContract({
  color,
  component,
  title,
  data,
  url,
}) {
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


  return (
    <>
      <IconButton
        color={color || "secondary"}
        onClick={handleClickOpen}
        sx={{ mb: 2 }}
      >
        <PictureAsPdf fontSize="small" color="error" />
      </IconButton>

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
            <DialogTitle>Informacion Contrato</DialogTitle>
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
