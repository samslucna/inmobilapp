import { useState } from "react";
import {
  Button,
  Card,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Stack,
  DialogActions,
  Alert,
  Typography,
  Grid,
} from "@mui/material";

import StageStore from "../../store/StageStore";
import stageValidate from "../../validator/stageValidate";
import useValidatorForm from "../../hooks/useValidatorForm";
import SelectData from "./SelectData";
import ProjectStore from "../../store/ProjectStore";

export default function Form() {
  const { state, errors, handleChange, handleSubmit, handleBlur } =
    useValidatorForm(StageStore.stage, stageValidate, StageStore.addStage);

  const { id, project_id, name } = state;

  const saveStage = async (e) => {
    handleSubmit(e);
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            
            {id ===null? 'Nueva etapa' : 'Editar etapa'}
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ sm: 12, md: 6 }}>
              <SelectData name='project_id' value={typeof project_id === "object" ? project_id?.id : project_id} datas={ProjectStore.projects} onChange={handleChange} onBlur={handleBlur}  />

              <TextField
                mb={2}
                name="name"
                label="Nombre"
                fullWidth
                required
                value={name}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.name && <Alert severity="error">{errors.name}</Alert>}
            </Grid>
        
          </Grid>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                StageStore.setHiddenForm(false);
                StageStore.setEditing(false);
              }}
              sx={{ background: "gray", color: "whitesmoke" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => saveStage(e)}
            >
              Guardar
            </Button>
          </DialogActions>
        </Card>
      </Box>
    </>
  );
}
